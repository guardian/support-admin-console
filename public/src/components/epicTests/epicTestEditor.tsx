import React from 'react';
import { EpicTest, EpicVariant, UserCohort } from "./epicTestsForm";
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
import { Region, isRegion } from '../../utils/models';
import EpicTestVariantsList from './epicTestVariantsList';

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
    color: 'red'
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
  }
});

interface EpicTestEditorProps extends WithStyles<typeof styles> {
  test?: EpicTest,
  hasChanged: boolean,
  onChange: (updatedTest: EpicTest) => void,
  visible: boolean,
  editMode: boolean
}

class EpicTestEditor extends React.Component<EpicTestEditorProps> {

  updateTest = (update: (test: EpicTest) => EpicTest) => {
    if (this.props.test) {
      this.props.onChange(update(this.props.test))
    }
  }

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
  }

  onNumberChange = (fieldName: string) => (updatedString: string): void => {
    Number.isNaN(Number(updatedString)) ? alert("Only numbers are allowed!") : this.updateTest( test=> ({
      ...test,
      [fieldName]: Number(updatedString) })
    );
  }

  renderEditor = (test: EpicTest): React.ReactNode => {
    const {classes} = this.props;

    return (
      <div className={classes.container}>
        <Typography variant={'h2'} className={classes.h2}>
          {this.props.test && this.props.test.name}
          { this.props.hasChanged && <span className={classes.hasChanged}>(modified)</span> }
        </Typography>

        <div>
          <FormControlLabel
            control={
              <Switch
                checked={test.isOn}
                onChange={this.onSwitchChange("isOn")}
                disabled={!this.props.editMode}
              />
            }
            label={`Test is ${test.isOn ? "on" : "off"}`}
          />
        </div>

        <div>
          <FormControlLabel
            control={
              <Switch
                checked={test.isLiveBlog}
                onChange={this.onSwitchChange("isLiveBlog")}
                disabled={!this.props.editMode}
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
                disabled={!this.props.editMode}
              />
            }
            label="High priority"
          />
        </div>

        <Typography variant={'h3'} className={classes.h3}>Variants</Typography>
        {/* TODO: add validation to ensure at least one variant exists before publishing is allowed */}
        <div>
          <EpicTestVariantsList
            variants={test.variants}
            onVariantsListChange={this.onVariantsChange}
            testName={test.name}
            editMode={this.props.editMode}
          />
        </div>

        <Typography variant={'h3'} className={classes.h3}>Editorial tags</Typography>

        <div>
          <EditableTextField
            text={test.tagIds.join(",")}
            onSubmit={this.onListChange("tagIds")}
            label="Display on tags:"
            helperText="Separate each tag with a comma"
            editEnabled={this.props.editMode}
          />

          <EditableTextField
            text={test.sections.join(",")}
            onSubmit={this.onListChange("sections")}
            label="Display on sections:"
            helperText="Separate each section with a comma"
            editEnabled={this.props.editMode}
          />

          <EditableTextField
            text={test.excludedTagIds.join(",")}
            onSubmit={this.onListChange("excludedTagIds")}
            label="Excluded tags:"
            helperText="Separate each tag with a comma"
            editEnabled={this.props.editMode}
          />

          <EditableTextField
            text={test.excludedSections.join(",")}
            onSubmit={this.onListChange("excludedSections")}
            label="Excluded sections:"
            helperText="Separate each section with a comma"
            editEnabled={this.props.editMode}
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
                disabled={!this.props.editMode}
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
                    disabled={!this.props.editMode}
                  />
                )}
              </RadioGroup>
          </FormControl>

          <EditableTextField
            text={test.maxViewsCount.toString()}
            onSubmit={this.onNumberChange("maxViewsCount")}
            label="Max views count"
            helperText="Must be a number"
            editEnabled={this.props.editMode}
          />

          <div>
            <FormControlLabel
              control={
                <Switch
                  checked={test.alwaysAsk}
                  onChange={this.onSwitchChange("alwaysAsk")}
                  disabled={!this.props.editMode}
                />
              }
              label={`Always ask`}
            />
          </div>

          <div>
            <FormControlLabel
              control={
                <Switch
                  checked={test.useLocalViewLog}
                  onChange={this.onSwitchChange("useLocalViewLog")}
                  disabled={!this.props.editMode}
                />
              }
              label={`Use local view log`}
            />
          </div>
        </div>
      </div>
    )
  };

  render(): React.ReactNode {
    return (
      this.props.test ? this.props.visible && this.renderEditor(this.props.test) : null
    )
  }
}

export default withStyles(styles)(EpicTestEditor);
