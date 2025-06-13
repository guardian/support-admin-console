import React from 'react';
import { EpicTest, EpicVariant, MaxEpicViews } from '../../../models/epic';
import {
  ArticlesViewedSettings,
  UserCohort,
  EpicEditorConfig,
  DeviceType,
  SignedInStatus,
  PageContextTargeting,
  ConsentStatus,
  Methodology,
  RegionTargeting,
} from '../helpers/shared';
import { FormControlLabel, Switch, Typography } from '@mui/material';
import CampaignSelector from '../CampaignSelector';
import VariantsEditor from '../../tests/variants/variantsEditor';
import VariantSummary from '../../tests/variants/variantSummary';
import TestEditorTargetAudienceSelector from '../testEditorTargetAudienceSelector';
import TestEditorArticleCountEditor, {
  DEFAULT_ARTICLES_VIEWED_SETTINGS,
} from '../testEditorArticleCountEditor';
import VariantEditorWithPreviewTab from '../../tests/variants/variantEditorWithPreviewTab';
import VariantEditor from './variantEditor';
import VariantPreview from './variantPreview';
import TestEditorContextTargeting from '../testEditorContextTargeting';
import MaxViewsEditor from './maxViewsEditor';
import { ARTICLE_COUNT_TEMPLATE, COUNTRY_NAME_TEMPLATE } from '../helpers/validation';
import TestVariantsSplitEditor from '../../tests/variants/testVariantsSplitEditor';
import { getDefaultVariant } from './utils/defaults';
import {
  canHaveCustomVariantSplit,
  ControlProportionSettings,
} from '../helpers/controlProportionSettings';
import { useStyles } from '../helpers/testEditorStyles';
import { EpicTestPreviewButton } from './testPreview';
import { ValidatedTestEditor, ValidatedTestEditorProps } from '../validatedTestEditor';
import { TestEditorProps } from '../testsForm';
import { TestMethodologyEditor } from '../TestMethodologyEditor';

const copyHasTemplate = (test: EpicTest, template: string): boolean =>
  test.variants.some(
    variant =>
      (variant.heading && variant.heading.includes(template)) ||
      variant.paragraphs.some(para => para.includes(template)),
  );

export const getEpicTestEditor = (
  epicEditorConfig: EpicEditorConfig,
): React.FC<TestEditorProps<EpicTest>> => {
  const EpicTestEditor = ({
    test,
    userHasTestLocked,
    onTestChange,
    setValidationStatusForField,
  }: ValidatedTestEditorProps<EpicTest>) => {
    const classes = useStyles();

    const onMaxViewsValidationChange = (isValid: boolean): void =>
      setValidationStatusForField('maxViews', isValid);

    const onArticlesViewedSettingsValidationChanged = (isValid: boolean): void =>
      setValidationStatusForField('articlesViewedSettings', isValid);

    const onVariantsSplitSettingsValidationChanged = (isValid: boolean): void =>
      setValidationStatusForField('variantsSplitSettings', isValid);

    const getArticlesViewedSettings = (test: EpicTest): ArticlesViewedSettings | undefined => {
      if (!!test.articlesViewedSettings) {
        return test.articlesViewedSettings;
      }
      if (epicEditorConfig.allowArticleCount && copyHasTemplate(test, ARTICLE_COUNT_TEMPLATE)) {
        return DEFAULT_ARTICLES_VIEWED_SETTINGS;
      }
      return undefined;
    };

    const updateTest = (update: (current: EpicTest) => EpicTest): void => {
      onTestChange(current => {
        const updatedTest = update(current);
        return {
          ...updatedTest,
          // To save dotcom from having to work this out
          hasCountryName: copyHasTemplate(updatedTest, COUNTRY_NAME_TEMPLATE),
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

    const onVariantsChange = (update: (current: EpicVariant[]) => EpicVariant[]): void => {
      updateTest(current => {
        const updatedVariantList = update(current.variants);
        return { ...current, variants: updatedVariantList };
      });
    };

    const onVariantChange = (variantName: string) => (
      update: (current: EpicVariant) => EpicVariant,
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

    const onVariantDelete = (deletedVariantName: string): void =>
      updateTest(current => {
        const updatedVariantList = current.variants.filter(
          variant => variant.name !== deletedVariantName,
        );
        const controlProportionSettings = canHaveCustomVariantSplit(updatedVariantList)
          ? test.controlProportionSettings
          : undefined;

        return {
          ...current,
          variants: updatedVariantList,
          controlProportionSettings,
        };
      });

    const createVariant = (name: string): void => {
      const newVariant: EpicVariant = {
        ...getDefaultVariant(),
        name: name,
      };
      onVariantsChange(current => [...current, newVariant]);
    };

    const onVariantClone = (originalVariant: EpicVariant, clonedVariantName: string): void => {
      const newVariant: EpicVariant = {
        ...originalVariant,
        name: clonedVariantName,
      };
      onVariantsChange(current => [...current, newVariant]);
    };

    const onSwitchChange = (fieldName: string) => (
      event: React.ChangeEvent<HTMLInputElement>,
    ): void => {
      const updatedBool = event.target.checked;
      updateTest(current => ({ ...current, [fieldName]: updatedBool }));
    };

    const updateContextTargeting = (contextTargeting: PageContextTargeting): void => {
      updateTest(current => ({
        ...current,
        tagIds: contextTargeting.tagIds,
        sections: contextTargeting.sectionIds,
        excludedTagIds: contextTargeting.excludedTagIds,
        excludedSections: contextTargeting.excludedSectionIds,
      }));
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

    const onConsentChange = (consentStatus: ConsentStatus): void => {
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

    const onMaxViewsChange = (updatedMaxViews?: MaxEpicViews): void => {
      updateTest(current => ({
        ...current,
        alwaysAsk: !updatedMaxViews,
        maxViews: updatedMaxViews,
      }));
    };

    const onControlProportionSettingsChange = (
      controlProportionSettings?: ControlProportionSettings,
    ): void => updateTest(current => ({ ...current, controlProportionSettings }));

    const renderVariantEditor = (variant: EpicVariant): React.ReactElement => (
      <VariantEditorWithPreviewTab
        variantEditor={
          <VariantEditor
            epicEditorConfig={epicEditorConfig}
            key={variant.name}
            variant={variant}
            editMode={userHasTestLocked}
            onVariantChange={onVariantChange(variant.name)}
            onDelete={(): void => onVariantDelete(variant.name)}
            onValidationChange={(isValid: boolean): void =>
              setValidationStatusForField(variant.name, isValid)
            }
          />
        }
        variantPreview={
          epicEditorConfig.allowVariantPreview ? (
            <VariantPreview variant={variant} moduleName={epicEditorConfig.moduleName} />
          ) : (
            undefined
          )
        }
      />
    );

    const renderVariantSummary = (variant: EpicVariant): React.ReactElement => (
      <VariantSummary
        name={variant.name}
        testName={test.name}
        testType="EPIC"
        isInEditMode={userHasTestLocked}
        platform={epicEditorConfig.platform}
        articleType={
          epicEditorConfig.moduleName === 'ContributionsLiveblogEpic' ? 'Liveblog' : 'Standard'
        }
      />
    );

    return (
      <div className={classes.container}>
        {epicEditorConfig.allowMultipleVariants && (
          <div className={classes.sectionContainer}>
            <div className={classes.variantsHeaderContainer}>
              <Typography variant={'h3'} className={classes.sectionHeader}>
                Variants
              </Typography>
              <div className={classes.variantsHeaderButtonsContainer}>
                <EpicTestPreviewButton test={test} moduleName={epicEditorConfig.moduleName} />
              </div>
            </div>
            <div>
              <VariantsEditor<EpicVariant>
                variants={test.variants}
                testName={test.name}
                editMode={userHasTestLocked}
                createVariant={createVariant}
                renderVariantEditor={renderVariantEditor}
                renderVariantSummary={renderVariantSummary}
                onVariantDelete={onVariantDelete}
                onVariantClone={onVariantClone}
              />
            </div>
          </div>
        )}
        {epicEditorConfig.allowMethodologyEditor && (
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
        )}

        {epicEditorConfig.allowCustomVariantSplit && canHaveCustomVariantSplit(test.variants) && (
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

        {!epicEditorConfig.allowMultipleVariants && (
          <div className={classes.sectionContainer} key={test.name}>
            <Typography variant={'h3'} className={classes.sectionHeader}>
              Copy
            </Typography>

            <div>
              <VariantEditor
                key={test.variants[0].name}
                variant={test.variants[0]}
                epicEditorConfig={epicEditorConfig}
                editMode={userHasTestLocked}
                onVariantChange={onVariantChange(test.variants[0].name)}
                onDelete={(): void => onVariantDelete(test.variants[0].name)}
                onValidationChange={(isValid: boolean): void =>
                  setValidationStatusForField(test.variants[0].name, isValid)
                }
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

        {epicEditorConfig.allowContentTargeting && (
          <div className={classes.sectionContainer}>
            <Typography variant={'h3'} className={classes.sectionHeader}>
              Target content
            </Typography>

            <TestEditorContextTargeting
              contextTargeting={{
                tagIds: test.tagIds,
                sectionIds: test.sections,
                excludedTagIds: test.excludedTagIds,
                excludedSectionIds: test.excludedSections,
              }}
              editMode={userHasTestLocked}
              updateContextTargeting={updateContextTargeting}
            />
          </div>
        )}

        {epicEditorConfig.allowLocationTargeting && (
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
              supportedRegions={epicEditorConfig.supportedRegions}
              selectedDeviceType={test.deviceType ?? 'All'}
              onDeviceTypeChange={onDeviceTypeChange}
              isDisabled={!userHasTestLocked}
              showSupporterStatusSelector={epicEditorConfig.allowSupporterStatusTargeting}
              showDeviceTypeSelector={epicEditorConfig.allowDeviceTypeTargeting}
              showSignedInStatusSelector={epicEditorConfig.showSignedInStatusSelector}
              selectedSignedInStatus={test.signedInStatus}
              onSignedInStatusChange={onSignedInStatusChange}
              selectedConsentStatus={test.consentStatus}
              onConsentStatusChange={onConsentChange}
              showConsentStatusSelector={false}
              platform={epicEditorConfig.platform}
            />
          </div>
        )}

        {epicEditorConfig.allowViewFrequencySettings && (
          <div className={classes.sectionContainer}>
            <Typography variant={'h3'} className={classes.sectionHeader}>
              View frequency settings
            </Typography>

            <FormControlLabel
              control={
                <Switch
                  checked={test.useLocalViewLog}
                  onChange={onSwitchChange('useLocalViewLog')}
                  disabled={!userHasTestLocked}
                />
              }
              label={`Use private view counter for this test (instead of the global one)`}
            />

            <MaxViewsEditor
              maxEpicViews={test.alwaysAsk ? undefined : test.maxViews}
              isDisabled={!userHasTestLocked}
              onMaxViewsChanged={onMaxViewsChange}
              onValidationChange={onMaxViewsValidationChange}
            />
          </div>
        )}

        {epicEditorConfig.allowArticleCount && (
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
        )}
      </div>
    );
  };
  return ValidatedTestEditor(EpicTestEditor, epicEditorConfig.testNamePrefix);
};
