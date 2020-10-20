import React from 'react';
import { Region } from '../../../utils/models';
import { EpicTest, EpicVariant, MaxEpicViews } from './epicTestsForm';
import { ArticlesViewedSettings, TestEditorState, UserCohort, defaultCta } from '../helpers/shared';
import {
  createStyles,
  FormControlLabel,
  Switch,
  Theme,
  Typography,
  WithStyles,
  withStyles,
} from '@material-ui/core';
import TestEditorHeader from '../testEditorHeader';
import TestEditorLiveSwitch from '../testEditorLiveSwitch';
import TestVariantsEditor from '../testVariantsEditor';
import TestEditorTargetAudienceSelector from '../testEditorTargetAudienceSelector';
import TestEditorArticleCountEditor from '../testEditorArticleCountEditor';
import TestEditorActionButtons from '../testEditorActionButtons';
import EpicTestVariantEditor from './epicTestVariantEditor';
import EpicTestTargetContentEditor from './epicTestTargetContentEditor';
import MaxEpicViewsEditor from './maxEpicViewsEditor';
import { onFieldValidationChange } from '../helpers/validation';
import { defaultArticlesViewedSettings } from '../articlesViewedEditor';
import { articleCountTemplate, countryNameTemplate } from '../helpers/copyTemplates';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const styles = ({ spacing, palette }: Theme) =>
  createStyles({
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
  });

const copyHasTemplate = (test: EpicTest, template: string): boolean =>
  test.variants.some(
    variant =>
      (variant.heading && variant.heading.includes(template)) ||
      variant.paragraphs.some(para => para.includes(template)),
  );

interface EpicTestEditorProps extends WithStyles<typeof styles> {
  test: EpicTest;
  hasChanged: boolean;
  isLiveblog: boolean;
  onChange: (updatedTest: EpicTest) => void;
  onValidationChange: (isValid: boolean) => void;
  visible: boolean;
  editMode: boolean;
  onDelete: () => void;
  onArchive: () => void;
  onSelectedTestName: (testName: string) => void;
  isDeleted: boolean;
  isArchived: boolean;
  isNew: boolean;
  testNames: string[];
  testNicknames: string[];
  createTest: (newTest: EpicTest) => void;
}

class EpicTestEditor extends React.Component<EpicTestEditorProps, TestEditorState> {
  state: TestEditorState = {
    validationStatus: {},
  };

  isEditable = (): boolean => {
    return this.props.editMode && !this.props.isDeleted && !this.props.isArchived;
  };

  getArticlesViewedSettings = (test: EpicTest): ArticlesViewedSettings | undefined => {
    if (!!test.articlesViewedSettings) {
      return test.articlesViewedSettings;
    }
    if (copyHasTemplate(test, articleCountTemplate)) {
      return defaultArticlesViewedSettings;
    }
    return undefined;
  };

  updateTest = (update: (test: EpicTest) => EpicTest): void => {
    if (this.props.test) {
      const updatedTest = update(this.props.test);

      this.props.onChange({
        ...updatedTest,
        // To save dotcom from having to work this out
        hasCountryName: copyHasTemplate(updatedTest, countryNameTemplate),
        articlesViewedSettings: this.getArticlesViewedSettings(updatedTest),
      });
    }
  };

  copyTest = (newTestName: string, newTestNickname: string): void => {
    if (this.props.test) {
      this.props.onSelectedTestName(newTestName);
      const newTest: EpicTest = {
        ...this.props.test,
        name: newTestName,
        nickname: newTestNickname,
        isOn: false,
      };
      this.props.createTest(newTest);
    }
  };

  onVariantsChange = (updatedVariantList: EpicVariant[]): void => {
    if (this.props.test) {
      this.updateTest(test => ({ ...test, variants: updatedVariantList }));
    }
  };

  onVariantChange = (updatedVariant: EpicVariant): void => {
    if (this.props.test) {
      const updatedVariantList = this.props.test.variants.map(variant =>
        variant.name === updatedVariant.name ? updatedVariant : variant,
      );
      this.onVariantsChange(updatedVariantList);
    }
  };

  onVariantDelete = (deletedVariantName: string): void => {
    if (this.props.test) {
      const updatedVariantList = this.props.test.variants.filter(
        variant => variant.name !== deletedVariantName,
      );
      this.onVariantsChange(updatedVariantList);
    }
  };

  createVariant = (name: string): void => {
    console.log(name);
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

    if (this.props.test) {
      this.onVariantsChange([...this.props.test.variants, newVariant]);
      console.log(this.props.test.variants);
    }

    // onVariantsListChange([...variants, newVariant]);
    // onVariantSelected(`${testName}-${name}`);
  };

  onListChange = (fieldName: string) => (updatedString: string): void => {
    const updatedList = updatedString === '' ? [] : updatedString.split(',');
    this.updateTest(test => ({ ...test, [fieldName]: updatedList }));
  };

  onSwitchChange = (fieldName: string) => (event: React.ChangeEvent<HTMLInputElement>): void => {
    const updatedBool = event.target.checked;
    this.updateTest(test => ({ ...test, [fieldName]: updatedBool }));
  };

  onLiveSwitchChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    this.updateTest(test => ({ ...test, isOn: event.target.checked }));
  };

  onUserCohortChange = (event: React.ChangeEvent<{}>, value: string): void => {
    const selectedCohort = value as UserCohort;
    this.updateTest(test => ({ ...test, userCohort: selectedCohort }));
  };

  onTargetRegionsChange = (selectedRegions: Region[]): void => {
    this.updateTest(test => ({ ...test, locations: selectedRegions }));
  };

  updateTargetSections = (
    tagIds: string[],
    sections: string[],
    excludedTagIds: string[],
    excludedSections: string[],
  ): void => {
    this.updateTest(test => ({ ...test, tagIds, sections, excludedTagIds, excludedSections }));
  };

  onRegionsChange = (updatedRegions: Region[]): void => {
    this.updateTest(test => ({ ...test, locations: updatedRegions }));
  };

  onCohortChange = (updatedCohort: UserCohort): void => {
    this.updateTest(test => ({ ...test, userCohort: updatedCohort }));
  };

  onArticlesViewedSettingsChange = (
    updatedArticlesViewedSettings?: ArticlesViewedSettings,
  ): void => {
    this.updateTest(test => ({
      ...test,
      articlesViewedSettings: updatedArticlesViewedSettings,
    }));
  };

  onCopy = (name: string, nickname: string): void => {
    this.props.onSelectedTestName(name);
    this.props.createTest({ ...this.props.test, name: name, nickname: nickname, isOn: false });
  };

  renderEditor = (test: EpicTest): React.ReactNode | undefined => {
    const { classes } = this.props;

    const variantEditors = test.variants.map(variant => (
      <EpicTestVariantEditor
        key={variant.name}
        variant={variant}
        isLiveblog={test.isLiveBlog}
        editMode={this.props.editMode}
        onVariantChange={this.onVariantChange}
        onDelete={(): void => this.onVariantDelete(variant.name)}
        onValidationChange={onFieldValidationChange(this)(`variant-${variant.name}`)}
      />
    ));

    return (
      <div className={classes.container}>
        <div className={classes.headerAndSwitchContainer}>
          <TestEditorHeader name={test.name} nickname={test.nickname} />

          <TestEditorLiveSwitch
            isChecked={test.isOn}
            isDisabled={!this.isEditable()}
            onChange={this.onLiveSwitchChange}
          />
        </div>

        <div className={classes.sectionContainer}>
          <Typography variant={'h3'} className={classes.sectionHeader}>
            Variants
          </Typography>
          <div>
            <TestVariantsEditor<EpicVariant>
              variants={test.variants}
              testName={test.name}
              editMode={this.isEditable()}
              createVariant={this.createVariant}
              variantEditors={variantEditors}
              onVariantDelete={this.onVariantDelete}
            />
          </div>
        </div>

        <div className={classes.sectionContainer}>
          <Typography variant={'h3'} className={classes.sectionHeader}>
            Target content
          </Typography>

          <EpicTestTargetContentEditor
            tagIds={test.tagIds}
            sections={test.sections}
            excludeTagIds={test.excludedTagIds}
            excludeSections={test.excludedSections}
            editMode={this.isEditable()}
            updateTargetContent={this.updateTargetSections}
          />
        </div>

        <div className={classes.sectionContainer}>
          <Typography variant={'h3'} className={classes.sectionHeader}>
            Target audience
          </Typography>

          <TestEditorTargetAudienceSelector
            selectedRegions={test.locations}
            onRegionsUpdate={this.onRegionsChange}
            selectedCohort={test.userCohort}
            onCohortChange={this.onCohortChange}
            isDisabled={!this.isEditable()}
          />
        </div>

        <div className={classes.sectionContainer}>
          <Typography variant={'h3'} className={classes.sectionHeader}>
            View frequency settings
          </Typography>

          <FormControlLabel
            control={
              <Switch
                checked={test.useLocalViewLog}
                onChange={this.onSwitchChange('useLocalViewLog')}
                disabled={!this.isEditable()}
              />
            }
            label={`Use private view counter for this test (instead of the global one)`}
          />

          <MaxEpicViewsEditor
            test={test}
            editMode={this.isEditable()}
            onChange={(alwaysAsk: boolean, maxEpicViews: MaxEpicViews): void =>
              this.updateTest(test => ({
                ...test,
                alwaysAsk,
                maxViews: maxEpicViews,
              }))
            }
            onValidationChange={onFieldValidationChange(this)('maxViews')}
          />
        </div>

        <div className={classes.sectionContainer}>
          <Typography variant={'h3'} className={classes.sectionHeader}>
            Article count
          </Typography>

          <TestEditorArticleCountEditor
            articlesViewedSettings={test.articlesViewedSettings}
            onArticlesViewedSettingsChanged={this.onArticlesViewedSettingsChange}
            onValidationChange={isValid => console.log(isValid)}
            isDisabled={!this.isEditable()}
          />
        </div>

        <div className={classes.buttonsContainer}>
          <TestEditorActionButtons
            existingNames={this.props.testNames}
            existingNicknames={this.props.testNicknames}
            isDisabled={!this.isEditable()}
            onArchive={this.props.onArchive}
            onDelete={this.props.onDelete}
            onCopy={this.onCopy}
          />
        </div>
      </div>
    );
  };

  render(): React.ReactNode {
    return this.props.test ? this.props.visible && this.renderEditor(this.props.test) : null;
  }
}

export default withStyles(styles)(EpicTestEditor);
