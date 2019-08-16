import React from 'react';
import { EpicTest, EpicVariant, UserCohort } from "./epicTestsForm";
import {
  Theme, createStyles, WithStyles, withStyles, Select, FormControl, InputLabel, MenuItem, Input, Checkbox, ListItemText, Typography
} from "@material-ui/core";
import EditableTextField from "../helpers/editableTextField"
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { Region } from '../../utils/models';
import EpicTestVariantsList from './epicTestVariantsList';
import NewNameCreator from './newNameCreator';

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

class EpicTestEditor extends React.Component<Props, EpicTestVariantsState> {

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

  createVariant = (newVariantName: string) => {
    const newVariant: EpicVariant = {
      name: newVariantName,
      heading: "",
      paragraphs: [],
      highlightedText: "",
      footer: "",
      showTicker: false,
      backgroundImageUrl: "",
      ctaText: "",
      supportBaseURL: ""
    }

      if (this.props.test) {
        const newVariantList: EpicVariant[] = [...this.props.test.variants, newVariant];
        this.updateTest(test => ({...test, "variants": newVariantList}));
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
    this.updateTest(test => ({...test, [fieldName]: updatedBool}));
  };

  onUserCohortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    let selectedCohort = event.target.value as UserCohort;
    this.updateTest(test => ({...test, "userCohort": selectedCohort}));
  };

  onLocationsChange = (event: any) => { // this should be React.ChangeEvent<HTMLSelectElement> but event.target.value is an array of strings if it's a multi-select event
    const selectedLocations = event.target.value as Region[];
    this.updateTest(test => ({...test, "locations": selectedLocations}));

  }

  onVariantNameCreation = (name: string) => {
    this.createVariant(name);
  }

  renderVariantListAndEditor = (test: EpicTest): React.ReactNode => {
    return (
      <div>
        <NewNameCreator text="variant" existingNames={test ? test.variants.map(variant => variant.name) : []} onValidName={this.createVariant} />
        <EpicTestVariantsList
          variantNames={test.variants.map(variant => variant.name)}
          variantHeadings={test.variants.map(variant => variant.heading ? variant.heading : "")}
          onVariantSelected={this.onVariantSelected}
          selectedVariantName={this.state.selectedVariantName}
          variants={test.variants}
          onVariantChange={this.onVariantChange}
        />
        </div>
    );
  }

  renderNoVariants = (): React.ReactNode => {
    return (
      <>
        <Typography variant={'subtitle1'} color={'textPrimary'}>Create the first variant for this test</Typography>
        <Typography variant={'body1'}>(each test must have at least one variant)</Typography>
        <EditableTextField
            text=""
            onSubmit={this.onVariantNameCreation}
            label="First variant name:"
            startInEditMode={true}
          />
      </>
    );
  }

  renderEditor = (test: EpicTest): React.ReactNode => {
    const {classes} = this.props;
    return (
      <>
        <Typography
        variant={'h4'}
        >
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


        <Typography variant={'h5'}>Variants</Typography>



        {test.variants.length > 0 ? this.renderVariantListAndEditor(test) : this.renderNoVariants()}

        <Typography variant={'h5'}>Editorial tags</Typography>
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
          />

          <EditableTextField
            text={test.excludedSections.join(",")}
            onSubmit={this.onListChange("excludedSections")}
            label="Excluded sections:"
          />

          <Typography variant={'h5'}>Audience</Typography>
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="locations-select-multiple-checkbox">Locations</InputLabel>
            <Select
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
            label={`Always Ask is ${test.alwaysAsk ? "on" : "off"}`}
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
