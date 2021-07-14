import React from 'react';
import { createStyles, withStyles, WithStyles, Theme, Typography } from '@material-ui/core';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
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
  views?: number;
}

const TestEditorHeader: React.FC<TestEditorHeaderProps> = ({
  classes,
  name,
  nickname,
  views,
}: TestEditorHeaderProps) => {
  const mainHeader = nickname ? nickname : name;
  const secondaryHeader = nickname ? name : null;

  return (
    <header className={classes.container}>
      <Typography variant="h2" className={classes.mainHeader}>
        {mainHeader}
      </Typography>

      {views && (
        <div>
          <Typography>{views} views/min</Typography>
        </div>
      )}

      <Typography className={classes.secondaryHeader}>{secondaryHeader}</Typography>
    </header>
  );
};

export default withStyles(styles)(TestEditorHeader);
