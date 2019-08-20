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
  testName: string
}

type EpicTestVariantsListState = {
  expandedVariantKey?: string
}
class EpicTestVariantsList extends React.Component<EpicTestVariantsListProps, EpicTestVariantsListState> {

  state: EpicTestVariantsListState = { expandedVariantKey: undefined}

  onVariantSelected = (key: string): void => {
    this.setState({
      expandedVariantKey: key
    })
  };

  onVariantChange = (updatedVariant: EpicVariant): void => {
    const updatedVariantList: EpicVariant[] = this.props.variants.map(variant => variant.name === updatedVariant.name ? updatedVariant : variant);
    this.props.onVariantsListChange(updatedVariantList);
  }

  onVariantNameCreation = (name: string) => {
    this.createVariant(name);
  }

  onExpansionPanelChange = (key: string) => (event: React.ChangeEvent<{}>) => {
    this.state.expandedVariantKey === key ? this.setState({
      expandedVariantKey: undefined
    })
    :
    this.setState({
      expandedVariantKey: key
    })
  }

  createVariantKey = (variantName: string): string => {
    return `${this.props.testName}${variantName}`
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

      const key = this.createVariantKey(newVariant.name);

      this.onVariantSelected(key);
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
          const key = this.createVariantKey(variant.name);
          return (
            <ExpansionPanel
              key={key}
              expanded={this.state.expandedVariantKey === key}
              onChange={this.onExpansionPanelChange(key)}
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
