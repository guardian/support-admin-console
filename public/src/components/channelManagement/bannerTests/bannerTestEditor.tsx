import React, { useEffect, useState } from 'react';
import {
  ArticlesViewedSettings,
  ConsentStatus,
  DeviceType,
  Methodology,
  RegionTargeting,
  SignedInStatus,
  UserCohort,
} from '../helpers/shared';
import { ARTICLE_COUNT_TEMPLATE } from '../helpers/validation';
import { Typography } from '@mui/material';
import VariantEditor from './variantEditor';
import CampaignSelector from '../CampaignSelector';
import VariantsEditor from '../../tests/variants/variantsEditor';
import TestEditorTargetAudienceSelector from '../testEditorTargetAudienceSelector';
import TestEditorArticleCountEditor, {
  DEFAULT_ARTICLES_VIEWED_SETTINGS,
} from '../testEditorArticleCountEditor';
import {
  BannerContent,
  BannerTest,
  BannerTestDeploySchedule,
  BannerVariant,
} from '../../../models/banner';
import { getDefaultVariant } from './utils/defaults';
import VariantSummary from '../../tests/variants/variantSummary';
import BannerVariantPreview from './bannerVariantPreview';
import { ControlProportionSettings } from '../helpers/controlProportionSettings';
import TestVariantsSplitEditor from '../../tests/variants/testVariantsSplitEditor';
import { useStyles } from '../helpers/testEditorStyles';
import { ValidatedTestEditorProps } from '../validatedTestEditor';
import { BannerDesign } from '../../../models/bannerDesign';
import {
  BannerDesignsResponse,
  fetchFrontendSettings,
  FrontendSettingsType,
} from '../../../utils/requests';
import TestEditorContextTargeting from '../testEditorContextTargeting';
import { getDesignForVariant } from '../../../utils/bannerDesigns';
import { DeployScheduleEditor } from './deployScheduleEditor';
import { TestMethodologyEditor } from '../TestMethodologyEditor';

const copyHasTemplate = (content: BannerContent, template: string): boolean =>
  (content.heading && content.heading.includes(template)) ||
  (content.paragraphs && content.paragraphs.some(para => para.includes(template))) ||
  (content.messageText != null && content.messageText.includes(template));

const testCopyHasTemplate = (test: BannerTest, template: string): boolean =>
  test.variants.some(
    variant =>
      (variant.bannerContent && copyHasTemplate(variant.bannerContent, template)) ||
      (variant.mobileBannerContent && copyHasTemplate(variant.mobileBannerContent, template)),
  );

const BannerTestEditor: React.FC<ValidatedTestEditorProps<BannerTest>> = ({
  test,
  userHasTestLocked,
  onTestChange,
  setValidationStatusForField,
}: ValidatedTestEditorProps<BannerTest>) => {
  const classes = useStyles();

  const [designs, setDesigns] = useState<BannerDesign[]>([]);

  const fetchBannerDesigns = (): void => {
    fetchFrontendSettings(FrontendSettingsType.bannerDesigns).then(
      (response: BannerDesignsResponse) => {
        setDesigns(response.bannerDesigns.filter(design => design.status === 'Live'));
      },
    );
  };

  useEffect(() => {
    fetchBannerDesigns();
  }, []);

  const getArticlesViewedSettings = (test: BannerTest): ArticlesViewedSettings | undefined => {
    if (!!test.articlesViewedSettings) {
      return test.articlesViewedSettings;
    }
    if (testCopyHasTemplate(test, ARTICLE_COUNT_TEMPLATE)) {
      return DEFAULT_ARTICLES_VIEWED_SETTINGS;
    }
    return undefined;
  };

  const updateTest = (update: (current: BannerTest) => BannerTest): void => {
    onTestChange(current => {
      const updatedTest = update(current);
      return {
        ...updatedTest,
        // To save dotcom from having to work this out
        articlesViewedSettings: getArticlesViewedSettings(updatedTest),
      };
    });
  };

  const onCampaignChange = (campaign?: string): void => {
    updateTest(current => ({
      ...current,
      campaignName: campaign,
    }));
  };

  const onMethodologyChange = (methodologies: Methodology[]): void => {
    setValidationStatusForField('methodologies', methodologies.length > 0);
    updateTest(current => ({ ...current, methodologies }));
  };

  const onArticlesViewedSettingsValidationChanged = (isValid: boolean): void =>
    setValidationStatusForField('articlesViewedSettings', isValid);

  const onVariantsSplitSettingsValidationChanged = (isValid: boolean): void =>
    setValidationStatusForField('variantsSplitSettings', isValid);

  const onControlProportionSettingsChange = (
    controlProportionSettings?: ControlProportionSettings,
  ): void => updateTest(current => ({ ...current, controlProportionSettings }));

  const onVariantsChange = (update: (current: BannerVariant[]) => BannerVariant[]): void => {
    updateTest(current => {
      const updatedVariantList = update(current.variants);
      return { ...current, variants: updatedVariantList };
    });
  };

  const onVariantChange = (variantName: string) => (
    update: (current: BannerVariant) => BannerVariant,
  ): void => {
    onVariantsChange(current =>
      current.map(variant => {
        if (variant.name === variantName) {
          return update(variant);
        }
        return variant;
      }),
    );
  };

  const onVariantDelete = (deletedVariantName: string): void => {
    onVariantsChange(current => current.filter(variant => variant.name !== deletedVariantName));
  };

  const onRegionTargetingChange = (updatedRegionTargeting: RegionTargeting): void => {
    updateTest(current => ({
      ...current,
      regionTargeting: updatedRegionTargeting,
      locations: [], // deprecated
    }));
  };

  const onCohortChange = (updatedCohort: UserCohort): void => {
    updateTest(current => ({ ...current, userCohort: updatedCohort }));
  };

  const onDeviceTypeChange = (updatedDeviceType: DeviceType): void => {
    updateTest(current => ({ ...current, deviceType: updatedDeviceType }));
  };

  const onSignedInStatusChange = (signedInStatus: SignedInStatus): void => {
    onTestChange(current => ({ ...current, signedInStatus }));
  };

  const onConsentStatusChange = (consentStatus: ConsentStatus): void => {
    onTestChange(current => ({ ...current, consentStatus }));
  };

  const onArticlesViewedSettingsChange = (
    updatedArticlesViewedSettings?: ArticlesViewedSettings,
  ): void => {
    updateTest(current => ({
      ...current,
      articlesViewedSettings: updatedArticlesViewedSettings,
    }));
  };

  const onDeployScheduleChange = (updatedDeploySchedule?: BannerTestDeploySchedule): void => {
    updateTest(current => ({
      ...current,
      deploySchedule: updatedDeploySchedule,
    }));
  };

  const renderVariantEditor = (variant: BannerVariant): React.ReactElement => (
    <VariantEditor
      key={`banner-${test.name}-${variant.name}`}
      variant={variant}
      onVariantChange={onVariantChange(variant.name)}
      onDelete={(): void => onVariantDelete(variant.name)}
      editMode={userHasTestLocked}
      designs={designs}
      onValidationChange={(isValid: boolean): void =>
        setValidationStatusForField(variant.name, isValid)
      }
    />
  );

  const renderVariantSummary = (variant: BannerVariant): React.ReactElement => {
    const design = getDesignForVariant(variant, designs);

    return (
      <VariantSummary
        name={variant.name}
        testName={test.name}
        testType="BANNER"
        isInEditMode={userHasTestLocked}
        topButton={<BannerVariantPreview variant={variant} design={design} />}
        platform="DOTCOM" // hardcoded as banners are currently not supported in AMP or Apple News
        articleType="Standard"
      />
    );
  };

  const createVariant = (name: string): void => {
    const newVariant: BannerVariant = {
      ...getDefaultVariant(),
      name: name,
    };
    onVariantsChange(current => [...current, newVariant]);
  };

  const onVariantClone = (originalVariant: BannerVariant, clonedVariantName: string): void => {
    const newVariant: BannerVariant = {
      ...originalVariant,
      name: clonedVariantName,
    };
    onVariantsChange(current => [...current, newVariant]);
  };

  if (test) {
    return (
      <div className={classes.container}>
        <div className={classes.sectionContainer}>
          <Typography variant={'h3'} className={classes.sectionHeader}>
            Variants
          </Typography>
          <div>
            <VariantsEditor
              variants={test.variants}
              createVariant={createVariant}
              testName={test.name}
              editMode={userHasTestLocked}
              renderVariantEditor={renderVariantEditor}
              renderVariantSummary={renderVariantSummary}
              onVariantDelete={onVariantDelete}
              onVariantClone={onVariantClone}
            />
          </div>
        </div>

        <div className={classes.sectionContainer}>
          <Typography variant={'h3'} className={classes.sectionHeader}>
            Experiment Methodology
          </Typography>
          <TestMethodologyEditor
            methodologies={test.methodologies}
            testName={test.name}
            channel={test.channel ?? ''}
            isDisabled={!userHasTestLocked || test.status === 'Live'}
            onChange={onMethodologyChange}
          />
        </div>

        {test.variants.length > 1 && (
          <div className={classes.sectionContainer}>
            <Typography variant={'h3'} className={classes.sectionHeader}>
              Variants split (applies to AB tests only)
            </Typography>
            <div>
              <TestVariantsSplitEditor
                variants={test.variants}
                controlProportionSettings={test.controlProportionSettings}
                onControlProportionSettingsChange={onControlProportionSettingsChange}
                onValidationChange={onVariantsSplitSettingsValidationChanged}
                isDisabled={!userHasTestLocked}
              />
            </div>
          </div>
        )}

        <div className={classes.sectionContainer}>
          <Typography variant={'h3'} className={classes.sectionHeader}>
            Campaign
          </Typography>
          <div>
            <CampaignSelector
              test={test}
              onCampaignChange={onCampaignChange}
              disabled={!userHasTestLocked}
            />
          </div>
        </div>

        <div className={classes.sectionContainer}>
          <Typography variant={'h3'} className={classes.sectionHeader}>
            Target context
          </Typography>

          <TestEditorContextTargeting
            contextTargeting={test.contextTargeting}
            editMode={userHasTestLocked}
            updateContextTargeting={contextTargeting =>
              updateTest(current => ({ ...current, contextTargeting }))
            }
          />
        </div>

        <div className={classes.sectionContainer}>
          <Typography variant={'h3'} className={classes.sectionHeader}>
            Target audience
          </Typography>

          <TestEditorTargetAudienceSelector
            regionTargeting={
              test.regionTargeting ?? {
                // For backwards compatibility with the deprecated locations field
                targetedCountryGroups: test.locations,
                targetedCountryCodes: [],
              }
            }
            onRegionTargetingUpdate={onRegionTargetingChange}
            selectedCohort={test.userCohort}
            onCohortChange={onCohortChange}
            selectedDeviceType={test.deviceType ?? 'All'}
            onDeviceTypeChange={onDeviceTypeChange}
            isDisabled={!userHasTestLocked}
            showSupporterStatusSelector={true}
            showDeviceTypeSelector={true}
            showSignedInStatusSelector={true}
            selectedSignedInStatus={test.signedInStatus}
            onSignedInStatusChange={onSignedInStatusChange}
            selectedConsentStatus={test.consentStatus}
            onConsentStatusChange={onConsentStatusChange}
            showConsentStatusSelector={true}
          />
        </div>

        <div className={classes.sectionContainer}>
          <Typography variant={'h3'} className={classes.sectionHeader}>
            Article count
          </Typography>

          <TestEditorArticleCountEditor
            articlesViewedSettings={test.articlesViewedSettings}
            onArticlesViewedSettingsChanged={onArticlesViewedSettingsChange}
            onValidationChange={onArticlesViewedSettingsValidationChanged}
            isDisabled={!userHasTestLocked}
          />
        </div>

        <div className={classes.sectionContainer}>
          <Typography variant={'h3'} className={classes.sectionHeader}>
            Deploy schedule override
          </Typography>

          <DeployScheduleEditor
            deploySchedule={test.deploySchedule}
            onDeployScheduleChange={onDeployScheduleChange}
            onValidationChange={isValid => setValidationStatusForField('deploySchedule', isValid)}
            isDisabled={!userHasTestLocked}
          />
        </div>
      </div>
    );
  }
  return null;
};

export default BannerTestEditor;
