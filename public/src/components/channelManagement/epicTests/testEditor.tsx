import { FormControlLabel, Switch } from '@mui/material';
import React, { useEffect, useRef } from 'react';
import { EpicTest, EpicVariant, MaxEpicViews } from '../../../models/epic';
import TestVariantsSplitEditor from '../../tests/variants/testVariantsSplitEditor';
import VariantEditorWithPreviewTab from '../../tests/variants/variantEditorWithPreviewTab';
import VariantsEditor from '../../tests/variants/variantsEditor';
import VariantSummary from '../../tests/variants/variantSummary';
import CampaignSelector from '../CampaignSelector';
import {
  canHaveCustomVariantSplit,
  ControlProportionSettings,
} from '../helpers/controlProportionSettings';
import {
  ArticlesViewedSettings,
  ConsentStatus,
  DeviceType,
  EpicEditorConfig,
  Methodology,
  PageContextTargeting,
  RegionTargeting,
  SignedInStatus,
  UserCohort,
} from '../helpers/shared';
import {
  Container,
  SectionContainer,
  SectionHeader,
  VariantsHeaderButtonsContainer,
  VariantsHeaderContainer,
} from '../helpers/testEditorStyles';
import { ARTICLE_COUNT_TEMPLATE, COUNTRY_NAME_TEMPLATE } from '../helpers/validation';
import ScheduleEditor from '../scheduleEditor';
import TestEditorArticleCountEditor, {
  DEFAULT_ARTICLES_VIEWED_SETTINGS,
} from '../testEditorArticleCountEditor';
import TestEditorContextTargeting from '../testEditorContextTargeting';
import TestEditorTargetAudienceSelector from '../testEditorTargetAudienceSelector';
import { TestMethodologyEditor } from '../TestMethodologyEditor';
import { TestEditorProps } from '../testsForm';
import { ValidatedTestEditor, ValidatedTestEditorProps } from '../validatedTestEditor';
import MaxViewsEditor from './maxViewsEditor';
import { EpicTestPreviewButton } from './testPreview';
import { getDefaultVariant } from './utils/defaults';
import { findMParticleTemplates } from './utils/findMParticleTemplates';
import VariantEditor from './variantEditor';
import VariantPreview from './variantPreview';

const copyHasTemplate = (test: EpicTest, template: string): boolean =>
  test.variants.some(
    (variant) =>
      (variant.heading?.includes(template) ?? false) ||
      variant.paragraphs.some((para) => para.includes(template)),
  );

export const getEpicTestEditor = (
  epicEditorConfig: EpicEditorConfig,
): React.FC<TestEditorProps<EpicTest>> => {
  const EpicTestEditor = ({
    test,
    userHasTestLocked,
    showMParticleMenu,
    onTestChange,
    setValidationStatusForField,
  }: ValidatedTestEditorProps<EpicTest>) => {
    const [userExplicitlyDisabledArticleCount, setUserExplicitlyDisabledArticleCount] =
      React.useState(test.articlesViewedSettings === undefined);

    React.useEffect(() => {
      setUserExplicitlyDisabledArticleCount(test.articlesViewedSettings === undefined);
      // eslint-disable-next-line react-hooks/exhaustive-deps -- Only sync when navigating to a different test, not on every re-render
    }, [test.name]);

    const onMaxViewsValidationChange = (isValid: boolean): void =>
      setValidationStatusForField('maxViews', isValid);

    const onArticlesViewedSettingsValidationChanged = (isValid: boolean): void =>
      setValidationStatusForField('articlesViewedSettings', isValid);

    const onVariantsSplitSettingsValidationChanged = (isValid: boolean): void =>
      setValidationStatusForField('variantsSplitSettings', isValid);

    const getArticlesViewedSettings = (test: EpicTest): ArticlesViewedSettings | undefined => {
      if (test.articlesViewedSettings) {
        return test.articlesViewedSettings;
      }
      if (epicEditorConfig.allowArticleCount && copyHasTemplate(test, ARTICLE_COUNT_TEMPLATE)) {
        return DEFAULT_ARTICLES_VIEWED_SETTINGS;
      }
      return undefined;
    };

    const updateTest = (update: (current: EpicTest) => EpicTest): void => {
      onTestChange((current) => {
        const updatedTest = update(current);
        return {
          ...updatedTest,
          // To save dotcom from having to work this out
          hasCountryName: copyHasTemplate(updatedTest, COUNTRY_NAME_TEMPLATE),
          mParticleTemplates: findMParticleTemplates(updatedTest),
          articlesViewedSettings: userExplicitlyDisabledArticleCount
            ? undefined
            : getArticlesViewedSettings(updatedTest),
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

    const onVariantsChange = (update: (current: EpicVariant[]) => EpicVariant[]): void => {
      updateTest((current) => {
        const updatedVariantList = update(current.variants);
        return { ...current, variants: updatedVariantList };
      });
    };

    const onVariantDelete = (deletedVariantName: string): void =>
      updateTest((current) => {
        const updatedVariantList = current.variants.filter(
          (variant) => variant.name !== deletedVariantName,
        );
        const controlProportionSettings = canHaveCustomVariantSplit(updatedVariantList)
          ? current.controlProportionSettings
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
      onVariantsChange((current) => [...current, newVariant]);
    };

    const onVariantClone = (originalVariant: EpicVariant, clonedVariantName: string): void => {
      const newVariant: EpicVariant = {
        ...originalVariant,
        name: clonedVariantName,
      };
      onVariantsChange((current) => [...current, newVariant]);
    };

    // Memoize callbacks by variant name to prevent infinite render loops
    // Using refs to store callbacks to avoid dependency issues with useCallback
    const validationCallbacksRef = useRef<Map<string, (isValid: boolean) => void>>(new Map());
    const variantChangeCallbacksRef = useRef<
      Map<string, (update: (current: EpicVariant) => EpicVariant) => void>
    >(new Map());
    const setValidationStatusRef = useRef(setValidationStatusForField);
    const onVariantsChangeRef = useRef(onVariantsChange);

    useEffect(() => {
      setValidationStatusRef.current = setValidationStatusForField;
      onVariantsChangeRef.current = onVariantsChange;
    });

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
    ): ((update: (current: EpicVariant) => EpicVariant) => void) => {
      if (!variantChangeCallbacksRef.current.has(variantName)) {
        variantChangeCallbacksRef.current.set(
          variantName,
          (update: (current: EpicVariant) => EpicVariant): void => {
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

    const onSwitchChange =
      (fieldName: string) =>
      (event: React.ChangeEvent<HTMLInputElement>): void => {
        const updatedBool = event.target.checked;
        updateTest((current) => ({ ...current, [fieldName]: updatedBool }));
      };

    const updateContextTargeting = (contextTargeting: PageContextTargeting): void => {
      updateTest((current) => ({
        ...current,
        tagIds: contextTargeting.tagIds,
        sections: contextTargeting.sectionIds,
        excludedTagIds: contextTargeting.excludedTagIds,
        excludedSections: contextTargeting.excludedSectionIds,
      }));
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

    const onConsentChange = (consentStatus: ConsentStatus): void => {
      onTestChange((current) => ({ ...current, consentStatus }));
    };

    const onMParticleAudienceChange = (mParticleAudience?: number): void => {
      onTestChange((current) => ({ ...current, mParticleAudience }));
    };

    const onArticlesViewedSettingsChange = (
      updatedArticlesViewedSettings?: ArticlesViewedSettings,
    ): void => {
      setUserExplicitlyDisabledArticleCount(updatedArticlesViewedSettings === undefined);
      // Bypass updateTest to avoid re-calculation, go directly to onTestChange
      onTestChange((current) => ({
        ...current,
        articlesViewedSettings: updatedArticlesViewedSettings,
      }));
    };

    const onMaxViewsChange = (updatedMaxViews?: MaxEpicViews): void => {
      updateTest((current) => ({
        ...current,
        alwaysAsk: !updatedMaxViews,
        maxViews: updatedMaxViews,
      }));
    };

    const onControlProportionSettingsChange = (
      controlProportionSettings?: ControlProportionSettings,
    ): void => updateTest((current) => ({ ...current, controlProportionSettings }));

    const renderVariantEditor = (variant: EpicVariant): React.ReactElement => (
      <VariantEditorWithPreviewTab
        variantEditor={
          <VariantEditor
            epicEditorConfig={epicEditorConfig}
            showMParticleMenu={showMParticleMenu}
            key={variant.name}
            variant={variant}
            editMode={userHasTestLocked}
            onVariantChange={getVariantChangeCallback(variant.name)}
            onDelete={(): void => onVariantDelete(variant.name)}
            onValidationChange={getValidationCallback(variant.name)}
          />
        }
        variantPreview={
          epicEditorConfig.allowVariantPreview ? (
            <VariantPreview variant={variant} moduleName={epicEditorConfig.moduleName} />
          ) : undefined
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
      <Container>
        {epicEditorConfig.allowMultipleVariants && (
          <SectionContainer>
            <VariantsHeaderContainer>
              <SectionHeader variant={'h3'}>Variants</SectionHeader>
              <VariantsHeaderButtonsContainer>
                {epicEditorConfig.allowVariantPreview && (
                  <EpicTestPreviewButton test={test} moduleName={epicEditorConfig.moduleName} />
                )}
              </VariantsHeaderButtonsContainer>
            </VariantsHeaderContainer>
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
          </SectionContainer>
        )}
        {epicEditorConfig.allowMethodologyEditor && (
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
        )}

        {epicEditorConfig.allowCustomVariantSplit && canHaveCustomVariantSplit(test.variants) && (
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

        {!epicEditorConfig.allowMultipleVariants && (
          <SectionContainer key={test.name}>
            <SectionHeader variant={'h3'}>Copy</SectionHeader>

            <div>
              <VariantEditor
                key={test.variants[0].name}
                variant={test.variants[0]}
                epicEditorConfig={epicEditorConfig}
                showMParticleMenu={showMParticleMenu}
                editMode={userHasTestLocked}
                onVariantChange={getVariantChangeCallback(test.variants[0].name)}
                onDelete={(): void => onVariantDelete(test.variants[0].name)}
                onValidationChange={getValidationCallback(test.variants[0].name)}
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

        {epicEditorConfig.allowContentTargeting && (
          <SectionContainer>
            <SectionHeader variant={'h3'}>Target content</SectionHeader>

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
          </SectionContainer>
        )}

        {epicEditorConfig.allowLocationTargeting && (
          <SectionContainer>
            <SectionHeader variant={'h3'}>Target audience</SectionHeader>

            <TestEditorTargetAudienceSelector
              regionTargeting={test.regionTargeting}
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
              mParticleAudienceEditor={
                epicEditorConfig.allowMParticleAudienceEditor
                  ? {
                      mParticleAudience: test.mParticleAudience,
                      onMParticleAudienceChange: onMParticleAudienceChange,
                    }
                  : undefined
              }
            />
          </SectionContainer>
        )}

        {epicEditorConfig.allowViewFrequencySettings && (
          <SectionContainer>
            <SectionHeader variant={'h3'}>View frequency settings</SectionHeader>

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
          </SectionContainer>
        )}

        {epicEditorConfig.allowArticleCount && (
          <SectionContainer>
            <SectionHeader variant={'h3'}>Article count</SectionHeader>

            <TestEditorArticleCountEditor
              articlesViewedSettings={test.articlesViewedSettings}
              onArticlesViewedSettingsChanged={onArticlesViewedSettingsChange}
              onValidationChange={onArticlesViewedSettingsValidationChanged}
              isDisabled={!userHasTestLocked}
            />
          </SectionContainer>
        )}

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
  return ValidatedTestEditor(EpicTestEditor, epicEditorConfig.testNamePrefix);
};
