import React from 'react';
import { EpicTest, EpicVariant, UserCohort, MaxViews } from "./epicTestsForm";
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
import MaxViewsEditor from './maxViewsEditor';
import { renderVisibilityIcons, renderVisibilityHelpText, renderDeleteIcon } from './utilities';
import {onFieldValidationChange, ValidationStatus} from '../helpers/validation';
import ButtonWithConfirmationPopup from '../helpers/buttonWithConfirmationPopup';
import DeleteSweepIcon from '@material-ui/icons/DeleteSweep';

const styles = ({ spacing, typography}: Theme) => createStyles({
  container: {
    width: "100%",
    borderTop: `2px solid #999999`,
    marginLeft: "15px"
  },
  formControl: {
    marginTop: spacing.unit * 2,
    marginBottom: spacing.unit,
    display: "block",
  },
  h2: {
    fontSize: typography.pxToRem(28),
    fontWeight: typography.fontWeightMedium,
    margin: "10px 0 15px 0"
  },
  hasChanged: {
    color: 'orange'
  },
  h3: {
    fontSize: typography.pxToRem(24),
    fontWeight: typography.fontWeightMedium,
    margin: "20px 0 15px 0"
  },
  select: {
    minWidth: "500px",
    paddingTop: "10px",
    marginBottom: "20px"
  },
  selectLabel: {
    fontSize: typography.pxToRem(22),
    fontWeight: typography.fontWeightMedium,
    color: "black"
  },
  radio: {
    paddingTop: "20px",
    marginBottom: "10px"
  },
  visibilityIcons: {
    marginTop: spacing.unit * 1.5
  },
  switchWithIcon: {
    display: "flex"
  },
  visibilityHelperText: {
    marginTop: spacing.unit * 1.8,
    marginLeft: spacing.unit
  },
  deleteButton: {
    marginTop: spacing.unit * 2,
    float: "right"
  },
  isDeleted: {
    color: "#f44336"
  }
});

const countryNameTemplate = '%%COUNTRY_NAME%%';

interface EpicTestEditorProps extends WithStyles<typeof styles> {
  test?: EpicTest,
  hasChanged: boolean,
  onChange: (updatedTest: EpicTest) => void,
  onValidationChange: (isValid: boolean) => void,
  visible: boolean,
  editMode: boolean,
  onDelete: (testName: string) => void,
  isDeleted: boolean,
  isNew: boolean
}

interface EpicTestEditorState {
  validationStatus: ValidationStatus
}

class EpicTestEditor extends React.Component<EpicTestEditorProps, EpicTestEditorState> {

  state: EpicTestEditorState = {
    validationStatus: {}
  };

  isEditable = () => {
    return this.props.editMode && !this.props.isDeleted;
  };

  // To save dotcom from having to work this out
  hasCountryName = (test: EpicTest): boolean => test.variants.some(variant =>
    variant.heading && variant.heading.includes(countryNameTemplate) ||
      variant.paragraphs.some(para => para.includes(countryNameTemplate))
  );

  updateTest = (update: (test: EpicTest) => EpicTest) => {
    if (this.props.test) {
      const updatedTest = update(this.props.test);

      this.props.onChange({
        ...updatedTest,
        hasCountryName: this.hasCountryName(updatedTest)
      })
    }
  };

  onVariantsChange = (updatedVariantList: EpicVariant[]): void => {
    if (this.props.test) {
      this.updateTest(test => ({...test, "variants": updatedVariantList}));
    }
  };

  onListChange = (fieldName: string) => (updatedString: string): void => {
    this.updateTest(test => ({...test, [fieldName]: updatedString.split(",")}));
  };

  onSwitchChange = (fieldName: string) => (event: React.ChangeEvent<HTMLInputElement>): void =>  {
    const updatedBool = event.target.checked;
    this.updateTest(test => ({...test, [fieldName]: updatedBool}));
  };

  onUserCohortChange = (event: React.ChangeEvent<{}>, value: string): void => {
    let selectedCohort = value as UserCohort;
    this.updateTest(test => ({...test, "userCohort": selectedCohort}));
  };

  onLocationsChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedLocations = [...event.target.value] as Region[];
    this.updateTest(test => ({...test, "locations": selectedLocations}));
  };

  renderDeleteTestButton = (testName: string) => {
    return this.isEditable() && (
      <ButtonWithConfirmationPopup
        buttonText="Delete test"
        confirmationText={`Are you sure? This can't be undone without cancelling entire edit session!`}
        onConfirm={() => this.props.onDelete(testName)}
        icon={<DeleteSweepIcon />}
        color={'secondary'}
      />
    );
  };

  renderEditor = (test: EpicTest): React.ReactNode => {
    const {classes} = this.props;

    const statusText = () => {
      if (this.props.isDeleted) return <span className={classes.isDeleted}>&nbsp;(to be deleted)</span>;
      else if (this.props.isNew) return <span className={classes.hasChanged}>&nbsp;(new)</span>;
      else if (this.props.hasChanged) return <span className={classes.hasChanged}>&nbsp;(modified)</span>;
    };

    return (
      <div className={classes.container}>
        <Typography variant={'h2'} className={classes.h2}>
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

        <Typography variant={'h3'} className={classes.h3}>Variants</Typography>
        <div>
          <EpicTestVariantsList
            variants={test.variants}
            onVariantsListChange={this.onVariantsChange}
            testName={test.name}
            editMode={this.isEditable()}
            onValidationChange={onFieldValidationChange(this)('variantsList')}
          />
        </div>

        <Typography variant={'h3'} className={classes.h3}>Editorial tags</Typography>

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

          <Typography variant={'h3'} className={classes.h3}>Audience</Typography>

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

          <Typography variant={'h3'} className={this.props.classes.h3}>View frequency settings:</Typography>

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

          <MaxViewsEditor
            test={test}
            editMode={this.isEditable()}
            onChange={(alwaysAsk: boolean, maxViews: MaxViews) =>
              this.updateTest(test => ({ ...test, alwaysAsk, maxViews }))
            }
            onValidationChange={onFieldValidationChange(this)('maxViews')}
          />

          <div className={classes.deleteButton}>{this.renderDeleteTestButton(test.name)}</div>
        </div>
      </div>
    )
  };

  render(): React.ReactNode {
    return (
      this.props.test ? this.props.visible && this.renderEditor(this.props.test) : null
    )
  };
}

export default withStyles(styles)(EpicTestEditor);
