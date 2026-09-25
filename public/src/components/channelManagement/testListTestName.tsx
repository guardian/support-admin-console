import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';

const Text = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'shouldInvertColor',
})<{ shouldInvertColor: boolean }>(({ shouldInvertColor }) => ({
  maxWidth: '190px',
  fontSize: '12px',
  fontWeight: 500,
  lineHeight: '24px',
  textTransform: 'uppercase',
  color: shouldInvertColor ? '#FFFFFF' : undefined,
}));

interface TestListTestNameProps {
  name: string;
  nickname?: string;
  shouldInverColor: boolean;
}

const TEST_NAME_CHARACTERS_TO_STRIP_REGEX = /^\d{4}-\d{2}-\d{2}_(contribs*_|moment_)*/;

const TestListTestName: React.FC<TestListTestNameProps> = ({
  name,
  nickname,
  shouldInverColor,
}: TestListTestNameProps) => {
  return (
    <Text shouldInvertColor={shouldInverColor} noWrap={true}>
      {nickname ?? name.replace(TEST_NAME_CHARACTERS_TO_STRIP_REGEX, '')}
    </Text>
  );
};

export default TestListTestName;
