import React from 'react';
import { Region } from '../../../utils/models';
import { EpicTest, EpicVariant, MaxEpicViews } from './epicTestsForm';
import { ArticlesViewedSettings, TestEditorState, UserCohort } from '../helpers/shared';
import {
  createStyles,
  FormControl,
  FormControlLabel,
  InputLabel,
  Radio,
  RadioGroup,
  Switch,
  Theme,
  Typography,
  WithStyles,
  withStyles,
} from '@material-ui/core';
import EditableTextField from '../editableTextField';
import EpicTestVariantsList from './epicTestVariantsList';
import MaxEpicViewsEditor from './maxEpicViewsEditor';
import { onFieldValidationChange } from '../helpers/validation';
import ButtonWithConfirmationPopup from '../buttonWithConfirmationPopup';
import DeleteSweepIcon from '@material-ui/icons/DeleteSweep';
import ArchiveIcon from '@material-ui/icons/Archive';
import ArticlesViewedEditor, { defaultArticlesViewedSettings } from '../articlesViewedEditor';
import NewNameCreator from '../newNameCreator';
import EpicTypeComponent, { EpicType } from './epicTypeComponent';
import TargetRegionsSelector from '../targetRegionsSelector';
import { articleCountTemplate, countryNameTemplate } from '../helpers/copyTemplates';

const styles = ({ spacing, typography }: Theme) =>
  createStyles({
    container: {
      width: '100%',
      borderTop: `2px solid #999999`,
      marginLeft: spacing(2),
      marginTop: spacing(6),
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
  onChange: (updatedTest: EpicTest) => void;
  onValidationChange: (isValid: boolean) => void;
  visible: boolean;
  editMode: boolean;
  onDelete: (testName: string) => void;
  onArchive: (testName: string) => void;
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

  isEditable = () => {
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

  updateTest = (update: (test: EpicTest) => EpicTest) => {
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
      const newTest: EpicTest = {
        ...this.props.test,
        name: newTestName,
        nickname: newTestNickname,
      };
      this.props.createTest(newTest);
    }
  };

  onVariantsChange = (updatedVariantList: EpicVariant[]): void => {
    if (this.props.test) {
      this.updateTest(test => ({ ...test, variants: updatedVariantList }));
    }
  };

  onListChange = (fieldName: string) => (updatedString: string): void => {
    const updatedList = updatedString === '' ? [] : updatedString.split(',');
    this.updateTest(test => ({ ...test, [fieldName]: updatedList }));
  };

  onSwitchChange = (fieldName: string) => (event: React.ChangeEvent<HTMLInputElement>): void => {
    const updatedBool = event.target.checked;
    this.updateTest(test => ({ ...test, [fieldName]: updatedBool }));
  };

  onUserCohortChange = (event: React.ChangeEvent<{}>, value: string): void => {
    const selectedCohort = value as UserCohort;
    this.updateTest(test => ({ ...test, userCohort: selectedCohort }));
  };

  onEpicTypeChange = (epicType: EpicType): void => {
    const isLiveBlog = epicType === 'LiveBlog';
    this.updateTest(test => ({ ...test, isLiveBlog: isLiveBlog }));
  };

  onTargetRegionsChange = (selectedRegions: Region[]): void => {
    this.updateTest(test => ({ ...test, locations: selectedRegions }));
  };

  renderBottomButtons = (test: EpicTest) => (
    <div className={this.props.classes.buttons}>
      <div className={this.props.classes.button}>
        <ButtonWithConfirmationPopup
          buttonText="Archive test"
          confirmationText={areYouSure}
          onConfirm={() => this.props.onArchive(test.name)}
          icon={<ArchiveIcon />}
        />
      </div>
      <div className={this.props.classes.button}>
        <ButtonWithConfirmationPopup
          buttonText="Delete test"
          confirmationText={areYouSure}
          onConfirm={() => this.props.onDelete(test.name)}
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

  renderEditor = (test: EpicTest): React.ReactNode => {
    const { classes } = this.props;

    const statusText = () => {
      if (this.props.isDeleted) {
        return <span className={classes.isDeleted}>&nbsp;(to be deleted)</span>;
      } else if (this.props.isArchived) {
        return <span className={classes.isArchived}>&nbsp;(to be archived)</span>;
      } else if (this.props.isNew) {
        return <span className={classes.hasChanged}>&nbsp;(new)</span>;
      } else if (this.props.hasChanged) {
        return <span className={classes.hasChanged}>&nbsp;(modified)</span>;
      }
    };

    return (
      <div className={classes.container}>
        <Typography variant={'h3'} className={classes.h3}>
          {this.props.test && this.props.test.name}
          {statusText()}
        </Typography>
        <Typography variant={'h4'} className={classes.boldHeading}>
          {this.props.test && this.props.test.nickname}
        </Typography>

        <div className={classes.switchWithIcon}>
          <Typography className={classes.switchLabel}>Live on theguardian.com</Typography>
          <Switch
            checked={test.isOn}
            onChange={this.onSwitchChange('isOn')}
            disabled={!this.isEditable()}
          />
        </div>

        <hr />

        <EpicTypeComponent
          epicType={test.isLiveBlog ? 'LiveBlog' : 'Standard'}
          isEditable={this.isEditable()}
          onEpicTypeChange={this.onEpicTypeChange}
        />

        <Typography variant={'h4'} className={classes.boldHeading}>
          Variants
        </Typography>
        <div>
          <EpicTestVariantsList
            variants={test.variants}
            onVariantsListChange={this.onVariantsChange}
            testName={test.name}
            editMode={this.isEditable()}
            onValidationChange={onFieldValidationChange(this)('variantsList')}
          />
        </div>

        <Typography variant={'h4'} className={classes.boldHeading}>
          Target content
        </Typography>

        <div className={classes.fieldsContainer}>
          <EditableTextField
            text={test.tagIds.join(',')}
            onSubmit={this.onListChange('tagIds')}
            label="Target tags"
            helperText="Format: environment/wildlife,business/economics"
            editEnabled={this.isEditable()}
            fullWidth
          />

          <EditableTextField
            text={test.sections.join(',')}
            onSubmit={this.onListChange('sections')}
            label="Target sections"
            helperText="Format: environment,business"
            editEnabled={this.isEditable()}
            fullWidth
          />

          <EditableTextField
            text={test.excludedTagIds.join(',')}
            onSubmit={this.onListChange('excludedTagIds')}
            label="Excluded tags"
            helperText="Format: environment/wildlife,business/economics"
            editEnabled={this.isEditable()}
            fullWidth
          />

          <EditableTextField
            text={test.excludedSections.join(',')}
            onSubmit={this.onListChange('excludedSections')}
            label="Excluded sections"
            helperText="Format: environment,business"
            editEnabled={this.isEditable()}
            fullWidth
          />

          <Typography variant={'h4'} className={classes.boldHeading}>
            Target audience
          </Typography>

          <TargetRegionsSelector
            regions={test.locations}
            onRegionsUpdate={this.onTargetRegionsChange}
            isEditable={this.isEditable()}
          />

          <FormControl className={classes.formControl}>
            <InputLabel className={classes.selectLabel} shrink htmlFor="user-cohort">
              Supporter status
            </InputLabel>
            <RadioGroup
              className={classes.radio}
              value={test.userCohort}
              onChange={this.onUserCohortChange}
            >
              {Object.values(UserCohort).map(cohort => (
                <FormControlLabel
                  value={cohort}
                  key={cohort}
                  control={<Radio />}
                  label={cohort}
                  disabled={!this.isEditable()}
                />
              ))}
            </RadioGroup>
          </FormControl>

          <Typography variant={'h4'} className={this.props.classes.boldHeading}>
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
            onChange={(alwaysAsk: boolean, maxEpicViews: MaxEpicViews) =>
              this.updateTest(test => ({
                ...test,
                alwaysAsk,
                maxViews: maxEpicViews,
              }))
            }
            onValidationChange={onFieldValidationChange(this)('maxViews')}
          />

          <Typography variant={'h4'} className={this.props.classes.boldHeading}>
            Article count
          </Typography>
          <ArticlesViewedEditor
            articlesViewedSettings={test.articlesViewedSettings}
            editMode={this.isEditable()}
            onChange={(articlesViewedSettings?: ArticlesViewedSettings) =>
              this.updateTest(test => ({ ...test, articlesViewedSettings }))
            }
            onValidationChange={onFieldValidationChange(this)('articlesViewedEditor')}
          />

          {this.isEditable() && this.props.test && this.renderBottomButtons(this.props.test)}
        </div>
      </div>
    );
  };

  render(): React.ReactNode {
    return this.props.test ? this.props.visible && this.renderEditor(this.props.test) : null;
  }
}

export default withStyles(styles)(EpicTestEditor);
