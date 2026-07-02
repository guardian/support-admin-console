import ScheduleIcon from '@mui/icons-material/Schedule';
import { Tooltip } from '@mui/material';
import { makeStyles } from '@mui/styles';
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- Required by jsx: "react" in tsconfig.json
import React from 'react';
import { Scheduler } from './helpers/shared';

const useStyles = makeStyles(() => ({
  container: {
    padding: '1px',
    lineHeight: 0,
  },
  iconWhite: {
    color: '#ffffff',
  },
  iconBlack: {
    color: '#000000',
  },
}));

interface TestListSchedulerLabelProps {
  scheduler: Scheduler;
  shouldInvertColor: boolean;
}

const TestListSchedulerLabel = ({
  scheduler,
  shouldInvertColor,
}: TestListSchedulerLabelProps): JSX.Element => {
  const classes = useStyles();

  const iconClass = shouldInvertColor ? classes.iconWhite : classes.iconBlack;

  const lines: string[] = [];
  if (scheduler.start) {
    lines.push(`Start: ${scheduler.start} UTC`);
  }
  if (scheduler.end) {
    lines.push(`End: ${scheduler.end} UTC`);
  }

  return (
    <Tooltip
      title={
        <>
          {lines.map((line, i) => (
            <div key={i}>{line}</div>
          ))}
        </>
      }
      arrow
    >
      <div className={classes.container}>
        <ScheduleIcon className={iconClass} sx={{ fontSize: 16 }} />
      </div>
    </Tooltip>
  );
};

export default TestListSchedulerLabel;
