import React from 'react';
import { Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { formattedTimestamp } from '../helpers/utilities';

const useStyles = makeStyles(() => ({
  lockDetailsText: {
    alignSelf: 'flex-end',
  },
}));

const formattedName = (email: string): string => {
  const nameArr: RegExpMatchArray | null = email.match(/^([a-z]*)\.([a-z]*).*@.*/);
  return nameArr
    ? `${nameArr[1][0].toUpperCase()}${nameArr[1].slice(
        1,
      )} ${nameArr[2][0].toUpperCase()}${nameArr[2].slice(1)}`
    : email;
};

interface LockTestDetailsProps {
  email?: string;
  timestamp?: string;
}

export const LockTestDetails: React.FC<LockTestDetailsProps> = ({
  email,
  timestamp,
}: LockTestDetailsProps) => {
  const classes = useStyles();
  if (email && timestamp) {
    const text = `Locked by ${formattedName(email)}, since ${formattedTimestamp(timestamp)}`;

    return <Typography className={classes.lockDetailsText}>{text}</Typography>;
  }
  return null;
};
