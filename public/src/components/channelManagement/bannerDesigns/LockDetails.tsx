import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';
import { formattedTimestamp } from '../helpers/utilities';

const LockDetailsText = styled(Typography)({
  alignSelf: 'flex-end',
});

interface Props {
  email?: string;
  timestamp?: string;
}
export const LockDetails: React.FC<Props> = ({ email, timestamp }: Props) => {
  if (email && timestamp) {
    const text = `Locked by ${email}, since ${formattedTimestamp(timestamp)}`;

    return <LockDetailsText>{text}</LockDetailsText>;
  }
  return null;
};
