import React from 'react';
import {
  List, ListItem, Theme, createStyles, WithStyles, withStyles, Typography, ExpansionPanel, ExpansionPanelActions, ExpansionPanelSummary, ExpansionPanelDetails
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
    fontSize: typography.pxToRem(15),
    fontWeight: typography.fontWeightRegular,
  }
});

interface VariantListProps extends WithStyles<typeof styles> {
  variantNames: string[],
  variantHeadings?: string[],
  onVariantSelected: (variantName: string) => void,
  selectedVariantName?: string,
  variants: EpicVariant[]
}


class EpicTestVariantsList extends React.Component<VariantListProps, any> {

  

  onClick = (event: React.MouseEvent<HTMLInputElement>): void => {
    this.props.onVariantSelected(event.currentTarget.innerText)
  };

  render(): React.ReactNode {
    const { classes } = this.props;

    // return (
      // <List className={classes.variantsList} component="nav">
      //   {this.props.variantNames.map(variantName => {
      //     const classNames = this.props.selectedVariantName === variantName ?
      //       `${classes.variant} ${classes.selectedVariant}`
      //       : classes.variant;

      //     return (
      //       <ListItem
      //         className={classNames}
      //         button
      //         onClick={this.onClick}
      //         key={variantName}
      //       >
      //         <Typography>{variantName}</Typography>
      //       </ListItem>
      //     )
      //   })}
      // </List>
    // )

    return (
      <>

  {this.props.variants.map(variant => {


  return (
    <ExpansionPanel>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography className={classes.heading}>{variant.name}</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <EpicTestVariantEditor 
            variant={variant}
            onVariantChange={() => {null}}
          />
        </ExpansionPanelDetails>
      </ExpansionPanel>
  )
})}


      // sample panel

      <div>
      <ExpansionPanel>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography className={classes.heading}>Expansion Panel 1</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Typography>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
            sit amet blandit leo lobortis eget.
          </Typography>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </div>


<List className={classes.variantsList} component="nav">
{this.props.variantNames.map(variantName => {
  const classNames = this.props.selectedVariantName === variantName ?
    `${classes.variant} ${classes.selectedVariant}`
    : classes.variant;

  return (
    <ListItem
      className={classNames}
      button
      onClick={this.onClick}
      key={variantName}
    >
      <Typography>{variantName}</Typography>
    </ListItem>
  )
})}
</List>
</>

    )
  }
}

export default withStyles(styles)(EpicTestVariantsList);
