import React from 'react';
import { EpicTest, EpicVariant, UserCohort } from "./epicTestsForm";
import {
  List, ListItem, Theme, createStyles, WithStyles, withStyles, Select, FormControl, InputLabel, MenuItem, Input, Checkbox, ListItemText
} from "@material-ui/core";
import EditableTextField from "../helpers/editableTextField"
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { Region } from '../../utils/models';
import EpicTestVariantEditor from './epicTestVariantEditor';
import EpicTestVariantsList from './epicTestVariantsList';

const styles = ({ palette, spacing }: Theme) => createStyles({
  container: {
    width: "80%",
    borderTop: `2px solid ${palette.grey['300']}`,
    marginLeft: "15px"
  },
  variant: {
    display: "flex",
    "& span": {
      marginLeft: "4px",
      marginRight: "4px"
    }
  },
  variantName: {
    width: "10%"
  },
  variantHeading: {
    width: "20%"
  },
  variantListHeading: {
    fontWeight: "bold"
  },
  formControl: {
    marginTop: spacing.unit,
    marginBottom: spacing.unit,
    display: "block",
  },
  menu: {
    width: "500px"
  }
});

type EpicTestVariantsState = {
  selectedVariantName?: string
}
interface Props extends WithStyles<typeof styles> {
  test?: EpicTest,
  onChange: (updatedTest: EpicTest) => void
}

class EpicTestEditor extends React.Component<Props, any> {

  state: EpicTestVariantsState = { selectedVariantName: undefined}

  onVariantSelected = (variantName: string): void => {
    this.setState({
      selectedVariantName: variantName
    })
  };

  updateTest = (update: (test: EpicTest) => EpicTest) => {
    if (this.props.test) {
      this.props.onChange(update(this.props.test))
    }
  }

  onVariantChange = (updatedVariant: EpicVariant): void => {
      if (this.props.test) {
        const updatedVariantList: EpicVariant[] = this.props.test.variants.map(variant => variant.name === updatedVariant.name ? updatedVariant : variant);
        this.updateTest(test => ({...test, "variants": updatedVariantList}));
      }
  };

  onListChange = (fieldName: string) => (updatedString: string): void => {
    this.updateTest(test => ({...test, [fieldName]: updatedString.split(",")}));
  };

  onSwitchChange = (fieldName: string) => (event: React.ChangeEvent<HTMLInputElement>):void =>  {
    const updatedBool = event.target.checked;
    this.updateTest(test => ({...test, [fieldName]: updatedBool}))
  };

  onUserCohortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    let selectedCohort = event.target.value as UserCohort;
    this.updateTest(test => ({...test, "userCohort": selectedCohort}));
  };

  onLocationsChange = (event: any) => { // this should be React.ChangeEvent<HTMLSelectElement> but event.target.value is an array of strings if it's a multi-select event
    const selectedLocations = event.target.value as Region[];
    this.updateTest(test => ({...test, "locations": selectedLocations}));

  }

  renderEditor = (test: EpicTest): React.ReactNode => {
    const {classes} = this.props;
    return (
      <>
        <div>
        <FormControlLabel
            control={
              <Switch
                checked={test.isOn}
                onChange={this.onSwitchChange("isOn")}
              />
            }
            label="Test is on"
          />

          <EditableTextField
            text={test.tagIds.join(",")}
            onSubmit={this.onListChange("tagIds")}
            label="Tags:"
          />

          <EditableTextField
            text={test.excludedTagIds.join(",")}
            onSubmit={this.onListChange("excludedTagIds")}
            label="Excluded tags:"
          />

          <EditableTextField
            text={test.sections.join(",")}
            onSubmit={this.onListChange("sections")}
            label="Sections:"
          />

          <EditableTextField
            text={test.excludedSections.join(",")}
            onSubmit={this.onListChange("excludedSections")}
            label="Excluded sections:"
          />

          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="locations-select-multiple-checkbox">Locations</InputLabel>
            <Select
              multiple
              value={test.locations}
              onChange={this.onLocationsChange}
              input={<Input id="locations-select-multiple-checkbox" />}
              renderValue={selected => (selected as string[]).join(', ')}
              // className={classes.menu}
            >
              {Object.values(Region).map(region => (
                <MenuItem key={region} value={region} >
                  <Checkbox checked={test.locations.indexOf(region) > -1} />
                  <ListItemText primary={region} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="user-cohort">User cohort</InputLabel>
            <Select
              value={test.userCohort}
              onChange={this.onUserCohortChange}
            >
              {Object.values(UserCohort).map(cohort => <MenuItem key={cohort} value={cohort}>{cohort}</MenuItem>)}
            </Select>
          </FormControl>

          <FormControlLabel
            control={
              <Switch
                checked={test.alwaysAsk}
                onChange={this.onSwitchChange("alwaysAsk")}
              />
            }
            label="Always ask"
          />

          <FormControlLabel
            control={
              <Switch
                checked={test.isLiveBlog}
                onChange={this.onSwitchChange("isLiveBlog")}
              />
            }
            label="Is live blog"
          />

        </div>
        <h3>Variants</h3>

        <div className={classes.container}>
          <EpicTestVariantsList
            variantNames={test.variants.map(variant => variant.name)}
            variantHeadings={test.variants.map(variant => variant.heading ? variant.heading : "")}
            onVariantSelected={this.onVariantSelected}
            selectedVariantName={this.state.selectedVariantName}
          />
          <EpicTestVariantEditor
            variant={this.state.selectedVariantName ? test.variants.find(variant => variant.name === this.state.selectedVariantName) : undefined}
            onVariantChange={this.onVariantChange}
           />
        </div>
      </>
    )
  };

  render(): React.ReactNode {
    const {classes} = this.props;

    return (
      <div className={classes.container}>
        {this.props.test ? this.renderEditor(this.props.test) : <div>No test selected</div>}
      </div>
    )
  }
}

export default withStyles(styles)(EpicTestEditor);
