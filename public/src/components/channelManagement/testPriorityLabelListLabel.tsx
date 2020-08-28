import React from 'react';
import { Typography, createStyles, withStyles, WithStyles, Theme } from '@material-ui/core';

const styles = ({ palette }: Theme) =>
  createStyles({
    container: {
      display: 'flex',
      height: '50px',
      padding: '4px 0',
    },
    text: {
      fontSize: '12px',
      color: palette.grey[700],
    },
    dashedLinesContainer: {
      display: 'flex',
      marginLeft: '4px',
      '& > * + *': {
        marginLeft: '2px',
      },
    },
    dashedLine: {
      height: '100%',
      borderLeft: '1px dashed #9E9E9E',
    },
  });

interface TestPriorityLabelListLabelProps extends WithStyles<typeof styles> {
  priority: number;
}

const TestPriorityLabelListLabel: React.FC<TestPriorityLabelListLabelProps> = ({
  classes,
  priority,
}: TestPriorityLabelListLabelProps) => {
  return (
    <div className={classes.container}>
      <Typography className={classes.text} noWrap={true}>
        {priority + 1}
      </Typography>
      <div className={classes.dashedLinesContainer}>
        <div className={classes.dashedLine} />
        <div className={classes.dashedLine} />
      </div>
    </div>
  );
};

export default withStyles(styles)(TestPriorityLabelListLabel);
