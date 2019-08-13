import React from 'react';

import {
  List, ListItem, Theme, createStyles, WithStyles, withStyles, Typography
} from "@material-ui/core";

const styles = ({ palette }: Theme) => createStyles({
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
  }
});

interface VariantListProps extends WithStyles<typeof styles> {
  variantNames: string[],
  variantHeadings?: string[],
  onVariantSelected: (variantName: string) => void,
  selectedVariantName?: string
}

class EpicTestVariantsList extends React.Component<VariantListProps, any> {

  onClick = (event: React.MouseEvent<HTMLInputElement>): void => {
    this.props.onVariantSelected(event.currentTarget.innerText)
  };

  render(): React.ReactNode {
    const { classes } = this.props;


    return (
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
    )
  }
}

export default withStyles(styles)(EpicTestVariantsList);
