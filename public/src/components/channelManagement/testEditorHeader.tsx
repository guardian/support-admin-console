import React from 'react';
import { createStyles, withStyles, WithStyles, Theme, Typography } from '@material-ui/core';

const styles = ({ palette }: Theme) =>
  createStyles({
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
  });

interface TestEditorHeaderProps extends WithStyles<typeof styles> {
  name: string;
  nickname?: string;
}

const TestEditorHeader: React.FC<TestEditorHeaderProps> = ({
  classes,
  name,
  nickname,
}: TestEditorHeaderProps) => {
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

export default withStyles(styles)(TestEditorHeader);
