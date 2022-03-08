import React from 'react';
import { createStyles, Typography, WithStyles, withStyles } from '@material-ui/core';
import { LockStatus } from './helpers/shared';

const styles = createStyles({
  text: {
    fontSize: '14px',
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
});

interface StickyBottomBarDetailProps extends WithStyles<typeof styles> {
  isInEditMode: boolean;
  editedTestName: string | null;
  lockStatus: LockStatus;
}

const formattedName = (email: string): string => {
  const nameArr: RegExpMatchArray | null = email.match(/^([a-z]*)\.([a-z]*).*@.*/);
  return nameArr
    ? `${nameArr[1][0].toUpperCase()}${nameArr[1].slice(
        1,
      )} ${nameArr[2][0].toUpperCase()}${nameArr[2].slice(1)}`
    : email;
};

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const formattedTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp);

  const hours = date.getHours();
  const paddedhours = String(hours).padStart(2, '0');
  const minutes = date.getMinutes();
  const paddedMinutes = String(minutes).padStart(2, '0');
  const day = date.getDate();
  const paddedDay = String(day).padStart(2, '0');
  const monthName = MONTH_NAMES[date.getMonth()];

  return `${monthName} ${paddedDay} - ${paddedhours}:${paddedMinutes}`;
};

const StickyBottomBarDetail: React.FC<StickyBottomBarDetailProps> = ({
  classes,
  isInEditMode,
  editedTestName,
  lockStatus,
}: StickyBottomBarDetailProps) => {
  let text = editedTestName == null ? '' : `- ${editedTestName}`;

  if (!isInEditMode && lockStatus.locked && lockStatus.email && lockStatus.timestamp) {
    const name = formattedName(lockStatus.email);
    const timestamp = formattedTimestamp(lockStatus.timestamp);

    text = `- By ${name}, last live ${timestamp}`;
  }

  return (
    <div>
      <Typography className={classes.text}>{text}</Typography>
    </div>
  );
};

export default withStyles(styles)(StickyBottomBarDetail);
