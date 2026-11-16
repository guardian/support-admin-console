import { Box, FormControl, FormControlLabel, Radio, RadioGroup, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { MaxViews } from '../../models/shared';
import { EMPTY_ERROR_HELPER_TEXT, notNumberValidator } from './helpers/validation';

const Container = styled(Box)(({ theme }) => ({
  '& > * + *': {
    marginTop: theme.spacing(2),
  },
}));

const FormContainer = styled(Box)(({ theme }) => ({
  maxWidth: '250px',

  '& > * + *': {
    marginTop: theme.spacing(1),
  },
}));

interface FormData {
  maxViewsCount: string;
  maxViewsDays: string;
  minDaysBetweenViews: string;
}

interface TestEditorArticleCountEditorProps {
  maxViews?: MaxViews;
  defaultViews: MaxViews;
  onMaxViewsChanged: (updatedMaxViews?: MaxViews) => void;
  onValidationChange: (isValid: boolean) => void;
  isDisabled: boolean;
}

export const MaxViewsEditor: React.FC<TestEditorArticleCountEditorProps> = ({
  maxViews,
  defaultViews,
  onMaxViewsChanged,
  onValidationChange,
  isDisabled,
}: TestEditorArticleCountEditorProps) => {
  const defaultValues: FormData = useMemo(
    () => ({
      maxViewsCount: maxViews?.maxViewsCount.toString() ?? '',
      maxViewsDays: maxViews?.maxViewsDays.toString() ?? '',
      minDaysBetweenViews: maxViews?.minDaysBetweenViews.toString() ?? '',
    }),
    [maxViews?.maxViewsCount, maxViews?.maxViewsDays, maxViews?.minDaysBetweenViews],
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
      !maxViews ||
      (errors.maxViewsCount === undefined &&
        errors.maxViewsDays === undefined &&
        errors.minDaysBetweenViews === undefined);
    onValidationChange(isValid);
  }, [
    maxViews,
    errors.maxViewsCount,
    errors.maxViewsDays,
    errors.minDaysBetweenViews,
    onValidationChange,
  ]);

  const onRadioGroupChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (event.target.value === 'enabled') {
      onMaxViewsChanged(defaultViews);
    } else {
      onMaxViewsChanged(undefined);
    }
  };

  return (
    <Container>
      <FormControl>
        <RadioGroup value={maxViews ? 'enabled' : 'disabled'} onChange={onRadioGroupChange}>
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

      {maxViews && (
        <FormContainer>
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
        </FormContainer>
      )}
    </Container>
  );
};
