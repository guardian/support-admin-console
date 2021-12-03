import React from 'react';
import { Region } from '../../../utils/models';
import { HeaderTest, HeaderVariant, MaxHeaderViews } from './headerTestsForm';
import { ArticlesViewedSettings, UserCohort, HeaderEditorConfig } from '../helpers/shared';
import { FormControlLabel, Switch, Typography } from '@material-ui/core';
import TestEditorHeader from '../testEditorHeader';
import TestVariantsEditor from '../testVariantsEditor';
import TestEditorVariantSummary from '../testEditorVariantSummary';
import TestEditorTargetAudienceSelector from '../testEditorTargetAudienceSelector';
import TestEditorArticleCountEditor, {
  DEFAULT_ARTICLES_VIEWED_SETTINGS,
} from '../testEditorArticleCountEditor';
import TestEditorActionButtons from '../testEditorActionButtons';
import TestVariantEditorWithPreviewTab from '../testVariantEditorWithPreviewTab';
import HeaderTestVariantEditor from './headerTestVariantEditor';
import HeaderVariantPreview from './headerVariantPreview';
import HeaderTestTargetContentEditor from './headerTestTargetContentEditor';
import HeaderTestMaxViewsEditor from './headerTestMaxViewsEditor';
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

const copyHasTemplate = (test: HeaderTest, template: string): boolean =>
  test.variants.some(
    variant =>
      (variant.heading && variant.heading.includes(template)) ||
      variant.paragraphs.some(para => para.includes(template)),
  );

interface HeaderTestEditorProps {
  test: HeaderTest;
  hasChanged: boolean;
  headerEditorConfig: HeaderEditorConfig;
  onChange: (updatedTest: HeaderTest) => void;
  onValidationChange: (isValid: boolean) => void;
  visible: boolean;
  editMode: boolean;
  onDelete: () => void;
  onArchive: () => void;
  onTestSelected: (testName: string) => void;
  testNames: string[];
  testNicknames: string[];
  testNamePrefix?: string;
  createTest: (newTest: HeaderTest) => void;
}

const HeaderTestEditor: React.FC<HeaderTestEditorProps> = ({
  test,
  headerEditorConfig,
  onChange,
  editMode,
  onDelete,
  onArchive,
  onTestSelected,
  testNames,
  testNicknames,
  testNamePrefix,
  createTest,
  onValidationChange,
}: HeaderTestEditorProps) => {
  const classes = useStyles();

  const setValidationStatusForField = useValidation(onValidationChange);

  const onMaxViewsValidationChange = (isValid: boolean): void =>
    setValidationStatusForField('maxViews', isValid);

  const onArticlesViewedSettingsValidationChanged = (isValid: boolean): void =>
    setValidationStatusForField('articlesViewedSettings', isValid);

  const onVariantsSplitSettingsValidationChanged = (isValid: boolean): void =>
    setValidationStatusForField('variantsSplitSettings', isValid);

  const getArticlesViewedSettings = (test: HeaderTest): ArticlesViewedSettings | undefined => {
    if (!!test.articlesViewedSettings) {
      return test.articlesViewedSettings;
    }
    if (headerEditorConfig.allowArticleCount && copyHasTemplate(test, ARTICLE_COUNT_TEMPLATE)) {
      return DEFAULT_ARTICLES_VIEWED_SETTINGS;
    }
    return undefined;
  };

  const updateTest = (updatedTest: HeaderTest): void => {
    onChange({
      ...updatedTest,
      // To save dotcom from having to work this out
      hasCountryName: copyHasTemplate(updatedTest, COUNTRY_NAME_TEMPLATE),
      articlesViewedSettings: getArticlesViewedSettings(updatedTest),
    });
  };

  const onVariantsChange = (updatedVariantList: HeaderVariant[]): void => {
    updateTest({ ...test, variants: updatedVariantList });
  };

  const onVariantChange = (updatedVariant: HeaderVariant): void => {
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
    const newVariant: HeaderVariant = {
      ...getDefaultVariant(),
      name: name,
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
    updateTest({ ...test, isOn });
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

  const onArticlesViewedSettingsChange = (
    updatedArticlesViewedSettings?: ArticlesViewedSettings,
  ): void => {
    updateTest({
      ...test,
      articlesViewedSettings: updatedArticlesViewedSettings,
    });
  };

  const onMaxViewsChange = (updatedMaxViews?: MaxHeaderViews): void => {
    updateTest({
      ...test,
      alwaysAsk: !updatedMaxViews,
      maxViews: updatedMaxViews,
    });
  };

  const onControlProportionSettingsChange = (
    controlProportionSettings?: ControlProportionSettings,
  ): void => updateTest({ ...test, controlProportionSettings });

  const onCopy = (name: string, nickname: string): void => {
    onTestSelected(name);
    createTest({ ...test, name: name, nickname: nickname, isOn: false });
  };

  const renderVariantEditor = (variant: HeaderVariant): React.ReactElement => (
    <TestVariantEditorWithPreviewTab
      variantEditor={
        <HeaderTestVariantEditor
          headerEditorConfig={headerEditorConfig}
          key={variant.name}
          variant={variant}
          editMode={editMode}
          onVariantChange={onVariantChange}
          onDelete={(): void => onVariantDelete(variant.name)}
          onValidationChange={(isValid: boolean): void =>
            setValidationStatusForField(variant.name, isValid)
          }
        />
      }
      variantPreview={
        <HeaderVariantPreview variant={variant} moduleName={headerEditorConfig.moduleName} />
      }
    />
  );

  const renderVariantSummary = (variant: HeaderVariant): React.ReactElement => (
    <TestEditorVariantSummary
      name={variant.name}
      testName={test.name}
      testType="HEADER"
      isInEditMode={editMode}
      platform={headerEditorConfig.platform}
    />
  );

  return (
    <div className={classes.container}>
      <div className={classes.headerAndSwitchContainer}>
        <TestEditorHeader name={test.name} nickname={test.nickname} />

        <LiveSwitch
          label="Live on Guardian.com"
          isLive={test.isOn}
          isDisabled={!editMode}
          onChange={onLiveSwitchChange}
        />
      </div>

      {headerEditorConfig.allowMultipleVariants && (
        <div className={classes.sectionContainer}>
          <Typography variant={'h3'} className={classes.sectionHeader}>
            Variants
          </Typography>
          <div>
            <TestVariantsEditor<HeaderVariant>
              variants={test.variants}
              testName={test.name}
              editMode={editMode}
              createVariant={createVariant}
              renderVariantEditor={renderVariantEditor}
              renderVariantSummary={renderVariantSummary}
              onVariantDelete={onVariantDelete}
            />
          </div>
        </div>
      )}

      {headerEditorConfig.allowCustomVariantSplit && canHaveCustomVariantSplit(test.variants) && (
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
              isDisabled={!editMode}
            />
          </div>
        </div>
      )}

      {!headerEditorConfig.allowMultipleVariants && (
        <div className={classes.sectionContainer} key={test.name}>
          <Typography variant={'h3'} className={classes.sectionHeader}>
            Copy
          </Typography>

          <div>
            <HeaderTestVariantEditor
              key={test.variants[0].name}
              variant={test.variants[0]}
              headerEditorConfig={headerEditorConfig}
              editMode={editMode}
              onVariantChange={onVariantChange}
              onDelete={(): void => onVariantDelete(test.variants[0].name)}
              onValidationChange={(isValid: boolean): void =>
                setValidationStatusForField(test.variants[0].name, isValid)
              }
            />
          </div>
        </div>
      )}

      {headerEditorConfig.allowContentTargeting && (
        <div className={classes.sectionContainer}>
          <Typography variant={'h3'} className={classes.sectionHeader}>
            Target content
          </Typography>

          <HeaderTestTargetContentEditor
            tagIds={test.tagIds}
            sections={test.sections}
            excludeTagIds={test.excludedTagIds}
            excludeSections={test.excludedSections}
            editMode={editMode}
            updateTargetContent={updateTargetSections}
          />
        </div>
      )}

      {headerEditorConfig.allowLocationTargeting && (
        <div className={classes.sectionContainer}>
          <Typography variant={'h3'} className={classes.sectionHeader}>
            Target audience
          </Typography>

          <TestEditorTargetAudienceSelector
            selectedRegions={test.locations}
            onRegionsUpdate={onRegionsChange}
            selectedCohort={test.userCohort}
            onCohortChange={onCohortChange}
            supportedRegions={headerEditorConfig.supportedRegions}
            isDisabled={!editMode}
            showSupporterStatusSelector={headerEditorConfig.allowSupporterStatusTargeting}
          />
        </div>
      )}

      {headerEditorConfig.allowViewFrequencySettings && (
        <div className={classes.sectionContainer}>
          <Typography variant={'h3'} className={classes.sectionHeader}>
            View frequency settings
          </Typography>

          <FormControlLabel
            control={
              <Switch
                checked={test.useLocalViewLog}
                onChange={onSwitchChange('useLocalViewLog')}
                disabled={!editMode}
              />
            }
            label={`Use private view counter for this test (instead of the global one)`}
          />

          <HeaderTestMaxViewsEditor
            maxHeaderViews={test.alwaysAsk ? undefined : test.maxViews}
            isDisabled={!editMode}
            onMaxViewsChanged={onMaxViewsChange}
            onValidationChange={onMaxViewsValidationChange}
          />
        </div>
      )}

      {headerEditorConfig.allowArticleCount && (
        <div className={classes.sectionContainer}>
          <Typography variant={'h3'} className={classes.sectionHeader}>
            Article count
          </Typography>

          <TestEditorArticleCountEditor
            articlesViewedSettings={test.articlesViewedSettings}
            onArticlesViewedSettingsChanged={onArticlesViewedSettingsChange}
            onValidationChange={onArticlesViewedSettingsValidationChanged}
            isDisabled={!editMode}
          />
        </div>
      )}

      <div className={classes.buttonsContainer}>
        <TestEditorActionButtons
          existingNames={testNames}
          existingNicknames={testNicknames}
          testNamePrefix={testNamePrefix}
          isDisabled={!editMode}
          onArchive={onArchive}
          onDelete={onDelete}
          onCopy={onCopy}
        />
      </div>
    </div>
  );
};

export default HeaderTestEditor;
