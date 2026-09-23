import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';
import { formattedTimestamp } from '../helpers/utilities';

const LockDetailsText = styled(Typography)({
  alignSelf: 'flex-end',
});

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
  if (email && timestamp) {
    const text = `Locked by ${formattedName(email)}, since ${formattedTimestamp(timestamp)}`;

    return <LockDetailsText>{text}</LockDetailsText>;
  }
  return null;
};
