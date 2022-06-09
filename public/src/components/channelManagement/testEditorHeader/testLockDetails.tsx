import React from 'react';
import {makeStyles, Theme, Typography} from '@material-ui/core';

const useStyles = makeStyles(({ palette, spacing }: Theme) => ({
  lockDetailsText: {
    alignSelf: 'flex-end',
  }
}));

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

  return `${monthName} ${paddedDay} at ${paddedhours}:${paddedMinutes}`;
};

interface TestLockDetailsProps {
  email?: string;
  timestamp?: string;
}

export const TestLockDetails: React.FC<TestLockDetailsProps> = ({
  email,
  timestamp,
}: TestLockDetailsProps) => {
  const classes = useStyles();
  if (email && timestamp) {
    const text = `Locked by ${formattedName(email)}, since ${formattedTimestamp(timestamp)}`;

    return (
      <Typography className={classes.lockDetailsText}>{text}</Typography>
    );
  }
  return null;
}
