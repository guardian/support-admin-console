import React from 'react';
import { Typography, Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { red } from '@mui/material/colors';

const useStyles = makeStyles(({ palette }: Theme) => ({
  container: {
    display: 'flex',
    justifyContent: 'center',
    width: '35px',
    padding: '2px',
    borderRadius: '2px',
    backgroundColor: '#F2453D',
  },
  live: {
    color: '#FFFFFF',
    backgroundColor: `${red[500]}`,
  },
  liveInverted: {
    color: `${red[500]}`,
    backgroundColor: '#FFFFFF',
  },
  draft: {
    color: '#FFFFFF',
    backgroundColor: `${palette.grey[700]}`,
  },
  draftInverted: {
    color: `${palette.grey[700]}`,
    backgroundColor: '#FFFFFF',
  },
  text: {
    fontSize: '9px',
    fontWeight: 500,
    textTransform: 'uppercase',
  },
}));

interface TestListTestLiveLabelProps {
  isLive: boolean;
  shouldInvertColor: boolean;
}

const TestListTestLiveLabel: React.FC<TestListTestLiveLabelProps> = ({
  isLive,
  shouldInvertColor,
}: TestListTestLiveLabelProps) => {
  const classes = useStyles();
  const containerClasses = [classes.container];
  if (isLive) {
    containerClasses.push(shouldInvertColor ? classes.liveInverted : classes.live);
  } else {
    containerClasses.push(shouldInvertColor ? classes.draftInverted : classes.draft);
  }

  return (
    <div className={containerClasses.join(' ')}>
      <Typography className={classes.text}>{isLive ? 'Live' : 'Draft'}</Typography>
    </div>
  );
};

export default TestListTestLiveLabel;
