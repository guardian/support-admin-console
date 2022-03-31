import React from 'react';
import { makeStyles, Typography } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  text: {
    fontSize: '14px',
    fontWeight: 900,
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
}));

interface StickyBottomBarStatusProps {
  isInEditMode: boolean;
  isLocked: boolean;
}

const LOCKED_TEXT = 'Locked for editing';
const READ_ONLY_MODE_TEXT = 'Read only mode';
const EDIT_MODE_TEXT = 'Editing';

const StickyBottomBarStatus: React.FC<StickyBottomBarStatusProps> = ({
  isInEditMode,
  isLocked,
}: StickyBottomBarStatusProps) => {
  const classes = useStyles();

  let text = '';
  if (isInEditMode) {
    text = EDIT_MODE_TEXT;
  } else if (isLocked) {
    text = LOCKED_TEXT;
  } else {
    text = READ_ONLY_MODE_TEXT;
  }

  return (
    <div>
      <Typography className={classes.text}>{text}</Typography>
    </div>
  );
};

export default StickyBottomBarStatus;
