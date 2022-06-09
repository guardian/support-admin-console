import React, {useState} from 'react';
import { Region } from '../../../utils/models';
import {EpicTest, EpicVariant, MaxEpicViews} from '../../../models/epic';
import {
  ArticlesViewedSettings,
  UserCohort,
  EpicEditorConfig,
  DeviceType,
  setStatus,
} from '../helpers/shared';
import { FormControlLabel, Switch, Typography } from '@material-ui/core';
import TestVariantsEditor from '../testVariantsEditor';
import TestEditorVariantSummary from '../testEditorVariantSummary';
import TestEditorTargetAudienceSelector from '../testEditorTargetAudienceSelector';
import TestEditorArticleCountEditor, {
  DEFAULT_ARTICLES_VIEWED_SETTINGS,
} from '../testEditorArticleCountEditor';
import TestVariantEditorWithPreviewTab from '../testVariantEditorWithPreviewTab';
import EpicTestVariantEditor from './epicTestVariantEditor';
import EpicVariantPreview from './epicVariantPreview';
import EpicTestTargetContentEditor from './epicTestTargetContentEditor';
import EpicTestMaxViewsEditor from './epicTestMaxViewsEditor';
import useValidation from '../hooks/useValidation';
import { ARTICLE_COUNT_TEMPLATE, COUNTRY_NAME_TEMPLATE } from '../helpers/validation';
import TestVariantsSplitEditor from '../testVariantsSplitEditor';
import { getDefaultVariant } from './utils/defaults';
import LiveSwitch from '../../shared/liveSwitch';
import {
  canHaveCustomVariantSplit,
  ControlProportionSettings,
} from '../helpers/controlProportionSettings';
import { useStyles } from '../helpers/testEditorStyles';
import { EpicTestPreviewButton } from './epicTestPreview';
import {TestEditorProps} from '../testsForm';
import TestEditorHeader from '../testEditorHeader/testEditorHeaderNew';

const copyHasTemplate = (test: EpicTest, template: string): boolean =>
  test.variants.some(
    variant =>
      (variant.heading && variant.heading.includes(template)) ||
      variant.paragraphs.some(para => para.includes(template)),
  );

export const getEpicTestEditor = (epicEditorConfig: EpicEditorConfig): React.FC<TestEditorProps<EpicTest>> => ({
  test,
  onTestChange,
  userHasTestLocked,
  onTestLock,
  onTestUnlock,
  onTestSave,
  onTestArchive,
  onTestCopy,
  existingNames,
  existingNicknames,
}: TestEditorProps<EpicTest>) => {
  const classes = useStyles();
  const [isValid, setIsValid] = useState<boolean>(true);

  const setValidationStatusForField = useValidation(setIsValid);

  const onSave = (): void => {
    if (isValid) {
      onTestSave(test.name);
    } else {
      alert('Test contains errors. Please fix any errors before saving.');
    }
  }

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
    const updatedVariantList = test.variants.filter(variant => variant.name !== deletedVariantName);
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

  const onLiveSwitchChange = (isOn: boolean): void => {
    updateTest({ ...test, isOn, status: setStatus(isOn) });
  };

  const updateTargetSections = (
    tagIds: string[],
    sections: string[],
    excludedTagIds: string[],
    excludedSections: string[],
  ): void => {
    updateTest({ ...test, tagIds, sections, excludedTagIds, excludedSections });
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
    />
  );

  return (
    <div className={classes.container}>
      <TestEditorHeader
        name={test.name}
        nickname={test.nickname}
        lockStatus={test.lockStatus || { locked: false } }
        userHasTestLocked={userHasTestLocked}
        existingNames={existingNames}
        existingNicknames={existingNicknames}
        testNamePrefix={undefined}
        onTestLock={onTestLock}
        onTestUnlock={onTestUnlock}
        onTestSave={onSave}
        onTestArchive={() => onTestArchive(test.name)}
        onTestCopy={onTestCopy}
      />

      <div className={classes.scrollableContainer}>
        <div className={classes.headerAndSwitchContainer}>
          <div className={classes.switchContainer}>
            <LiveSwitch
              label="Live on Guardian.com"
              isLive={test.isOn}
              isDisabled={!userHasTestLocked}
              onChange={onLiveSwitchChange}
            />
            <div>
              <EpicTestPreviewButton test={test} />
            </div>
          </div>
        </div>

        {epicEditorConfig.allowMultipleVariants && (
          <div className={classes.sectionContainer}>
            <Typography variant={'h3'} className={classes.sectionHeader}>
              Variants
            </Typography>
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

        {epicEditorConfig.allowContentTargeting && (
          <div className={classes.sectionContainer}>
            <Typography variant={'h3'} className={classes.sectionHeader}>
              Target content
            </Typography>

            <EpicTestTargetContentEditor
              tagIds={test.tagIds}
              sections={test.sections}
              excludeTagIds={test.excludedTagIds}
              excludeSections={test.excludedSections}
              editMode={userHasTestLocked}
              updateTargetContent={updateTargetSections}
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
    </div>
  );
};
