import React from 'react';
import { makeStyles, Typography } from '@material-ui/core';
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

    return <Typography className={classes.lockDetailsText}>{text}</Typography>;
  }
  return null;
};
