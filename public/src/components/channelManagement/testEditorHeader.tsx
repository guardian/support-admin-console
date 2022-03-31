import React from 'react';
import { Theme, Typography, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(({ palette }: Theme) => ({
  container: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  mainHeader: {
    fontSize: '32px',
    fontWeight: 'normal',
  },
  secondaryHeader: {
    fontSize: '14px',
    color: palette.grey[700],
  },
}));

interface TestEditorHeaderProps {
  name: string;
  nickname?: string;
}

const TestEditorHeader: React.FC<TestEditorHeaderProps> = ({
  name,
  nickname,
}: TestEditorHeaderProps) => {
  const classes = useStyles();
  const mainHeader = nickname ? nickname : name;
  const secondaryHeader = nickname ? name : null;

  return (
    <header className={classes.container}>
      <Typography variant="h2" className={classes.mainHeader}>
        {mainHeader}
      </Typography>
      <Typography className={classes.secondaryHeader}>{secondaryHeader}</Typography>
    </header>
  );
};

export default TestEditorHeader;
