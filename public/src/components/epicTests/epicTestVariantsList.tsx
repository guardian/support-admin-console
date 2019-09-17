import React from 'react';
import {
  Theme, createStyles, WithStyles, withStyles, Typography, ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails
} from "@material-ui/core";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import EpicTestVariantEditor from './epicTestVariantEditor';
import { EpicVariant } from './epicTestsForm';
import NewNameCreator from './newNameCreator';
import {defaultCta} from "./ctaEditor";
import {onFieldValidationChange, ValidationStatus} from '../helpers/validation';


const styles = ({ typography }: Theme) => createStyles({
  h4: {
    fontSize: typography.pxToRem(20),
    fontWeight: typography.fontWeightMedium,
  },
  error: {
    border: "2px solid red"
  },
});

interface EpicTestVariantsListProps extends WithStyles<typeof styles> {
  variants: EpicVariant[],
  onVariantsListChange: (variantList: EpicVariant[]) => void,
  testName: string,
  editMode: boolean,
  onValidationChange: (isValid: boolean) => void
}

type EpicTestVariantsListState = {
  expandedVariantKey?: string,
  validationStatus: ValidationStatus
}
class EpicTestVariantsList extends React.Component<EpicTestVariantsListProps, EpicTestVariantsListState> {

  state: EpicTestVariantsListState = {
    expandedVariantKey: undefined,
    validationStatus: {}
  };

  onVariantSelected = (key: string): void => {
    this.setState({
      expandedVariantKey: key
    })
  };

  onVariantChange = (updatedVariant: EpicVariant): void => {
    const updatedVariantList: EpicVariant[] = this.props.variants.map(variant => variant.name === updatedVariant.name ? updatedVariant : variant);
    this.props.onVariantsListChange(updatedVariantList);
  };

  onVariantDelete = (variantName: string): void => {
    const updatedVariantList = this.props.variants.filter(variant => variant.name !== variantName);
    this.props.onVariantsListChange(updatedVariantList);
  }

  onVariantNameCreation = (name: string) => {
    this.createVariant(name);
  };

  onExpansionPanelChange = (key: string) => (event: React.ChangeEvent<{}>) => {
    this.state.expandedVariantKey === key ? this.setState({
      expandedVariantKey: undefined
    })
    :
    this.setState({
      expandedVariantKey: key
    })
  };

  createVariantKey = (variantName: string): string => {
    return `${this.props.testName}${variantName}`
  };

  createVariant = (newVariantName: string) => {
    const newVariant: EpicVariant = {
      name: newVariantName,
      heading: "",
      paragraphs: [],
      highlightedText: "",
      footer: "",
      showTicker: false,
      backgroundImageUrl: "",
      cta: defaultCta
    };

    this.props.onVariantsListChange([...this.props.variants, newVariant]);

    const key = this.createVariantKey(newVariant.name);

    this.onVariantSelected(key);
  };

  renderNoVariantMessage = (): React.ReactNode => (
      <Typography variant={'subtitle1'} color={'textPrimary'}>Create the first variant for this test (each test must have at least one variant)<sup>*</sup></Typography>
  );

  renderNewVariantButton = (): React.ReactNode => {
    return this.props.editMode ? (
      <NewNameCreator
        text="variant"
        existingNames={this.props.variants.map(variant => variant.name)}
        onValidName={this.createVariant}
        editEnabled={this.props.editMode}
      />
    ) : null;
  }

  renderVariantsList = (): React.ReactNode => {
    const { classes } = this.props;

    return (
      <>
        {this.props.variants.map(variant => {
          const key = this.createVariantKey(variant.name);

          return (
            <ExpansionPanel
              key={key}
              expanded={this.state.expandedVariantKey === key}
              onChange={this.onExpansionPanelChange(key)}
              className={
                this.state.validationStatus[variant.name] === false ? classes.error : ''
              }
            >
              <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="variant-control"
                id="variant-header"
              >
                <Typography variant={'h4'} className={classes.h4}>{variant.name}</Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <EpicTestVariantEditor
                  variant={variant}
                  onVariantChange={this.onVariantChange}
                  editMode={this.props.editMode}
                  onDelete={this.onVariantDelete}
                  onValidationChange={onFieldValidationChange(this)(variant.name)}
                />
              </ExpansionPanelDetails>
            </ExpansionPanel>
          );
        })}
      </>
    );
  };

  render(): React.ReactNode {
   return(
    <>
      {this.props.variants.length < 1 && this.renderNoVariantMessage()}

      {this.renderNewVariantButton()}

      {this.props.variants.length > 0 && this.renderVariantsList()}
    </>
   )
  };
}

export default withStyles(styles)(EpicTestVariantsList);
