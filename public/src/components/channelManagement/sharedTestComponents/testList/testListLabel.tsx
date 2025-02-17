import React from 'react';
import { Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(() => ({
  text: {
    maxWidth: '190px',
    fontSize: '12px',
    fontWeight: 500,
    lineHeight: '24px',
    textTransform: 'uppercase',
  },
  textInverted: {
    color: '#FFFFFF',
  },
}));

interface TestListLabelProps {
  name: string;
  nickname?: string;
  shouldInverColor: boolean;
}

const TEST_NAME_CHARACTERS_TO_STRIP_REGEX = /^\d{4}-\d{2}-\d{2}_(contribs*_|moment_)*/;

const TestListLabel: React.FC<TestListLabelProps> = ({
  name,
  nickname,
  shouldInverColor,
}: TestListLabelProps) => {
  const classes = useStyles();

  const textClasses = [classes.text];
  if (shouldInverColor) {
    textClasses.push(classes.textInverted);
  }

  return (
    <Typography className={textClasses.join(' ')} noWrap={true}>
      {nickname ? nickname : name.replace(TEST_NAME_CHARACTERS_TO_STRIP_REGEX, '')}
    </Typography>
  );
};

export default TestListLabel;
