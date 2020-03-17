import React, { ReactNode } from 'react';
import { Region } from '../../utils/models';
import {EpicTest, EpicVariant, UserCohort, MaxEpicViews, ArticlesViewedSettings} from "./epicTestsForm";
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  Input,
  InputLabel,
  ListItemText,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Switch,
  Theme,
  Typography,
  WithStyles,
  createStyles,
  withStyles
} from "@material-ui/core";
import EditableTextField from '../helpers/editableTextField';
import EpicTestVariantsList from './epicTestVariantsList';
import MaxEpicViewsEditor from './maxEpicViewsEditor';
import {onFieldValidationChange, ValidationStatus} from '../helpers/validation';
import ButtonWithConfirmationPopup from '../helpers/buttonWithConfirmationPopup';
import DeleteSweepIcon from '@material-ui/icons/DeleteSweep';
import ArchiveIcon from '@material-ui/icons/Archive';
import {articleCountTemplate, countryNameTemplate} from './epicTestVariantEditor';
import ArticlesViewedEditor, {defaultArticlesViewedSettings} from './articlesViewedEditor';
import NewNameCreator from './newNameCreator';
import EpicTypeComponent, {EpicType} from './epicTypeComponent';
import TargetRegionsSelector from './targetRegionsSelector';

const styles = ({ spacing, typography}: Theme) => createStyles({
  container: {
    width: '100%',
    borderTop: `2px solid #999999`,
    marginLeft: spacing(2),
    marginTop: spacing(6)
  },
  formControl: {
    marginTop: spacing(2),
    marginBottom: spacing(1),
    display: 'block',
  },
  h3: {
    fontSize: typography.pxToRem(28),
    fontWeight: typography.fontWeightMedium,
    margin: '10px 0 15px'
  },
  hasChanged: {
    color: 'orange'
  },
  h4: {
    fontSize: typography.pxToRem(24),
    fontWeight: typography.fontWeightMedium,
    margin: '20px 0 15px'
  },
  select: {
    minWidth: "460px",
    paddingTop: "10px",
    marginBottom: "20px"
  },
  selectLabel: {
    fontSize: typography.pxToRem(22),
    fontWeight: typography.fontWeightMedium,
    color: 'black'
  },
  radio: {
    paddingTop: '20px',
    marginBottom: '10px'
  },
  visibilityIcons: {
    marginTop: spacing(1)
  },
  switchWithIcon: {
    display: 'flex'
  },
  visibilityHelperText: {
    marginTop: spacing(1),
    marginLeft: spacing(1)
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end'
  },
  button: {
    marginTop: spacing(2),
    marginLeft: spacing(2),
  },
  isDeleted: {
    color: '#ab0613'
  },
  isArchived: {
    color: '#a1845c'
  },
  switchLabel: {
    marginTop: spacing(0.6),
    marginRight: spacing(6),
    fontSize: typography.pxToRem(18),
  },
});

const copyHasTemplate = (test: EpicTest, template: string): boolean => test.variants.some(variant =>
  variant.heading && variant.heading.includes(template) ||
  variant.paragraphs.some(para => para.includes(template))
);

interface EpicTestEditorProps extends WithStyles<typeof styles> {
  test?: EpicTest,
  hasChanged: boolean,
  onChange: (updatedTest: EpicTest) => void,
  onValidationChange: (isValid: boolean) => void,
  visible: boolean,
  editMode: boolean,
  onDelete: (testName: string) => void,
  onArchive: (testName: string) => void,
  isDeleted: boolean,
  isArchived: boolean,
  isNew: boolean,
  testNames: string[],
  createTest: (newTest: EpicTest) => void
}

interface EpicTestEditorState {
  validationStatus: ValidationStatus
}

const areYouSure = `Are you sure? This can't be undone without cancelling entire edit session!`;

class EpicTestEditor extends React.Component<EpicTestEditorProps, EpicTestEditorState> {

  state: EpicTestEditorState = {
    validationStatus: {}
  };

  isEditable = () => {
    return this.props.editMode && !this.props.isDeleted && !this.props.isArchived;
  }

  getArticlesViewedSettings = (test: EpicTest): ArticlesViewedSettings | undefined => {
    if (!!test.articlesViewedSettings) {
      return test.articlesViewedSettings;
    }
    if (copyHasTemplate(test, articleCountTemplate)) {
      return defaultArticlesViewedSettings
    }
    return undefined;
  }

  updateTest = (update: (test: EpicTest) => EpicTest) => {
    if (this.props.test) {
      const updatedTest = update(this.props.test);

      this.props.onChange({
        ...updatedTest,
        // To save dotcom from having to work this out
        hasCountryName: copyHasTemplate(updatedTest, countryNameTemplate),
        articlesViewedSettings: this.getArticlesViewedSettings(updatedTest),
      })
    }
  }

  copyTest = (newTestName: string): void => {
    if (this.props.test) {
      const newTest: EpicTest = {
        ...this.props.test,
        name: newTestName
      };
      this.props.createTest(newTest)
    }
  }

  onVariantsChange = (updatedVariantList: EpicVariant[]): void => {
    if (this.props.test) {
      this.updateTest(test => ({...test, "variants": updatedVariantList}));
    }
  }

  onListChange = (fieldName: string) => (updatedString: string): void => {
    this.updateTest(test => ({...test, [fieldName]: updatedString.split(",")}));
  }

  onSwitchChange = (fieldName: string) => (event: React.ChangeEvent<HTMLInputElement>): void =>  {
    const updatedBool = event.target.checked;
    this.updateTest(test => ({...test, [fieldName]: updatedBool}));
  }

  onUserCohortChange = (event: React.ChangeEvent<{}>, value: string): void => {
    let selectedCohort = value as UserCohort;
    this.updateTest(test => ({...test, "userCohort": selectedCohort}));
  }

  onEpicTypeChange = (epicType: EpicType): void => {
    const isLiveBlog = epicType === 'LiveBlog';
    this.updateTest(test => ({...test, "isLiveBlog": isLiveBlog}))
  }

  onTargetRegionsChange = (selectedRegions: Region[]): void => {
    this.updateTest(test => ({...test, 'locations': selectedRegions}));
  }

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
          existingNames={ this.props.testNames }
          onValidName={this.copyTest}
          editEnabled={this.props.editMode}
          initialValue={test.name}
        />
      </div>
    </div>
  )

  renderEditor = (test: EpicTest): React.ReactNode => {
    const {classes} = this.props;

    const statusText = () => {
      if (this.props.isDeleted) return <span className={classes.isDeleted}>&nbsp;(to be deleted)</span>;
      else if (this.props.isArchived) return <span className={classes.isArchived}>&nbsp;(to be archived)</span>;
      else if (this.props.isNew) return <span className={classes.hasChanged}>&nbsp;(new)</span>;
      else if (this.props.hasChanged) return <span className={classes.hasChanged}>&nbsp;(modified)</span>;
    };

    return (
      <div className={classes.container}>
        <Typography variant={'h3'} className={classes.h3}>
          {this.props.test && this.props.test.name}
          {statusText()}
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

        <Typography variant={'h4'} className={classes.h4}>Variants</Typography>
        <div>
          <EpicTestVariantsList
            variants={test.variants}
            onVariantsListChange={this.onVariantsChange}
            testName={test.name}
            editMode={this.isEditable()}
            onValidationChange={onFieldValidationChange(this)('variantsList')}
          />
        </div>

        <Typography variant={'h4'} className={classes.h4}>Editorial tags</Typography>

        <div>
          <EditableTextField
            text={test.tagIds.join(",")}
            onSubmit={this.onListChange('tagIds')}
            label="Display on tags:"
            helperText="Separate each tag with a comma"
            editEnabled={this.isEditable()}
          />

          <EditableTextField
            text={test.sections.join(",")}
            onSubmit={this.onListChange('sections')}
            label="Display on sections:"
            helperText="Separate each section with a comma"
            editEnabled={this.isEditable()}
          />

          <EditableTextField
            text={test.excludedTagIds.join(",")}
            onSubmit={this.onListChange('excludedTagIds')}
            label="Excluded tags:"
            helperText="Separate each tag with a comma"
            editEnabled={this.isEditable()}
          />

          <EditableTextField
            text={test.excludedSections.join(",")}
            onSubmit={this.onListChange('excludedSections')}
            label="Excluded sections:"
            helperText="Separate each section with a comma"
            editEnabled={this.isEditable()}
          />

          <Typography variant={'h4'} className={classes.h4}>Audience</Typography>

          <TargetRegionsSelector
            regions={test.locations}
            onRegionsUpdate={this.onTargetRegionsChange}
            isEditable={this.isEditable()}
          />


          <FormControl
            className={classes.formControl}>
              <InputLabel
                className={classes.selectLabel}
                shrink
                htmlFor="user-cohort">
                  User cohort:
              </InputLabel>
              <RadioGroup
                className={classes.radio}
                value={test.userCohort}
                onChange={this.onUserCohortChange}
              >
                {Object.values(UserCohort).map(cohort =>
                  <FormControlLabel
                    value={cohort}
                    key={cohort}
                    control={<Radio />}
                    label={cohort}
                    disabled={!this.isEditable()}
                  />
                )}
              </RadioGroup>
          </FormControl>

          <Typography variant={'h4'} className={this.props.classes.h4}>View frequency settings</Typography>

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
              this.updateTest(test => ({ ...test, alwaysAsk, maxViews: maxEpicViews }))
            }
            onValidationChange={onFieldValidationChange(this)('maxViews')}
          />

          <Typography variant={'h4'} className={this.props.classes.h4}>Articles count settings</Typography>
          <ArticlesViewedEditor
            articlesViewedSettings={test.articlesViewedSettings}
            editMode={this.isEditable()}
            onChange={(articlesViewedSettings?: ArticlesViewedSettings) =>
              this.updateTest(test => ({ ...test, articlesViewedSettings }))
            }
            onValidationChange={onFieldValidationChange(this)('articlesViewedEditor')}
          />

          { this.isEditable() && this.props.test && this.renderBottomButtons(this.props.test) }

        </div>
      </div>
    )
  }

  render(): React.ReactNode {
    return (
      this.props.test ? this.props.visible && this.renderEditor(this.props.test) : null
    )
  }
}

export default withStyles(styles)(EpicTestEditor);
