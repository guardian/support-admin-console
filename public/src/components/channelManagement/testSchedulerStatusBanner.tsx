import ScheduleIcon from '@mui/icons-material/Schedule';
import { Theme, Typography, useTheme } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import React from 'react';
import { Scheduler, Status } from './helpers/shared';

const useStyles = makeStyles(({ spacing, palette }: Theme) => ({
  containerLive: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing(1),
    padding: spacing(1.5),
    borderRadius: '4px',
    border: `1px solid ${palette.primary.main}`,
    backgroundColor: alpha(palette.primary.main, 0.1),
    marginBottom: spacing(2),
  },
  containerOffline: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing(1),
    padding: spacing(1.5),
    borderRadius: '4px',
    border: `1px solid ${palette.grey[700]}`,
    backgroundColor: palette.grey[200],
    marginBottom: spacing(2),
  },
  iconRow: {
    display: 'flex',
    alignItems: 'flex-start',
    flexShrink: 0,
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing(0.5),
  },
  titleTextLive: {
    fontSize: '16px',
    color: palette.grey[700],
  },
  titleTextOffline: {
    fontSize: '16px',
    color: palette.grey[700],
  },
  statusLive: {
    fontWeight: 600,
    fontSize: '16px',
    color: palette.grey[700],
  },
  statusOffline: {
    fontWeight: 600,
    fontSize: '16px',
    color: palette.grey[700],
  },
  scheduleTimeText: {
    fontSize: '16px',
    color: palette.grey[600],
  },
  reasonText: {
    fontSize: '16px',
    color: palette.grey[600],
  },
}));

const parseUtc = (value?: string): Date | null => {
  if (!value) {
    return null;
  }
  const d = new Date(`${value}:00Z`);
  return isNaN(d.getTime()) ? null : d;
};

const formatUtc = (value: string): string => `${value} UTC`;

const isWithinSchedule = (scheduler: Scheduler): boolean => {
  const now = new Date();
  const start = parseUtc(scheduler.start);
  const end = parseUtc(scheduler.end);
  if (start && now < start) {
    return false;
  }
  if (end && now > end) {
    return false;
  }
  return true;
};

interface TestSchedulerStatusBannerProps {
  scheduler: Scheduler;
  status: Status;
}

const TestSchedulerStatusBanner: React.FC<TestSchedulerStatusBannerProps> = ({
  scheduler,
  status,
}) => {
  const classes = useStyles();

  const theme = useTheme();
  const isLive = status === 'Live';
  const withinSchedule = isWithinSchedule(scheduler);
  const liveOnSite = isLive && withinSchedule;

  const containerClass = liveOnSite ? classes.containerLive : classes.containerOffline;
  const statusClass = liveOnSite ? classes.statusLive : classes.statusOffline;
  const titleClass = liveOnSite ? classes.titleTextLive : classes.titleTextOffline;
  const iconColor = liveOnSite ? theme.palette.primary.main : '#616161';

  const statusLabel = liveOnSite
    ? 'Test is currently live on site'
    : 'Test is currently not live on site';

  let reason: string | null = null;
  if (!isLive) {
    reason = '(Test is in Draft status.)';
  } else if (!withinSchedule) {
    const now = new Date();
    const start = parseUtc(scheduler.start);
    const end = parseUtc(scheduler.end);
    if (start && now < start) {
      reason = `(Scheduled to start at ${formatUtc(scheduler.start!)}.)`;
    } else if (end && now > end) {
      reason = `(Schedule ended at ${formatUtc(scheduler.end!)}.)`;
    }
  }

  return (
    <div className={containerClass}>
      <div className={classes.iconRow}>
        <ScheduleIcon sx={{ fontSize: 40, color: iconColor }} />
      </div>
      <div className={classes.details}>
        <Typography className={titleClass}>
          Scheduler configured.{' '}
          {scheduler.start && (
            <Typography component="span" className={classes.scheduleTimeText}>
              Start time: {formatUtc(scheduler.start)}
            </Typography>
          )}
          {scheduler.start && scheduler.end && <Typography component="span"> </Typography>}
          {scheduler.end && (
            <Typography component="span" className={classes.scheduleTimeText}>
              End time: {formatUtc(scheduler.end)}
            </Typography>
          )}
        </Typography>
        <Typography className={statusClass}>
          {statusLabel}
          {reason && (
            <Typography component="span" className={classes.reasonText}>
              {' '}
              {reason}
            </Typography>
          )}
        </Typography>
      </div>
    </div>
  );
};

export default TestSchedulerStatusBanner;
