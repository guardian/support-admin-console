import React from 'react';
import { formattedTimestamp } from '../helpers/utilities';
import { Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(() => ({
  lockDetailsText: {
    alignSelf: 'flex-end',
  },
}));

interface Props {
  email?: string;
  timestamp?: string;
}
export const LockDetails: React.FC<Props> = ({ email, timestamp }: Props) => {
  const classes = useStyles();
  if (email && timestamp) {
    const text = `Locked by ${email}, since ${formattedTimestamp(timestamp)}`;

    return <Typography className={classes.lockDetailsText}>{text}</Typography>;
  }
  return null;
};
