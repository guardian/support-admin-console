import React from 'react';
import { createStyles, Typography, WithStyles, withStyles } from '@material-ui/core';

const styles = createStyles({
  text: {
    fontSize: '14px',
    fontWeight: 900,
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
});

interface StickyBottomBarStatusProps extends WithStyles<typeof styles> {
  isInEditMode: boolean;
  isLocked: boolean;
}

const LOCKED_TEXT = 'Locked for editing';
const READ_ONLY_MODE_TEXT = 'Read only mode';
const EDIT_MODE_TEXT = 'Editing';

const StickyBottomBarStatus: React.FC<StickyBottomBarStatusProps> = ({
  classes,
  isInEditMode,
  isLocked,
}: StickyBottomBarStatusProps) => {
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

export default withStyles(styles)(StickyBottomBarStatus);
