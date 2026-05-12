import { FormControl, FormControlLabel, Radio, RadioGroup, TextField, Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';
import React, { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { MaxEpicViews } from '../../../models/epic';
import { EMPTY_ERROR_HELPER_TEXT, notNumberValidator } from '../helpers/validation';
import { DEFAULT_MAX_EPIC_VIEWS } from './utils/defaults';

const useStyles = makeStyles(({ spacing }: Theme) => ({
  container: {
    '& > * + *': {
      marginTop: spacing(2),
    },
  },
  formContainer: {
    maxWidth: '250px',

    '& > * + *': {
      marginTop: spacing(1),
    },
  },
}));

interface FormData {
  maxViewsCount: string;
  maxViewsDays: string;
  minDaysBetweenViews: string;
}

interface TestEditorArticleCountEditorProps {
  maxEpicViews?: MaxEpicViews;
  onMaxViewsChanged: (updatedMaxViews?: MaxEpicViews) => void;
  onValidationChange: (isValid: boolean) => void;
  isDisabled: boolean;
}

const MaxViewsEditor: React.FC<TestEditorArticleCountEditorProps> = ({
  maxEpicViews,
  onMaxViewsChanged,
  onValidationChange,
  isDisabled,
}: TestEditorArticleCountEditorProps) => {
  const classes = useStyles();

  const defaultValues: FormData = useMemo(
    () => ({
      maxViewsCount: maxEpicViews?.maxViewsCount.toString() ?? '',
      maxViewsDays: maxEpicViews?.maxViewsDays.toString() ?? '',
      minDaysBetweenViews: maxEpicViews?.minDaysBetweenViews.toString() ?? '',
    }),
    [maxEpicViews?.maxViewsCount, maxEpicViews?.maxViewsDays, maxEpicViews?.minDaysBetweenViews],
  );

  const {
    register,
    handleSubmit,
    reset,

    formState: { errors },
  } = useForm<FormData>({
    mode: 'onChange',
    defaultValues,
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const onSubmit = ({ maxViewsCount, maxViewsDays, minDaysBetweenViews }: FormData): void => {
    onMaxViewsChanged({
      maxViewsCount: parseInt(maxViewsCount),
      maxViewsDays: parseInt(maxViewsDays),
      minDaysBetweenViews: parseInt(minDaysBetweenViews),
    });
  };

  useEffect(() => {
    const isValid =
      !maxEpicViews ||
      (errors.maxViewsCount === undefined &&
        errors.maxViewsDays === undefined &&
        errors.minDaysBetweenViews === undefined);
    onValidationChange(isValid);
  }, [
    maxEpicViews,
    errors.maxViewsCount,
    errors.maxViewsDays,
    errors.minDaysBetweenViews,
    onValidationChange,
  ]);

  const onRadioGroupChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (event.target.value === 'enabled') {
      onMaxViewsChanged(DEFAULT_MAX_EPIC_VIEWS);
    } else {
      onMaxViewsChanged(undefined);
    }
  };

  return (
    <div className={classes.container}>
      <FormControl>
        <RadioGroup value={maxEpicViews ? 'enabled' : 'disabled'} onChange={onRadioGroupChange}>
          <FormControlLabel
            value="disabled"
            key="disabled"
            control={<Radio />}
            label="Always ask"
            disabled={isDisabled}
          />
          <FormControlLabel
            value="enabled"
            key="enabled"
            control={<Radio />}
            label="Use max views settings..."
            disabled={isDisabled}
          />
        </RadioGroup>
      </FormControl>

      {maxEpicViews && (
        <div className={classes.formContainer}>
          <div>
            <TextField
              error={errors.maxViewsCount !== undefined}
              helperText={errors.maxViewsCount?.message}
              {...register('maxViewsCount', {
                required: EMPTY_ERROR_HELPER_TEXT,
                validate: notNumberValidator,
              })}
              onBlur={(e) => {
                e.preventDefault();
                void handleSubmit(onSubmit)(e);
              }}
              label="Maximum view counts"
              InputLabelProps={{ shrink: true }}
              variant="filled"
              fullWidth
              disabled={isDisabled}
            />
          </div>
          <div>
            <TextField
              error={errors.maxViewsDays !== undefined}
              helperText={errors.maxViewsDays?.message}
              {...register('maxViewsDays', {
                required: EMPTY_ERROR_HELPER_TEXT,
                validate: notNumberValidator,
              })}
              onBlur={(e) => {
                e.preventDefault();
                void handleSubmit(onSubmit)(e);
              }}
              label="Number of days"
              InputLabelProps={{ shrink: true }}
              variant="filled"
              fullWidth
              disabled={isDisabled}
            />
          </div>
          <div>
            <TextField
              error={errors.minDaysBetweenViews !== undefined}
              helperText={errors.minDaysBetweenViews?.message}
              {...register('minDaysBetweenViews', {
                required: EMPTY_ERROR_HELPER_TEXT,
                validate: notNumberValidator,
              })}
              onBlur={(e) => {
                e.preventDefault();
                void handleSubmit(onSubmit)(e);
              }}
              label="Minimum days between views"
              InputLabelProps={{ shrink: true }}
              variant="filled"
              fullWidth
              disabled={isDisabled}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MaxViewsEditor;
