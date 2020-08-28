import React from 'react';
import { Typography, createStyles, withStyles, WithStyles } from '@material-ui/core';

const styles = createStyles({
  container: {
    padding: '3px',
    background: '#FFC107',
    borderRadius: '2px',
  },
  text: {
    fontSize: '8px',
    fontWeight: 500,
    textTransform: 'uppercase',
  },
});

type TestListTestArticleCountLabel = WithStyles<typeof styles>;

const TestListTestArticleCountLabel: React.FC<TestListTestArticleCountLabel> = ({
  classes,
}: TestListTestArticleCountLabel) => {
  return (
    <div className={classes.container}>
      <Typography className={classes.text} noWrap={true}>
        AC
      </Typography>
    </div>
  );
};

export default withStyles(styles)(TestListTestArticleCountLabel);
