import React from 'react';
import { Region } from '../../../utils/models';
import { EpicTest, EpicVariant, MaxEpicViews } from '../../../models/epic';
import {
  ArticlesViewedSettings,
  UserCohort,
  EpicEditorConfig,
  DeviceType,
  SignedInStatus,
  PageContextTargeting,
  ConsentStatus,
} from '../helpers/shared';
import { FormControlLabel, Switch, Typography } from '@mui/material';
import CampaignSelector from '../CampaignSelector';
import TestVariantsEditor from '../testVariantsEditor';
import TestEditorVariantSummary from '../testEditorVariantSummary';
import TestEditorTargetAudienceSelector from '../testEditorTargetAudienceSelector';
import TestEditorArticleCountEditor, {
  DEFAULT_ARTICLES_VIEWED_SETTINGS,
} from '../testEditorArticleCountEditor';
import TestVariantEditorWithPreviewTab from '../testVariantEditorWithPreviewTab';
import EpicTestVariantEditor from './epicTestVariantEditor';
import EpicVariantPreview from './epicVariantPreview';
import TestEditorContextTargeting from '../testEditorContextTargeting';
import EpicTestMaxViewsEditor from './epicTestMaxViewsEditor';
import { ARTICLE_COUNT_TEMPLATE, COUNTRY_NAME_TEMPLATE } from '../helpers/validation';
import TestVariantsSplitEditor from '../testVariantsSplitEditor';
import { getDefaultVariant } from './utils/defaults';
import {
  canHaveCustomVariantSplit,
  ControlProportionSettings,
} from '../helpers/controlProportionSettings';
import { useStyles } from '../helpers/testEditorStyles';
import { EpicTestPreviewButton } from './epicTestPreview';
import { ValidatedTestEditor, ValidatedTestEditorProps } from '../validatedTestEditor';
import { TestEditorProps } from '../testsForm';

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

    const updateTest = (updatedTest: EpicTest): void => {
      onTestChange({
        ...updatedTest,
        // To save dotcom from having to work this out
        hasCountryName: copyHasTemplate(updatedTest, COUNTRY_NAME_TEMPLATE),
        articlesViewedSettings: getArticlesViewedSettings(updatedTest),
      });
    };

    const onCampaignChange = (campaign?: string): void => {
      updateTest({
        ...test,
        campaignName: campaign,
      });
    };

    const onVariantsChange = (updatedVariantList: EpicVariant[]): void => {
      updateTest({ ...test, variants: updatedVariantList });
    };

    const onVariantChange = (updatedVariant: EpicVariant): void => {
      const updatedVariantList = test.variants.map(variant =>
        variant.name === updatedVariant.name ? updatedVariant : variant,
      );
      onVariantsChange(updatedVariantList);
    };

    const onVariantDelete = (deletedVariantName: string): void => {
      const updatedVariantList = test.variants.filter(
        variant => variant.name !== deletedVariantName,
      );
      const controlProportionSettings = canHaveCustomVariantSplit(updatedVariantList)
        ? test.controlProportionSettings
        : undefined;

      updateTest({ ...test, variants: updatedVariantList, controlProportionSettings });
    };

    const createVariant = (name: string): void => {
      const newVariant: EpicVariant = {
        ...getDefaultVariant(),
        name: name,
      };
      onVariantsChange([...test.variants, newVariant]);
    };

    const onVariantClone = (originalVariant: EpicVariant, clonedVariantName: string): void => {
      const newVariant: EpicVariant = {
        ...originalVariant,
        name: clonedVariantName,
      };
      onVariantsChange([...test.variants, newVariant]);
    };

    const onSwitchChange = (fieldName: string) => (
      event: React.ChangeEvent<HTMLInputElement>,
    ): void => {
      const updatedBool = event.target.checked;
      updateTest({ ...test, [fieldName]: updatedBool });
    };

    const updateContextTargeting = (contextTargeting: PageContextTargeting): void => {
      updateTest({
        ...test,
        tagIds: contextTargeting.tagIds,
        sections: contextTargeting.sectionIds,
        excludedTagIds: contextTargeting.excludedTagIds,
        excludedSections: contextTargeting.excludedSectionIds,
      });
    };

    const onRegionsChange = (updatedRegions: Region[]): void => {
      updateTest({ ...test, locations: updatedRegions });
    };

    const onCohortChange = (updatedCohort: UserCohort): void => {
      updateTest({ ...test, userCohort: updatedCohort });
    };

    const onDeviceTypeChange = (updatedDeviceType: DeviceType): void => {
      updateTest({ ...test, deviceType: updatedDeviceType });
    };

    const onSignedInStatusChange = (signedInStatus: SignedInStatus): void => {
      onTestChange({ ...test, signedInStatus });
    };

    const onConsentChange = (consentStatus: ConsentStatus): void => {
      onTestChange({ ...test, consentStatus });
    };

    const onArticlesViewedSettingsChange = (
      updatedArticlesViewedSettings?: ArticlesViewedSettings,
    ): void => {
      updateTest({
        ...test,
        articlesViewedSettings: updatedArticlesViewedSettings,
      });
    };

    const onMaxViewsChange = (updatedMaxViews?: MaxEpicViews): void => {
      updateTest({
        ...test,
        alwaysAsk: !updatedMaxViews,
        maxViews: updatedMaxViews,
      });
    };

    const onControlProportionSettingsChange = (
      controlProportionSettings?: ControlProportionSettings,
    ): void => updateTest({ ...test, controlProportionSettings });

    const renderVariantEditor = (variant: EpicVariant): React.ReactElement => (
      <TestVariantEditorWithPreviewTab
        variantEditor={
          <EpicTestVariantEditor
            epicEditorConfig={epicEditorConfig}
            key={variant.name}
            variant={variant}
            editMode={userHasTestLocked}
            onVariantChange={onVariantChange}
            onDelete={(): void => onVariantDelete(variant.name)}
            onValidationChange={(isValid: boolean): void =>
              setValidationStatusForField(variant.name, isValid)
            }
          />
        }
        variantPreview={
          epicEditorConfig.allowVariantPreview ? (
            <EpicVariantPreview variant={variant} moduleName={epicEditorConfig.moduleName} />
          ) : (
            undefined
          )
        }
      />
    );

    const renderVariantSummary = (variant: EpicVariant): React.ReactElement => (
      <TestEditorVariantSummary
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
              <EpicTestPreviewButton test={test} moduleName={epicEditorConfig.moduleName} />
            </div>
            <div>
              <TestVariantsEditor<EpicVariant>
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

        {epicEditorConfig.allowCustomVariantSplit && canHaveCustomVariantSplit(test.variants) && (
          <div className={classes.sectionContainer}>
            <Typography variant={'h3'} className={classes.sectionHeader}>
              Variants split
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
              <EpicTestVariantEditor
                key={test.variants[0].name}
                variant={test.variants[0]}
                epicEditorConfig={epicEditorConfig}
                editMode={userHasTestLocked}
                onVariantChange={onVariantChange}
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
              selectedRegions={test.locations}
              onRegionsUpdate={onRegionsChange}
              selectedCohort={test.userCohort}
              onCohortChange={onCohortChange}
              supportedRegions={epicEditorConfig.supportedRegions}
              selectedDeviceType={test.deviceType ?? 'All'}
              onDeviceTypeChange={onDeviceTypeChange}
              isDisabled={!userHasTestLocked}
              showSupporterStatusSelector={epicEditorConfig.allowSupporterStatusTargeting}
              showDeviceTypeSelector={epicEditorConfig.allowDeviceTypeTargeting}
              selectedSignedInStatus={test.signedInStatus}
              onSignedInStatusChange={onSignedInStatusChange}
              selectedConsentStatus={test.consentStatus}
              onConsentStatusChange={onConsentChange}
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

            <EpicTestMaxViewsEditor
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
