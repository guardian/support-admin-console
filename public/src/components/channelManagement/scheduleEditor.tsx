import { TextField, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';
import { Scheduler } from './helpers/shared';
import { parseSchedulerUtc } from './helpers/utilities';

const Container = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
}));
const DateRange = styled('div')(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
}));
const Field = styled(TextField)({ flex: '1 0 200px' });

interface ScheduleEditorProps {
  scheduler?: Scheduler;
  disabled: boolean;
  onChange: (scheduler?: Scheduler) => void;
  onValidationChange?: (isValid: boolean) => void;
}

const ScheduleEditor: React.FC<ScheduleEditorProps> = ({
  scheduler,
  disabled,
  onChange,
  onValidationChange,
}) => {
  const startDate = React.useMemo(() => parseSchedulerUtc(scheduler?.start), [scheduler?.start]);
  const endDate = React.useMemo(() => parseSchedulerUtc(scheduler?.end), [scheduler?.end]);
  const hasInvalidRange = Boolean(startDate && endDate && endDate < startDate);

  React.useEffect(() => {
    onValidationChange?.(!hasInvalidRange);
  }, [hasInvalidRange, onValidationChange]);

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
    <Container>
      <Typography variant="subtitle2">
        Test scheduler{' '}
        <small>
          (Start and end times are inclusive and in UTC. Leave blank to go live immediately. Note:
          schedule has no effect on draft tests.)
        </small>
      </Typography>
      <DateRange>
        <Field
          label="Start Date (UTC)"
          type="datetime-local"
          value={scheduler?.start ?? ''}
          onChange={handleStartChange}
          variant="outlined"
          size="small"
          disabled={disabled}
          error={hasInvalidRange}
          InputLabelProps={{ shrink: true }}
        />
        <Field
          label="End Date (UTC)"
          type="datetime-local"
          value={scheduler?.end ?? ''}
          onChange={handleEndChange}
          variant="outlined"
          size="small"
          disabled={disabled}
          error={hasInvalidRange}
          helperText={hasInvalidRange ? 'End date must be after the start date' : ' '}
          InputLabelProps={{ shrink: true }}
        />
      </DateRange>
    </Container>
  );
};

export default ScheduleEditor;
