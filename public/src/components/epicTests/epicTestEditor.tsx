import React, { ReactNode, ChangeEvent } from 'react';
import {EpicTest, EpicVariant, UserCohort, MaxEpicViews, ArticlesViewedSettings} from "./epicTestsForm";
import {
  Checkbox,
  FormControl,
  FormControlLabel,
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
import EditableTextField from "../helpers/editableTextField"
import { Region } from '../../utils/models';
import EpicTestVariantsList from './epicTestVariantsList';
import MaxEpicViewsEditor from './maxEpicViewsEditor';
import { renderVisibilityIcons, renderVisibilityHelpText } from './utilities';
import {onFieldValidationChange, ValidationStatus} from '../helpers/validation';
import ButtonWithConfirmationPopup from '../helpers/buttonWithConfirmationPopup';
import DeleteSweepIcon from '@material-ui/icons/DeleteSweep';
import ArchiveIcon from '@material-ui/icons/Archive';
import {articleCountTemplate, countryNameTemplate} from "./epicTestVariantEditor";
import ArticlesViewedEditor, {defaultArticlesViewedSettings} from "./articlesViewedEditor";

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
    float: 'right'
  },
  isDeleted: {
    color: '#ab0613'
  },
  isArchived: {
    color: '#a1845c'
  }
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
  isNew: boolean
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

  updateTest = (update: (test: EpicTest) => EpicTest) => {
    if (this.props.test) {
      const updatedTest = update(this.props.test);

      this.props.onChange({
        ...updatedTest,
        // To save dotcom from having to work this out
        hasCountryName: copyHasTemplate(updatedTest, countryNameTemplate),
        // Temporarily hardcode a default articlesViewedSettings. We can add a UI for configuring this later
        // articlesViewedSettings: copyHasTemplate(updatedTest, articleCountTemplate) ? defaultArticlesViewedSettings : undefined
      })
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

  onLocationsChange = (event: React.ChangeEvent<{ name?: string | undefined; value: unknown; }>, child: ReactNode) => {
    const selectedLocations = event.target.value as Region[];
    this.updateTest(test => ({...test, "locations": selectedLocations}));
  }

  renderDeleteTestButton = (testName: string) => {
    return this.isEditable() && (
      <ButtonWithConfirmationPopup
        buttonText="Delete test"
        confirmationText={areYouSure}
        onConfirm={() => this.props.onDelete(testName)}
        icon={<DeleteSweepIcon />}
      />
    );
  };

  renderArchiveButton = (testName: string) => {
    return this.isEditable() && (
      <ButtonWithConfirmationPopup
        buttonText="Archive test"
        confirmationText={areYouSure}
        onConfirm={() => this.props.onArchive(testName)}
        icon={<ArchiveIcon />}
      />
    )
  }

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
          <div>
          <FormControlLabel
            control={
              <Switch
                checked={test.isOn}
                onChange={this.onSwitchChange("isOn")}
                disabled={!this.isEditable()}
              />
            }
            label={`Test is ${test.isOn ? "live" : "draft"}`}
          />
          </div>

          <div className={classes.visibilityIcons}>{renderVisibilityIcons(test.isOn)}</div>
          <div className={classes.visibilityHelperText}>{renderVisibilityHelpText(test.isOn)}</div>

        </div>

        <div>
          <FormControlLabel
            control={
              <Switch
                checked={test.isLiveBlog}
                onChange={this.onSwitchChange("isLiveBlog")}
                disabled={!this.isEditable()}
              />
            }
            label="Liveblog Epic"
          />
        </div>

        <div>
          <FormControlLabel
            control={
              <Switch
                checked={test.highPriority}
                onChange={this.onSwitchChange("highPriority")}
                disabled={!this.isEditable()}
              />
            }
            label="High priority"
          />
        </div>

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
            onSubmit={this.onListChange("tagIds")}
            label="Display on tags:"
            helperText="Separate each tag with a comma"
            editEnabled={this.isEditable()}
          />

          <EditableTextField
            text={test.sections.join(",")}
            onSubmit={this.onListChange("sections")}
            label="Display on sections:"
            helperText="Separate each section with a comma"
            editEnabled={this.isEditable()}
          />

          <EditableTextField
            text={test.excludedTagIds.join(",")}
            onSubmit={this.onListChange("excludedTagIds")}
            label="Excluded tags:"
            helperText="Separate each tag with a comma"
            editEnabled={this.isEditable()}
          />

          <EditableTextField
            text={test.excludedSections.join(",")}
            onSubmit={this.onListChange("excludedSections")}
            label="Excluded sections:"
            helperText="Separate each section with a comma"
            editEnabled={this.isEditable()}
          />

          <Typography variant={'h4'} className={classes.h4}>Audience</Typography>

          <FormControl
            className={classes.formControl}>
              <InputLabel
                className={classes.selectLabel}
                shrink
                htmlFor="locations-select-multiple-checkbox">
                  Locations:
              </InputLabel>
              <Select
                className={classes.select}
                multiple
                value={test.locations}
                onChange={this.onLocationsChange}
                input={<Input id="locations-select-multiple-checkbox" />}
                renderValue={selected => (selected as string[]).join(', ')}
                disabled={!this.isEditable()}
              >
                {Object.values(Region).map(region => (
                  <MenuItem key={region} value={region} >
                    <Checkbox checked={test.locations.indexOf(region) > -1} />
                    <ListItemText primary={region} />
                  </MenuItem>
                ))}
              </Select>
          </FormControl>

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
                onChange={this.onSwitchChange("useLocalViewLog")}
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

          <div className={classes.buttons}>
            <div className={classes.button}>{this.renderArchiveButton(test.name)}</div>
            <div className={classes.button}>{this.renderDeleteTestButton(test.name)}</div>
          </div>

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
