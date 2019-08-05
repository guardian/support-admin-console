import React from 'react';
import { EpicTest, EpicVariant, UserCohort } from "./epicTestsForm";
import {
  List, ListItem, Theme, createStyles, WithStyles, withStyles, Select, FormControl, InputLabel, MenuItem, Input, Checkbox, ListItemText
} from "@material-ui/core";
import EditableTextField from "../helpers/editableTextField"
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { Region } from '../../utils/models';
import { MenuProps } from 'material-ui';
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
    marginTop: spacing.unit * 2,
    marginBottom: spacing.unit,
    minWidth: "60%",
    maxWidth: "100%",
    display: "block",
  }
});
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

interface EpicTestVariants {
  variants: EpicVariant[]
}
interface Props extends WithStyles<typeof styles> {
  test?: EpicTest,
  onChange: (updatedTest: EpicTest) => void
}

enum TestFieldNames {
  locations = "locations",
  tagIds = "tagIds",
  sections = "sections",
  excludedTagIds = "excludedTagIds",
  excludedSections = "excludedSections",
  alwaysAsk = "alwaysAsk",
  userCohort = "userCohort",
  isLiveBlog = "isLiveBlog",
  hasCountryName = "hasCountryName",
  variants = "variants"
}
class EpicTestEditor extends React.Component<Props, any> {

  state = { selectedVariantName: undefined}

  onVariantSelected = (variantName: string): void => {
    this.setState({
      selectedVariantName: variantName
    })
  };


  updateTest = (fieldName: TestFieldNames, updatedData: string | string[]) => {
    if (this.props.test) {
      const updatedTest = {
        ...this.props.test,
        [fieldName]: updatedData
      };
      this.props.onChange(updatedTest)
    }
  }

  onListChange = (fieldName: TestFieldNames) => (updatedString: string): void => {
    this.updateTest(fieldName, updatedString.split(","));
  };

  onUserCohortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    let selectedCohort = event.target.value as UserCohort;
    this.updateTest(TestFieldNames.userCohort, selectedCohort);
  };

  onLocationsChange = (event: any) => { // this should be React.ChangeEvent<HTMLSelectElement> but event.target.value is an array of strings if it's a multi-select event
    const selectedLocations = event.target.value as Region[];
    this.updateTest(TestFieldNames.locations, selectedLocations);
  }

  renderVariant = (variant: EpicVariant): React.ReactNode => {
    const {classes} = this.props;
    return (
      <ListItem className={classes.variant} key={variant.name}>
        <span className={classes.variantName}>{variant.name}</span>
        <span className={classes.variantHeading}>{variant.heading}</span>
      </ListItem>
    )
  };

  renderEditor = (test: EpicTest): React.ReactNode => {
    const {classes} = this.props;
    return (
      <div>
        <div>
          <EditableTextField
            text={test.tagIds.join(",")}
            onSubmit={this.onListChange(TestFieldNames.tagIds)}
            label="Tags:"
          />

          <EditableTextField
            text={test.excludedTagIds.join(",")}
            onSubmit={this.onListChange(TestFieldNames.excludedTagIds)}
            label="Excluded tags:"
          />

          <EditableTextField
            text={test.sections.join(",")}
            onSubmit={this.onListChange(TestFieldNames.sections)}
            label="Sections:"
          />

          <EditableTextField
            text={test.excludedSections.join(",")}
            onSubmit={this.onListChange(TestFieldNames.excludedSections)}
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
                MenuProps={MenuProps}
              >
                {Object.values(Region).map(region => (
                  <MenuItem key={region} value={region}>
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
                onChange={(event) => {
                  if (this.props.test) {
                    const updatedTest = {
                      ...this.props.test,
                      alwaysAsk: event.target.checked
                    };
                    this.props.onChange(updatedTest)
                  }
                }}
              />
            }
            label="Always ask"
          />


          <FormControlLabel
            control={
              <Switch
                checked={test.isLiveBlog}
                onChange={(event) => {
                  if (this.props.test) {
                    const updatedTest = {
                      ...this.props.test,
                      isLiveBlog: event.target.checked
                    };
                    this.props.onChange(updatedTest)
                  }
                }}
              />
            }
            label="Is live blog"
          />

        </div>
        <h3>Variants</h3>
        <List>
          <ListItem className={`${classes.variant} ${classes.variantListHeading}`}>
            <span className={classes.variantName}>Name</span>
            <span className={classes.variantHeading}>Heading</span>
          </ListItem>
          {test.variants.map(this.renderVariant)}
        </List>

        <div className={classes.container}>
          <EpicTestVariantsList
            variantNames={test.variants.map(variant => variant.name)}
            variantHeadings={test.variants.map(variant => variant.heading ? variant.heading : "")}
            onVariantSelected={this.onVariantSelected}
            selectedVariantName={this.state.selectedVariantName}
          />
          <EpicTestVariantEditor
            variant={this.state.selectedVariantName ? test.variants.find(variant => variant.name === this.state.selectedVariantName) : undefined}
            // onChange={this.onVariantChange}
           />
        </div>
      </div>
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
