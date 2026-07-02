import ScheduleIcon from '@mui/icons-material/Schedule';
import { Tooltip } from '@mui/material';
import { makeStyles } from '@mui/styles';
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- Required by jsx: "react" in tsconfig.json
import React from 'react';
import { Scheduler } from './helpers/shared';
import { isWithinSchedule } from './helpers/utilities';

const useStyles = makeStyles(() => ({
  container: {
    padding: '1px',
    lineHeight: 0,
  },
  iconActive: {
    color: '#F2453D',
  },
  iconInactive: {
    color: '#9e9e9e',
  },
  iconWhite: {
    color: '#ffffff',
  },
}));

interface TestListSchedulerLabelProps {
  scheduler: Scheduler;
  isLive: boolean;
  shouldInvertColor: boolean;
}

const TestListSchedulerLabel = ({
  scheduler,
  isLive,
  shouldInvertColor,
}: TestListSchedulerLabelProps): JSX.Element => {
  const classes = useStyles();

  const isActive = isLive && isWithinSchedule(scheduler);
  const iconClass = shouldInvertColor
    ? classes.iconWhite
    : isActive
      ? classes.iconActive
      : classes.iconInactive;

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
