import { Alert } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import {
  BannerContent,
  BannerTest,
  BannerTestDeploySchedule,
  BannerVariant,
} from '../../../models/banner';
import { BannerDesign } from '../../../models/bannerDesign';
import {
  BannerDesignsResponse,
  fetchFrontendSettings,
  FrontendSettingsType,
} from '../../../utils/requests';
import TestVariantsSplitEditor from '../../tests/variants/testVariantsSplitEditor';
import VariantsEditor from '../../tests/variants/variantsEditor';
import VariantSummary from '../../tests/variants/variantSummary';
import CampaignSelector from '../CampaignSelector';
import { ControlProportionSettings } from '../helpers/controlProportionSettings';
import {
  ArticlesViewedSettings,
  ConsentStatus,
  DeviceType,
  Methodology,
  RegionTargeting,
  SignedInStatus,
  UserCohort,
} from '../helpers/shared';
import { Container, SectionContainer, SectionHeader } from '../helpers/testEditorStyles';
import { ARTICLE_COUNT_TEMPLATE } from '../helpers/validation';
import ScheduleEditor from '../scheduleEditor';
import TestEditorArticleCountEditor, {
  DEFAULT_ARTICLES_VIEWED_SETTINGS,
} from '../testEditorArticleCountEditor';
import TestEditorContextTargeting from '../testEditorContextTargeting';
import TestEditorTargetAudienceSelector from '../testEditorTargetAudienceSelector';
import { TestMethodologyEditor } from '../TestMethodologyEditor';
import { ValidatedTestEditorProps } from '../validatedTestEditor';
import { DeployScheduleEditor } from './deployScheduleEditor';
import { FrontsOnlyEditor } from './frontsOnlyEditor';
import { getDefaultVariant } from './utils/defaults';
import { findMParticleTemplates } from './utils/findMParticleTemplates';
import VariantEditor from './variantEditor';

const copyHasTemplate = (content: BannerContent, template: string): boolean =>
  Boolean(content.heading?.includes(template)) ||
  content.paragraphs.some((para) => para.includes(template)) ||
  Boolean(content.messageText?.includes(template));

const testCopyHasTemplate = (test: BannerTest, template: string): boolean =>
  test.variants.some(
    (variant) =>
      copyHasTemplate(variant.bannerContent, template) ||
      (variant.mobileBannerContent && copyHasTemplate(variant.mobileBannerContent, template)),
  );

const BannerTestEditor: React.FC<ValidatedTestEditorProps<BannerTest>> = ({
  test,
  userHasTestLocked,
  showMParticleMenu,
  onTestChange,
  setValidationStatusForField,
}: ValidatedTestEditorProps<BannerTest>) => {
  const [designs, setDesigns] = useState<BannerDesign[]>([]);

  const fetchBannerDesigns = (): void => {
    void fetchFrontendSettings(FrontendSettingsType.BannerDesigns).then(
      (response: BannerDesignsResponse) => {
        setDesigns(response.bannerDesigns.filter((design) => design.status === 'Live'));
      },
    );
  };

  useEffect(() => {
    fetchBannerDesigns();
  }, []);

  const getArticlesViewedSettings = (test: BannerTest): ArticlesViewedSettings | undefined => {
    if (test.articlesViewedSettings) {
      return test.articlesViewedSettings;
    }
    if (testCopyHasTemplate(test, ARTICLE_COUNT_TEMPLATE)) {
      return DEFAULT_ARTICLES_VIEWED_SETTINGS;
    }
    return undefined;
  };

  const onTestChangeRef = useRef(onTestChange);
  const getArticlesViewedSettingsRef = useRef(getArticlesViewedSettings);

  useEffect(() => {
    onTestChangeRef.current = onTestChange;
    getArticlesViewedSettingsRef.current = getArticlesViewedSettings;
  });

  const updateTest = (update: (current: BannerTest) => BannerTest): void => {
    onTestChangeRef.current((current) => {
      const updatedTest = update(current);
      return {
        ...updatedTest,
        // To save dotcom from having to work this out
        articlesViewedSettings: getArticlesViewedSettingsRef.current(updatedTest),
        mParticleTemplates: findMParticleTemplates(updatedTest),
      };
    });
  };

  const onCampaignChange = (campaign?: string): void => {
    updateTest((current) => ({
      ...current,
      campaignName: campaign,
    }));
  };

  const onMethodologyChange = (methodologies: Methodology[]): void => {
    setValidationStatusForField('methodologies', methodologies.length > 0);
    updateTest((current) => ({ ...current, methodologies }));
  };

  const onArticlesViewedSettingsValidationChanged = (isValid: boolean): void =>
    setValidationStatusForField('articlesViewedSettings', isValid);

  const onVariantsSplitSettingsValidationChanged = (isValid: boolean): void =>
    setValidationStatusForField('variantsSplitSettings', isValid);

  const onControlProportionSettingsChange = (
    controlProportionSettings?: ControlProportionSettings,
  ): void => updateTest((current) => ({ ...current, controlProportionSettings }));

  const onVariantsChange = (update: (current: BannerVariant[]) => BannerVariant[]): void => {
    updateTest((current) => {
      const updatedVariantList = update(current.variants);
      return { ...current, variants: updatedVariantList };
    });
  };

  const onVariantDelete = (deletedVariantName: string): void => {
    onVariantsChange((current) => current.filter((variant) => variant.name !== deletedVariantName));
  };

  const onRegionTargetingChange = (updatedRegionTargeting: RegionTargeting): void => {
    updateTest((current) => ({
      ...current,
      regionTargeting: updatedRegionTargeting,
      locations: [], // deprecated
    }));
  };

  const onCohortChange = (updatedCohort: UserCohort): void => {
    updateTest((current) => ({ ...current, userCohort: updatedCohort }));
  };

  const onDeviceTypeChange = (updatedDeviceType: DeviceType): void => {
    updateTest((current) => ({ ...current, deviceType: updatedDeviceType }));
  };

  const onSignedInStatusChange = (signedInStatus: SignedInStatus): void => {
    onTestChange((current) => ({ ...current, signedInStatus }));
  };

  const onConsentStatusChange = (consentStatus: ConsentStatus): void => {
    onTestChange((current) => ({ ...current, consentStatus }));
  };

  const onArticlesViewedSettingsChange = (
    updatedArticlesViewedSettings?: ArticlesViewedSettings,
  ): void => {
    // Bypass updateTest to avoid re-calculation, go directly to onTestChange
    onTestChange((current) => ({
      ...current,
      articlesViewedSettings: updatedArticlesViewedSettings,
    }));
  };

  const onDeployScheduleChange = (updatedDeploySchedule?: BannerTestDeploySchedule): void => {
    updateTest((current) => ({
      ...current,
      deploySchedule: updatedDeploySchedule,
    }));
  };

  const onFrontsOnlyChange = (frontsOnly: boolean): void => {
    updateTest((current) => ({
      ...current,
      frontsOnly,
    }));
  };

  const onMParticleAudienceChange = (mParticleAudience?: number): void => {
    onTestChange((current) => ({ ...current, mParticleAudience }));
  };

  // Memoize callbacks by variant name to prevent infinite render loops
  // Using refs to store callbacks to avoid dependency issues with useCallback
  const validationCallbacksRef = useRef<Map<string, (isValid: boolean) => void>>(new Map());
  const variantChangeCallbacksRef = useRef<
    Map<string, (update: (current: BannerVariant) => BannerVariant) => void>
  >(new Map());
  const setValidationStatusRef = useRef(setValidationStatusForField);
  const onVariantsChangeRef = useRef(onVariantsChange);

  // Keep refs up to date without triggering re-renders
  useEffect(() => {
    setValidationStatusRef.current = setValidationStatusForField;
    onVariantsChangeRef.current = onVariantsChange;
  });

  // Validate mParticle audience constraint: if mParticle audience is set and can target signed-out users,
  // then article count must have minViews >= 5
  useEffect(() => {
    const requiresArticleCount =
      test.mParticleAudience !== undefined && test.signedInStatus !== 'SignedIn';
    const isValid =
      !requiresArticleCount ||
      (test.articlesViewedSettings !== undefined && test.articlesViewedSettings.minViews >= 5);
    setValidationStatusForField('mParticleAudience', isValid);
  }, [
    test.mParticleAudience,
    test.signedInStatus,
    test.articlesViewedSettings,
    setValidationStatusForField,
  ]);

  const getValidationCallback = (variantName: string): ((isValid: boolean) => void) => {
    if (!validationCallbacksRef.current.has(variantName)) {
      validationCallbacksRef.current.set(variantName, (isValid: boolean): void =>
        setValidationStatusRef.current(variantName, isValid),
      );
    }
    return validationCallbacksRef.current.get(variantName)!;
  };

  const getVariantChangeCallback = (
    variantName: string,
  ): ((update: (current: BannerVariant) => BannerVariant) => void) => {
    if (!variantChangeCallbacksRef.current.has(variantName)) {
      variantChangeCallbacksRef.current.set(
        variantName,
        (update: (current: BannerVariant) => BannerVariant): void => {
          onVariantsChangeRef.current((current) =>
            current.map((variant) => {
              if (variant.name === variantName) {
                return update(variant);
              }
              return variant;
            }),
          );
        },
      );
    }
    return variantChangeCallbacksRef.current.get(variantName)!;
  };

  const renderVariantEditor = (variant: BannerVariant): React.ReactElement => (
    <VariantEditor
      key={`banner-${test.name}-${variant.name}`}
      variant={variant}
      showMParticleMenu={showMParticleMenu}
      onVariantChange={getVariantChangeCallback(variant.name)}
      onDelete={(): void => onVariantDelete(variant.name)}
      editMode={userHasTestLocked}
      designs={designs}
      onValidationChange={getValidationCallback(variant.name)}
    />
  );

  const renderVariantSummary = (variant: BannerVariant): React.ReactElement => {
    return (
      <VariantSummary
        name={variant.name}
        testName={test.name}
        testType="BANNER"
        isInEditMode={userHasTestLocked}
        platform="DOTCOM" // hardcoded as banners are currently not supported in Apple News
        articleType="Standard"
      />
    );
  };

  const createVariant = (name: string): void => {
    const newVariant: BannerVariant = {
      ...getDefaultVariant(),
      name: name,
    };
    onVariantsChange((current) => [...current, newVariant]);
  };

  const onVariantClone = (originalVariant: BannerVariant, clonedVariantName: string): void => {
    const newVariant: BannerVariant = {
      ...originalVariant,
      name: clonedVariantName,
    };
    onVariantsChange((current) => [...current, newVariant]);
  };

  return (
    <Container>
      <SectionContainer>
        <SectionHeader variant={'h3'}>Variants</SectionHeader>
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
      </SectionContainer>

      <SectionContainer>
        <SectionHeader variant={'h3'}>Experiment Methodology</SectionHeader>
        <TestMethodologyEditor
          methodologies={test.methodologies}
          testName={test.name}
          channel={test.channel ?? ''}
          isDisabled={!userHasTestLocked || test.status === 'Live'}
          onChange={onMethodologyChange}
        />
      </SectionContainer>

      {test.variants.length > 1 && (
        <SectionContainer>
          <SectionHeader variant={'h3'}>Variants split (applies to AB tests only)</SectionHeader>
          <div>
            <TestVariantsSplitEditor
              variants={test.variants}
              controlProportionSettings={test.controlProportionSettings}
              onControlProportionSettingsChange={onControlProportionSettingsChange}
              onValidationChange={onVariantsSplitSettingsValidationChanged}
              isDisabled={!userHasTestLocked}
            />
          </div>
        </SectionContainer>
      )}

      <SectionContainer>
        <SectionHeader variant={'h3'}>Campaign</SectionHeader>
        <div>
          <CampaignSelector
            test={test}
            onCampaignChange={onCampaignChange}
            disabled={!userHasTestLocked}
          />
        </div>
      </SectionContainer>

      <SectionContainer>
        <SectionHeader variant={'h3'}>Target context</SectionHeader>

        <TestEditorContextTargeting
          contextTargeting={test.contextTargeting}
          editMode={userHasTestLocked}
          updateContextTargeting={(contextTargeting) =>
            updateTest((current) => ({ ...current, contextTargeting }))
          }
        />
      </SectionContainer>

      <SectionContainer>
        <SectionHeader variant={'h3'}>Target audience</SectionHeader>

        <TestEditorTargetAudienceSelector
          regionTargeting={test.regionTargeting}
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
          mParticleAudienceEditor={{
            mParticleAudience: test.mParticleAudience,
            onMParticleAudienceChange: onMParticleAudienceChange,
          }}
          mParticleAudienceValidation={
            !(test.mParticleAudience !== undefined && test.signedInStatus !== 'SignedIn') ||
            (test.articlesViewedSettings !== undefined && test.articlesViewedSettings.minViews >= 5)
          }
        />
      </SectionContainer>

      <SectionContainer>
        <SectionHeader variant={'h3'}>Article count</SectionHeader>

        {test.mParticleAudience !== undefined && test.signedInStatus !== 'SignedIn' && (
          <Alert severity="info" style={{ marginBottom: '16px' }}>
            mParticle audience targeting of signed-out users requires minimum article count ≥ 5.
          </Alert>
        )}

        <TestEditorArticleCountEditor
          articlesViewedSettings={test.articlesViewedSettings}
          onArticlesViewedSettingsChanged={onArticlesViewedSettingsChange}
          onValidationChange={onArticlesViewedSettingsValidationChanged}
          isDisabled={!userHasTestLocked}
        />
      </SectionContainer>

      <SectionContainer>
        <SectionHeader variant={'h3'}>Deploy schedule override</SectionHeader>

        <DeployScheduleEditor
          deploySchedule={test.deploySchedule}
          onDeployScheduleChange={onDeployScheduleChange}
          onValidationChange={(isValid) => setValidationStatusForField('deploySchedule', isValid)}
          isDisabled={!userHasTestLocked}
        />
      </SectionContainer>

      <SectionContainer>
        <SectionHeader variant={'h3'}>Fronts only</SectionHeader>

        <FrontsOnlyEditor
          frontsOnly={test.frontsOnly}
          onFrontsOnlyChange={onFrontsOnlyChange}
          isDisabled={!userHasTestLocked}
        />
      </SectionContainer>

      <SectionContainer>
        <SectionHeader variant={'h3'}>Schedule</SectionHeader>
        <ScheduleEditor
          scheduler={test.scheduler}
          disabled={!userHasTestLocked}
          onChange={(scheduler) => onTestChange((current) => ({ ...current, scheduler }))}
          onValidationChange={(isValid) => setValidationStatusForField('schedule', isValid)}
        />
      </SectionContainer>
    </Container>
  );
};

export default BannerTestEditor;
