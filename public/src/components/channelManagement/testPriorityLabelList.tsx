import React from 'react';
import { List } from '@mui/material';
import { makeStyles } from '@mui/styles';

import TestPriorityLabelListLabel from './testPriorityLabelListLabel';

const useStyles = makeStyles(() => ({
  list: {
    marginTop: 0,
    padding: 0,
    '& > * + *': {
      marginTop: '8px',
    },
  },
}));

interface TestPriorityLabelListProps {
  numTests: number;
}

const MAX_PRIORITY_TO_DISPLAY_LABEL_FOR = 5;

const TestPriorityLabelList: React.FC<TestPriorityLabelListProps> = ({
  numTests,
}: TestPriorityLabelListProps) => {
  const classes = useStyles();
  const maxPriorityLabel = Math.min(numTests, MAX_PRIORITY_TO_DISPLAY_LABEL_FOR);

  return (
    <List className={classes.list}>
      {[...Array(maxPriorityLabel).keys()].map(priority => (
        <TestPriorityLabelListLabel key={priority} priority={priority} />
      ))}
    </List>
  );
};

export default TestPriorityLabelList;
