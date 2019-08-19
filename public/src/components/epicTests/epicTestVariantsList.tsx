import React from 'react';
import {
  Theme, createStyles, WithStyles, withStyles, Typography, ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails
} from "@material-ui/core";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import EditableTextField from "../helpers/editableTextField"
import EpicTestVariantEditor from './epicTestVariantEditor';
import { EpicVariant } from './epicTestsForm';
import NewNameCreator from './newNameCreator';


const styles = ({ typography }: Theme) => createStyles({
  h4: {
    fontSize: typography.pxToRem(20),
    fontWeight: typography.fontWeightMedium,
  }
});

interface EpicTestVariantsListProps extends WithStyles<typeof styles> {
  variants: EpicVariant[],
  onVariantsListChange: (variantList: EpicVariant[]) => void,
}

type EpicTestVariantsListState = {
  expandedVariantName?: string
}

class EpicTestVariantsList extends React.Component<EpicTestVariantsListProps, EpicTestVariantsListState> {

  state: EpicTestVariantsListState = { expandedVariantName: undefined}

  onVariantSelected = (variantName: string): void => {
    this.setState({
      expandedVariantName: variantName
    })
  };

  onVariantChange = (updatedVariant: EpicVariant): void => {
    const updatedVariantList: EpicVariant[] = this.props.variants.map(variant => variant.name === updatedVariant.name ? updatedVariant : variant);
    this.props.onVariantsListChange(updatedVariantList);
  }

  onVariantNameCreation = (name: string) => {
    this.createVariant(name);
  }

  onExpansionPanelChange = (variantName: string) => (event: React.ChangeEvent<{}>) => {
    this.state.expandedVariantName === variantName ? this.setState({
      expandedVariantName: undefined
    })
    :
    this.setState({
      expandedVariantName: variantName
    })
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

      this.props.onVariantsListChange([...this.props.variants, newVariant]);

      this.onVariantSelected(newVariant.name);
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

  renderVariants = (): React.ReactNode => {
    const { classes } = this.props;

    return (
      <>
        <NewNameCreator text="variant" existingNames={this.props.variants.map(variant => variant.name)} onValidName={this.createVariant} />
        {this.props.variants.map(variant => {
          console.log('renderVariants()',this.state.expandedVariantName === variant.name, this.state.expandedVariantName, variant.name);
          return (
            <ExpansionPanel
              key={variant.name}
              expanded={this.state.expandedVariantName === variant.name}
              onChange={this.onExpansionPanelChange(variant.name)}
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
                />
              </ExpansionPanelDetails>
            </ExpansionPanel>
          );
        })}
      </>
    );
  }

  onClick = (event: React.MouseEvent<HTMLInputElement>): void => {
    this.onVariantSelected(event.currentTarget.innerText)
  };

  render(): React.ReactNode {

    return (
      <>
        {this.props.variants.length > 0 ? this.renderVariants() : this.renderNoVariants() }
      </>
    )
  }
}

export default withStyles(styles)(EpicTestVariantsList);
