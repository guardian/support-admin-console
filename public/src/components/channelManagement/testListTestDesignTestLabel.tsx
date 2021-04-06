import React from 'react';
import { Typography, createStyles, withStyles, WithStyles } from '@material-ui/core';

const styles = createStyles({
  container: {
    padding: '3px',
    background: '#2196f3',
    borderRadius: '2px',
  },
  text: {
    fontSize: '8px',
    fontWeight: 500,
    textTransform: 'uppercase',
    color: 'white',
  },
});

type TestListTestDesignTestLabel = WithStyles<typeof styles>;

const TestListTestDesignTestLabel: React.FC<TestListTestDesignTestLabel> = ({
  classes,
}: TestListTestDesignTestLabel) => {
  return (
    <div className={classes.container}>
      <Typography className={classes.text} noWrap={true}>
        DT
      </Typography>
    </div>
  );
};

export default withStyles(styles)(TestListTestDesignTestLabel);
