import React from 'react';

import {
  List, ListItem, Theme, createStyles, WithStyles, withStyles
} from "@material-ui/core";


const styles = ({ palette, spacing, mixins }: Theme) => createStyles({
  testsList: {
    width: "20%",
    borderRight: `2px solid ${palette.grey['300']}`,
    borderTop: `2px solid ${palette.grey['300']}`,
    padding: 0
  },
  test: {
    borderBottom: `1px solid ${palette.grey['300']}`,
  },
  selectedTest: {
    backgroundColor: palette.grey['400'],
    fontWeight: 'bold'
  }
});

interface Props extends WithStyles<typeof styles> {
  testNames: string[],
  onTestSelected: (testName: string) => void,
  selectedTestName?: string
}

class EpicTestsList extends React.Component<Props, any> {

  constructor(props: Props) {
    super(props);
  }

  onClick = (event: React.MouseEvent<HTMLInputElement>): void => {
    this.props.onTestSelected(event.currentTarget.innerText)
  };

  render(): React.ReactNode {
    const { classes } = this.props;


    return (
      <List className={classes.testsList} component="nav">
        {this.props.testNames.map(testName => {
          const classNames = this.props.selectedTestName === testName ?
            `${classes.test} ${classes.selectedTest}`
            : classes.test;

          return (
            <ListItem
              className={classNames}
              button
              onClick={this.onClick}
            >
              {testName}
            </ListItem>
          )
        })}
      </List>
    )
  }
}

export default withStyles(styles)(EpicTestsList);
