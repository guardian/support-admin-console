import React from 'react';
import { Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(() => ({
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
}));

const TestListTestArticleCountLabel = (): JSX.Element => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <Typography className={classes.text} noWrap={true}>
        AC
      </Typography>
    </div>
  );
};

export default TestListTestArticleCountLabel;
