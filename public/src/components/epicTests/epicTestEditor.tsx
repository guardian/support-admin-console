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

interface Props extends WithStyles<typeof styles> {
  test?: EpicTest,
  onChange: (updatedTest: EpicTest) => void
}

class EpicTestEditor extends React.Component<Props> {

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

  renderEditor = (test: EpicTest): React.ReactNode => {
    const {classes} = this.props;
    return (
      <>
        <Typography variant={'h2'} className={classes.h2}>
          {this.props.test && this.props.test.name}
        </Typography>

        <FormControlLabel
          control={
            <Switch
              checked={test.isOn}
              onChange={this.onSwitchChange("isOn")}
            />
          }
          label={`Test is ${test.isOn ? "on" : "off"}`}
        />

        <div>
          <FormControlLabel
            control={
              <Switch
                checked={test.isLiveBlog}
                onChange={this.onSwitchChange("isLiveBlog")}
              />
            }
            label="Liveblog Epic"
          />
        </div>


        <Typography variant={'h3'} className={classes.h3}>Variants</Typography>

        <div>
          <EpicTestVariantsList
            variants={test.variants}
            onVariantsListChange={this.onVariantsChange}
            testName={test.name}
          />
        </div>

        <Typography variant={'h3'} className={classes.h3}>Editorial tags</Typography>
        <div>


          <EditableTextField
            text={test.tagIds.join(",")}
            onSubmit={this.onListChange("tagIds")}
            label="Display on tags:"
            helperText="Separate each tag with a comma"
          />

          <EditableTextField
            text={test.sections.join(",")}
            onSubmit={this.onListChange("sections")}
            label="Display on sections:"
            helperText="Separate each section with a comma"
          />

          <EditableTextField
            text={test.excludedTagIds.join(",")}
            onSubmit={this.onListChange("excludedTagIds")}
            label="Excluded tags:"
            helperText="Separate each tag with a comma"

          />

          <EditableTextField
            text={test.excludedSections.join(",")}
            onSubmit={this.onListChange("excludedSections")}
            label="Excluded sections:"
            helperText="Separate each section with a comma"

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
                  <FormControlLabel value={cohort} key={cohort} control={<Radio />} label={cohort} />
                )}
              </RadioGroup>
          </FormControl>

          <FormControlLabel
            control={
              <Switch
                checked={test.alwaysAsk}
                onChange={this.onSwitchChange("alwaysAsk")}
              />
            }
            label={`Turn ${test.alwaysAsk ? "off" : "on"} Always Ask`}
          />
        </div>

      </>
    )
  };

  render(): React.ReactNode {
    const {classes} = this.props;

    return (
      <div className={classes.container}>
        {this.props.test ? this.renderEditor(this.props.test) : <Typography>Please select a test from the list on the left.</Typography>}
      </div>
    )
  }
}

export default withStyles(styles)(EpicTestEditor);
