import React from 'react';
import { Region } from '../../../utils/models';
import { EpicTest, EpicVariant, MaxEpicViews } from './epicTestsForm';
import { ArticlesViewedSettings, UserCohort, defaultCta, EpicType } from '../helpers/shared';
import { makeStyles, FormControlLabel, Switch, Theme, Typography } from '@material-ui/core';
import TestEditorHeader from '../testEditorHeader';
import TestEditorLiveSwitch from '../testEditorLiveSwitch';
import TestVariantsEditor from '../testVariantsEditor';
import TestEditorTargetAudienceSelector from '../testEditorTargetAudienceSelector';
import TestEditorArticleCountEditor, {
  DEFAULT_ARTICLES_VIEWED_SETTINGS,
} from '../testEditorArticleCountEditor';
import TestEditorActionButtons from '../testEditorActionButtons';
import EpicTestVariantEditor from './epicTestVariantEditor';
import EpicTestTargetContentEditor from './epicTestTargetContentEditor';
import EpicTestMaxViewsEditor from './epicTestMaxViewsEditor';
import useValidation from '../hooks/useValidation';
import { articleCountTemplate, countryNameTemplate } from '../helpers/copyTemplates';

const useStyles = makeStyles(({ spacing, palette }: Theme) => ({
  container: {
    width: '100%',
    height: 'max-content',
    background: '#FFFFFF',
    paddingTop: spacing(6),
    paddingRight: spacing(12),
    paddingLeft: spacing(3),
  },
  headerAndSwitchContainer: {
    paddingBottom: spacing(3),
    borderBottom: `1px solid ${palette.grey[500]}`,

    '& > * + *': {
      marginTop: spacing(2),
    },
  },
  sectionContainer: {
    paddingTop: spacing(1),
    paddingBottom: spacing(6),
    borderBottom: `1px solid ${palette.grey[500]}`,

    '& > * + *': {
      marginTop: spacing(4),
    },
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: 500,
    color: palette.grey[700],
  },
  buttonsContainer: {
    paddingTop: spacing(4),
    paddingBottom: spacing(12),
  },
}));

const copyHasTemplate = (test: EpicTest, template: string): boolean =>
  test.variants.some(
    variant =>
      (variant.heading && variant.heading.includes(template)) ||
      variant.paragraphs.some(para => para.includes(template)),
  );

interface EpicTestEditorProps {
  test: EpicTest;
  hasChanged: boolean;
  epicType: EpicType;
  onChange: (updatedTest: EpicTest) => void;
  onValidationChange: (isValid: boolean) => void;
  visible: boolean;
  editMode: boolean;
  onDelete: () => void;
  onArchive: () => void;
  onTestSelected: (testName: string) => void;
  testNames: string[];
  testNicknames: string[];
  createTest: (newTest: EpicTest) => void;
}

const EpicTestEditor: React.FC<EpicTestEditorProps> = ({
  test,
  epicType,
  onChange,
  editMode,
  onDelete,
  onArchive,
  onTestSelected,
  testNames,
  testNicknames,
  createTest,
  onValidationChange,
}: EpicTestEditorProps) => {
  const classes = useStyles();

  const isOffPlatform = epicType === 'APPLE_NEWS' || epicType === 'AMP';

  const setValidationStatusForField = useValidation(onValidationChange);

  const onMaxViewsValidationChange = (isValid: boolean): void =>
    setValidationStatusForField('maxViews', isValid);

  const onArticlesViewedSettingsValidationChanged = (isValid: boolean): void =>
    setValidationStatusForField('articlesViewedSettings', isValid);

  const getArticlesViewedSettings = (test: EpicTest): ArticlesViewedSettings | undefined => {
    if (!!test.articlesViewedSettings) {
      return test.articlesViewedSettings;
    }
    if (copyHasTemplate(test, articleCountTemplate)) {
      return DEFAULT_ARTICLES_VIEWED_SETTINGS;
    }
    return undefined;
  };

  const updateTest = (update: (test: EpicTest) => EpicTest): void => {
    if (test) {
      const updatedTest = update(test);

      onChange({
        ...updatedTest,
        // To save dotcom from having to work this out
        hasCountryName: copyHasTemplate(updatedTest, countryNameTemplate),
        articlesViewedSettings: getArticlesViewedSettings(updatedTest),
      });
    }
  };

  const onVariantsChange = (updatedVariantList: EpicVariant[]): void => {
    if (test) {
      updateTest(test => ({ ...test, variants: updatedVariantList }));
    }
  };

  const onVariantChange = (updatedVariant: EpicVariant): void => {
    if (test) {
      const updatedVariantList = test.variants.map(variant =>
        variant.name === updatedVariant.name ? updatedVariant : variant,
      );
      onVariantsChange(updatedVariantList);
    }
  };

  const onVariantDelete = (deletedVariantName: string): void => {
    if (test) {
      const updatedVariantList = test.variants.filter(
        variant => variant.name !== deletedVariantName,
      );
      onVariantsChange(updatedVariantList);
    }
  };

  const createVariant = (name: string): void => {
    const newVariant: EpicVariant = {
      name: name,
      heading: undefined,
      paragraphs: [],
      highlightedText:
        'Support the Guardian from as little as %%CURRENCY_SYMBOL%%1 – and it only takes a minute. Thank you.',
      footer: undefined,
      showTicker: false,
      backgroundImageUrl: undefined,
      cta: defaultCta,
    };

    if (test) {
      onVariantsChange([...test.variants, newVariant]);
    }
  };

  const onSwitchChange = (fieldName: string) => (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    const updatedBool = event.target.checked;
    updateTest(test => ({ ...test, [fieldName]: updatedBool }));
  };

  const onLiveSwitchChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    updateTest(test => ({ ...test, isOn: event.target.checked }));
  };

  const updateTargetSections = (
    tagIds: string[],
    sections: string[],
    excludedTagIds: string[],
    excludedSections: string[],
  ): void => {
    updateTest(test => ({ ...test, tagIds, sections, excludedTagIds, excludedSections }));
  };

  const onRegionsChange = (updatedRegions: Region[]): void => {
    updateTest(test => ({ ...test, locations: updatedRegions }));
  };

  const onCohortChange = (updatedCohort: UserCohort): void => {
    updateTest(test => ({ ...test, userCohort: updatedCohort }));
  };

  const onArticlesViewedSettingsChange = (
    updatedArticlesViewedSettings?: ArticlesViewedSettings,
  ): void => {
    updateTest(test => ({
      ...test,
      articlesViewedSettings: updatedArticlesViewedSettings,
    }));
  };

  const onMaxViewsChange = (updatedMaxViews?: MaxEpicViews): void => {
    updateTest(test => ({
      ...test,
      alwaysAsk: !updatedMaxViews,
      maxViews: updatedMaxViews,
    }));
  };

  const onCopy = (name: string, nickname: string): void => {
    onTestSelected(name);
    createTest({ ...test, name: name, nickname: nickname, isOn: false });
  };

  const renderVariantEditor = (variant: EpicVariant): React.ReactElement => (
    <EpicTestVariantEditor
      key={variant.name}
      variant={variant}
      epicType={epicType}
      editMode={editMode}
      onVariantChange={onVariantChange}
      onDelete={(): void => onVariantDelete(variant.name)}
      onValidationChange={(isValid: boolean): void =>
        setValidationStatusForField(variant.name, isValid)
      }
    />
  );

  return (
    <div className={classes.container}>
      <div className={classes.headerAndSwitchContainer}>
        <TestEditorHeader name={test.name} nickname={test.nickname} />

        <TestEditorLiveSwitch
          isChecked={test.isOn}
          isDisabled={!editMode}
          onChange={onLiveSwitchChange}
        />
      </div>

      {!isOffPlatform && (
        <div className={classes.sectionContainer}>
          <Typography variant={'h3'} className={classes.sectionHeader}>
            Variants
          </Typography>
          <div>
            <TestVariantsEditor<EpicVariant>
              variants={test.variants}
              testName={test.name}
              testType="EPIC"
              editMode={editMode}
              createVariant={createVariant}
              renderVariantEditor={renderVariantEditor}
              onVariantDelete={onVariantDelete}
            />
          </div>
        </div>
      )}

      {isOffPlatform && (
        <div className={classes.sectionContainer} key={test.name}>
          <Typography variant={'h3'} className={classes.sectionHeader}>
            Copy
          </Typography>

          <div>
            <EpicTestVariantEditor
              key={test.variants[0].name}
              variant={test.variants[0]}
              epicType={epicType}
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

      {epicType !== 'AMP' && (
        <div className={classes.sectionContainer}>
          <Typography variant={'h3'} className={classes.sectionHeader}>
            Target content
          </Typography>

          <EpicTestTargetContentEditor
            tagIds={test.tagIds}
            sections={test.sections}
            excludeTagIds={test.excludedTagIds}
            excludeSections={test.excludedSections}
            editMode={editMode}
            updateTargetContent={updateTargetSections}
          />
        </div>
      )}

      {epicType !== 'APPLE_NEWS' && (
        <div className={classes.sectionContainer}>
          <Typography variant={'h3'} className={classes.sectionHeader}>
            Target audience
          </Typography>

          <TestEditorTargetAudienceSelector
            selectedRegions={test.locations}
            onRegionsUpdate={onRegionsChange}
            selectedCohort={test.userCohort}
            onCohortChange={onCohortChange}
            isDisabled={!editMode}
            showSupporterStatusSelector={epicType !== 'AMP'}
          />
        </div>
      )}

      {!isOffPlatform && (
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

          <EpicTestMaxViewsEditor
            maxEpicViews={test.alwaysAsk ? undefined : test.maxViews}
            isDisabled={!editMode}
            onMaxViewsChanged={onMaxViewsChange}
            onValidationChange={onMaxViewsValidationChange}
          />
        </div>
      )}

      {!isOffPlatform && (
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
          isDisabled={!editMode}
          onArchive={onArchive}
          onDelete={onDelete}
          onCopy={onCopy}
        />
      </div>
    </div>
  );
};

export default EpicTestEditor;
