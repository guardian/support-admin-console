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
import EpicTestVariantEditor from './epicTestVariantEditor';
import EpicTestTargetContentEditor from './epicTestTargetContentEditor';
import MaxEpicViewsEditor from './maxEpicViewsEditor';
import { onFieldValidationChange } from '../helpers/validation';
import ButtonWithConfirmationPopup from '../buttonWithConfirmationPopup';
import DeleteSweepIcon from '@material-ui/icons/DeleteSweep';
import ArchiveIcon from '@material-ui/icons/Archive';
import { defaultArticlesViewedSettings } from '../articlesViewedEditor';
import NewNameCreator from '../newNameCreator';
import { articleCountTemplate, countryNameTemplate } from '../helpers/copyTemplates';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const styles = ({ spacing, typography, palette }: Theme) =>
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
    fieldsContainer: {
      '& > *': {
        marginTop: spacing(3),
      },
    },
    formControl: {
      marginTop: spacing(2),
      marginBottom: spacing(1),
      display: 'block',
    },
    h3: {
      fontSize: typography.pxToRem(28),
      fontWeight: typography.fontWeightMedium,
      margin: '10px 0 15px',
    },
    hasChanged: {
      color: 'orange',
    },
    boldHeading: {
      fontSize: typography.pxToRem(17),
      fontWeight: typography.fontWeightBold,
      margin: '20px 0 10px',
    },
    select: {
      minWidth: '460px',
      paddingTop: '10px',
      marginBottom: '20px',
    },
    selectLabel: {
      fontSize: typography.pxToRem(22),
      color: 'black',
    },
    radio: {
      paddingTop: '20px',
      marginBottom: '10px',
    },
    visibilityIcons: {
      marginTop: spacing(1),
    },
    switchWithIcon: {
      display: 'flex',
    },
    visibilityHelperText: {
      marginTop: spacing(1),
      marginLeft: spacing(1),
    },
    buttons: {
      display: 'flex',
      justifyContent: 'flex-end',
    },
    button: {
      marginTop: spacing(2),
      marginLeft: spacing(2),
    },
    isDeleted: {
      color: '#ab0613',
    },
    isArchived: {
      color: '#a1845c',
    },
    switchLabel: {
      marginTop: spacing(0.6),
      marginRight: spacing(6),
      fontSize: typography.pxToRem(18),
    },
  });

const copyHasTemplate = (test: EpicTest, template: string): boolean =>
  test.variants.some(
    variant =>
      (variant.heading && variant.heading.includes(template)) ||
      variant.paragraphs.some(para => para.includes(template)),
  );

interface EpicTestEditorProps extends WithStyles<typeof styles> {
  test?: EpicTest;
  hasChanged: boolean;
  isLiveblog: boolean;
  onChange: (updatedTest: EpicTest) => void;
  onValidationChange: (isValid: boolean) => void;
  visible: boolean;
  editMode: boolean;
  onDelete: (testName: string) => void;
  onArchive: (testName: string) => void;
  onSelectedTestName: (testName: string) => void;
  isDeleted: boolean;
  isArchived: boolean;
  isNew: boolean;
  testNames: string[];
  testNicknames: string[];
  createTest: (newTest: EpicTest) => void;
}

const areYouSure = `Are you sure? This can't be undone without cancelling entire edit session!`;

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

  renderBottomButtons = (test: EpicTest): React.ReactElement => (
    <div className={this.props.classes.buttons}>
      <div className={this.props.classes.button}>
        <ButtonWithConfirmationPopup
          buttonText="Archive test"
          confirmationText={areYouSure}
          onConfirm={(): void => this.props.onArchive(test.name)}
          icon={<ArchiveIcon />}
        />
      </div>
      <div className={this.props.classes.button}>
        <ButtonWithConfirmationPopup
          buttonText="Delete test"
          confirmationText={areYouSure}
          onConfirm={(): void => this.props.onDelete(test.name)}
          icon={<DeleteSweepIcon />}
        />
      </div>
      <div className={this.props.classes.button}>
        <NewNameCreator
          type="test"
          action="Copy"
          existingNames={this.props.testNames}
          existingNicknames={this.props.testNicknames}
          onValidName={this.copyTest}
          editEnabled={this.props.editMode}
          initialValue={test.name}
        />
      </div>
    </div>
  );

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
      </div>
    );
  };

  render(): React.ReactNode {
    return this.props.test ? this.props.visible && this.renderEditor(this.props.test) : null;
  }
}

export default withStyles(styles)(EpicTestEditor);
