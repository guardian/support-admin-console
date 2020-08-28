import React from 'react';
import { createStyles, List, Theme, withStyles, WithStyles } from '@material-ui/core';

import TestPriorityLabelListLabel from './testPriorityLabelListLabel';

const styles = ({}: Theme) =>
  createStyles({
    list: {
      marginTop: 0,
      padding: 0,
      '& > * + *': {
        marginTop: '8px',
      },
    },
  });

interface TestPriorityLabelListProps extends WithStyles<typeof styles> {
  numTests: number;
}

const MAX_PRIORITY_TO_DISPLAY_LABEL_FOR = 5;

const TestPriorityLabelList: React.FC<TestPriorityLabelListProps> = ({
  classes,
  numTests,
}: TestPriorityLabelListProps) => {
  const maxPriorityLabel = Math.min(numTests, MAX_PRIORITY_TO_DISPLAY_LABEL_FOR);

  return (
    <List className={classes.list}>
      {[...Array(maxPriorityLabel).keys()].map(priority => (
        <TestPriorityLabelListLabel key={priority} priority={priority} />
      ))}
    </List>
  );
};

export default withStyles(styles)(TestPriorityLabelList);
