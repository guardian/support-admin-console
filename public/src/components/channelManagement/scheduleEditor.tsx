import { TextField, Theme, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import React from 'react';
import { Scheduler } from './helpers/shared';

const useStyles = makeStyles(({ spacing }: Theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing(1),
  },
  dateRange: {
    display: 'flex',
    gap: spacing(2),
  },
  field: {
    flex: '1 0 200px',
  },
}));

interface ScheduleEditorProps {
  scheduler?: Scheduler;
  disabled: boolean;
  onChange: (scheduler?: Scheduler) => void;
}

const ScheduleEditor: React.FC<ScheduleEditorProps> = ({ scheduler, disabled, onChange }) => {
  const classes = useStyles();

  const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const start = e.target.value || undefined;
    if (!start && !scheduler?.end) {
      onChange(undefined);
    } else {
      onChange({ ...scheduler, start });
    }
  };

  const handleEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const end = e.target.value || undefined;
    if (!end && !scheduler?.start) {
      onChange(undefined);
    } else {
      onChange({ ...scheduler, end });
    }
  };

  return (
    <div className={classes.container}>
      <Typography variant="subtitle2">
        Test scheduler{' '}
        <small>
          (Start and end dates are inclusive. Leave blank to go live immediately. Note: schedule has
          no effect on draft tests.)
        </small>
      </Typography>
      <div className={classes.dateRange}>
        <TextField
          className={classes.field}
          label="Start Date"
          type="date"
          value={scheduler?.start ?? ''}
          onChange={handleStartChange}
          variant="outlined"
          size="small"
          disabled={disabled}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          className={classes.field}
          label="End Date"
          type="date"
          value={scheduler?.end ?? ''}
          onChange={handleEndChange}
          variant="outlined"
          size="small"
          disabled={disabled}
          InputLabelProps={{ shrink: true }}
        />
      </div>
    </div>
  );
};

export default ScheduleEditor;
