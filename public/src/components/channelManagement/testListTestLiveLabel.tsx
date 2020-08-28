import React from 'react';
import { Typography, createStyles, withStyles, WithStyles, Theme } from '@material-ui/core';
import { red } from '@material-ui/core/colors';

const styles = ({ palette }: Theme) =>
  createStyles({
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
  });

interface TestListTestLiveLabelProps extends WithStyles<typeof styles> {
  isLive: boolean;
  shouldInvertColor: boolean;
}

const TestListTestLiveLabel: React.FC<TestListTestLiveLabelProps> = ({
  isLive,
  shouldInvertColor,
  classes,
}: TestListTestLiveLabelProps) => {
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

export default withStyles(styles)(TestListTestLiveLabel);
