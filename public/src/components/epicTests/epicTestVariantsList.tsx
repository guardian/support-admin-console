import React from 'react';
import {
  Theme, createStyles, WithStyles, withStyles, Typography, ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails
} from "@material-ui/core";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import EpicTestVariantEditor from './epicTestVariantEditor';
import { EpicVariant } from './epicTestsForm';


const styles = ({ palette, typography }: Theme) => createStyles({
  variantsList: {
    width: "20%",
    borderRight: `2px solid ${palette.grey['300']}`,
    borderTop: `2px solid ${palette.grey['300']}`,
    padding: 0
  },
  variant: {
    borderBottom: `1px solid ${palette.grey['300']}`,
  },
  selectedVariant: {
    backgroundColor: palette.grey['400'],
    fontWeight: 'bold'
  },
  root: {
    width: '100%',
  },
  heading: {
    fontSize: typography.pxToRem(16),
    fontWeight: typography.fontWeightMedium,
  }
});

interface EpicTestVariantListProps extends WithStyles<typeof styles> {
  variantNames: string[], // TODO: remove?
  variantHeadings?: string[], // TODO: remove?
  onVariantSelected: (variantName: string) => void,
  selectedVariantName?: string,
  variants: EpicVariant[],
  onVariantChange: (variant: EpicVariant) => void
}


class EpicTestVariantsList extends React.Component<EpicTestVariantListProps, any> {

  onClick = (event: React.MouseEvent<HTMLInputElement>): void => {
    this.props.onVariantSelected(event.currentTarget.innerText)
  };

  render(): React.ReactNode {
    const { classes } = this.props;


    return (
      <>
        {this.props.variants.map(variant => {
          return (
            <ExpansionPanel>
              <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="variant-control"
                id="variant-header"
                key={variant.name}
              >
                <Typography className={classes.heading}>{variant.name}</Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <EpicTestVariantEditor
                  variant={variant}
                  onVariantChange={this.props.onVariantChange}
                />
              </ExpansionPanelDetails>
            </ExpansionPanel>
          )
        })}
      </>
    )
  }
}

export default withStyles(styles)(EpicTestVariantsList);
