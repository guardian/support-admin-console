import React from 'react';
import {
  Theme, createStyles, WithStyles, withStyles, Typography, ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails
} from "@material-ui/core";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {onFieldValidationChange, ValidationStatus} from '../helpers/validation';
import {BannerVariant} from "./bannerTestsForm";
import BannerTestVariantEditor from "./bannerTestVariantEditor";
import NewNameCreator from "../newNameCreator";
import {defaultCta} from "../helpers/shared";


const styles = ({ typography, spacing }: Theme) => createStyles({
  h4: {
    fontSize: typography.pxToRem(20),
    fontWeight: typography.fontWeightMedium,
  },
  error: {
    border: "2px solid red"
  },
  heading: {
    fontSize: typography.pxToRem(14),
    fontWeight: 'normal',
    fontStyle: 'italic'
  },
  newVariantButton: {
    marginTop: spacing(2)
  }
});

interface BannerTestVariantsListProps extends WithStyles<typeof styles> {
  variants: BannerVariant[],
  onVariantsListChange: (variantList: BannerVariant[]) => void,
  testName: string,
  editMode: boolean,
  onValidationChange: (isValid: boolean) => void
}

type BannerTestVariantsListState = {
  expandedVariantKey?: string,
  validationStatus: ValidationStatus
}
class BannerTestVariantsList extends React.Component<BannerTestVariantsListProps, BannerTestVariantsListState> {

  state: BannerTestVariantsListState = {
    expandedVariantKey: undefined,
    validationStatus: {}
  };

  onVariantSelected = (key: string): void => {
    this.setState({
      expandedVariantKey: key
    })
  };

  onVariantChange = (updatedVariant: BannerVariant): void => {
    const updatedVariantList: BannerVariant[] = this.props.variants.map(variant => variant.name === updatedVariant.name ? updatedVariant : variant);
    this.props.onVariantsListChange(updatedVariantList);
  };

  onVariantDelete = (variantName: string): void => {
    const updatedVariantList = this.props.variants.filter(variant => variant.name !== variantName);
    this.props.onVariantsListChange(updatedVariantList);
  }

  onVariantNameCreation = (name: string) => {
    this.createVariant(name, "");
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

  createVariant = (newVariantName: string, nickname: string) => {
    const newVariant: BannerVariant = {
      name: newVariantName,
      heading: undefined,
      body: '',
      highlightedText: "Support the Guardian from as little as %%CURRENCY_SYMBOL%%1 – and it only takes a minute. Thank you.",
      cta: defaultCta
    };

    this.props.onVariantsListChange([...this.props.variants, newVariant]);

    const key = this.createVariantKey(newVariant.name);

    this.onVariantSelected(key);
  };

  renderNoVariantMessage = (): React.ReactNode => {
    return this.props.editMode ? <Typography variant={'subtitle1'} color={'textPrimary'}>Create the first variant for this test (each test must have at least one variant)<sup>*</sup></Typography> : <Typography>No variants yet.</Typography>
  };

  renderNewVariantButton = (): React.ReactNode => {
    const {classes} = this.props;
    return this.props.editMode ? (
      <div className={classes.newVariantButton}>
      <NewNameCreator
        type="variant"
        action="New"
        existingNames={this.props.variants.map(variant => variant.name)}
        existingNicknames={[]}
        onValidName={this.createVariant}
        editEnabled={this.props.editMode}
      />
      </div>
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
                <Typography variant={'h4'} className={classes.h4}>
                  {variant.name} {variant.heading && <span className={classes.heading}>- "{variant.heading}"</span>}
                </Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <BannerTestVariantEditor
                  variant={variant}
                  onVariantChange={this.onVariantChange}
                  editMode={this.props.editMode}
                  onDelete={() => {
                    this.onVariantDelete(variant.name);
                    onFieldValidationChange(this)(variant.name)(true)
                  }}
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
      {this.props.variants.length > 0 && this.renderVariantsList()}

      {this.props.variants.length < 1 && this.renderNoVariantMessage()}

      {this.renderNewVariantButton()}
    </>
   )
  };
}

export default withStyles(styles)(BannerTestVariantsList);