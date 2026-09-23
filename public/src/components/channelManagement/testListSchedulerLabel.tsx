import ScheduleIcon from '@mui/icons-material/Schedule';
import { Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { JSX } from 'react';
import { Scheduler } from './helpers/shared';
import { isWithinSchedule } from './helpers/utilities';

const Container = styled('div')({
  padding: '1px',
  lineHeight: 0,
});
const IconActive = styled(ScheduleIcon)({
  color: '#F2453D',
});
const IconInactive = styled(ScheduleIcon)({
  color: '#9e9e9e',
});
const IconWhite = styled(ScheduleIcon)({
  color: '#ffffff',
});

interface TestListSchedulerLabelProps {
  scheduler: Scheduler;
  isLive: boolean;
  shouldInvertColor: boolean;
}

const TestListSchedulerLabel: React.FC<TestListSchedulerLabelProps> = ({
  scheduler,
  isLive,
  shouldInvertColor,
}: TestListSchedulerLabelProps): JSX.Element => {
  const isActive = isLive && isWithinSchedule(scheduler);
  const Icon = shouldInvertColor ? IconWhite : isActive ? IconActive : IconInactive;

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
      <Container>
        <Icon sx={{ fontSize: 16 }} />
      </Container>
    </Tooltip>
  );
};

export default TestListSchedulerLabel;
