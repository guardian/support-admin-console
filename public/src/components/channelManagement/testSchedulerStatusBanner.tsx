import ScheduleIcon from '@mui/icons-material/Schedule';
import { Typography, useTheme } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import React from 'react';
import { Scheduler, Status } from './helpers/shared';
import { isWithinSchedule, parseSchedulerUtc } from './helpers/utilities';

const Container = styled('div', {
  shouldForwardProp: (prop) => prop !== 'liveOnSite',
})<{ liveOnSite: boolean }>(({ theme, liveOnSite }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(1.5),
  borderRadius: '4px',
  border: `1px solid ${liveOnSite ? theme.palette.primary.main : theme.palette.grey[700]}`,
  backgroundColor: liveOnSite ? alpha(theme.palette.primary.main, 0.1) : theme.palette.grey[200],
  marginBottom: theme.spacing(2),
}));
const IconRow = styled('div')({
  display: 'flex',
  alignItems: 'flex-start',
  flexShrink: 0,
});
const Details = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.5),
}));
const TitleText = styled(Typography)({
  fontSize: '16px',
  color: '#616161',
});
const Status = styled(Typography)({
  fontWeight: 600,
  fontSize: '16px',
  color: '#616161',
});
const ScheduleTimeText = styled('span')({
  fontSize: '16px',
  color: '#757575',
});
const ReasonText = styled('span')({
  fontSize: '16px',
  color: '#757575',
  fontWeight: 'normal',
});

const formatUtc = (value: string): string => `${value} UTC`;

interface TestSchedulerStatusBannerProps {
  scheduler: Scheduler;
  status: Status;
}

const TestSchedulerStatusBanner: React.FC<TestSchedulerStatusBannerProps> = ({
  scheduler,
  status,
}) => {
  const theme = useTheme();
  const isLive = status === 'Live';
  const withinSchedule = isWithinSchedule(scheduler);
  const liveOnSite = isLive && withinSchedule;

  const iconColor = liveOnSite ? theme.palette.primary.main : '#616161';

  const statusLabel = liveOnSite
    ? 'Test is currently live on site'
    : 'Test is currently not live on site';

  let reason: string | null = null;
  if (!isLive) {
    reason = '(Test is in Draft status.)';
  } else if (!withinSchedule) {
    const now = new Date();
    const start = parseSchedulerUtc(scheduler.start);
    const end = parseSchedulerUtc(scheduler.end);
    if (start && now < start) {
      reason = `(Scheduled to start at ${formatUtc(scheduler.start!)}.)`;
    } else if (end && now > end) {
      reason = `(Schedule ended at ${formatUtc(scheduler.end!)}.)`;
    }
  }

  return (
    <Container liveOnSite={liveOnSite}>
      <IconRow>
        <ScheduleIcon sx={{ fontSize: 40, color: iconColor }} />
      </IconRow>
      <Details>
        <TitleText>
          Scheduler configured.{' '}
          {scheduler.start && (
            <ScheduleTimeText>Start time: {formatUtc(scheduler.start)}</ScheduleTimeText>
          )}
          {scheduler.start && scheduler.end && <Typography component="span"> </Typography>}
          {scheduler.end && (
            <ScheduleTimeText>End time: {formatUtc(scheduler.end)}</ScheduleTimeText>
          )}
        </TitleText>
        <Status>
          {statusLabel}
          {reason && <ReasonText> {reason}</ReasonText>}
        </Status>
      </Details>
    </Container>
  );
};
// Rerender banner only when test is saved
export default React.memo(TestSchedulerStatusBanner, () => true);
