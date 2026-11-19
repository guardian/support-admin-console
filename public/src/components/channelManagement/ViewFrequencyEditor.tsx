import {
  Box,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Tooltip,
} from '@mui/material';
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

const ContainerSection = styled('div')(({ theme }) => ({
  marginTop: theme.spacing(2),
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

interface ViewFrequencyEditorProps {
  useLocalViewLog: boolean;
  onUseLocalViewLogChange: (enabled: boolean) => void;
  maxViews?: MaxViews;
  defaultViews: MaxViews;
  onMaxViewsChanged: (updatedMaxViews?: MaxViews) => void;
  onValidationChange: (isValid: boolean) => void;
  isDisabled: boolean;
}

export const ViewFrequencyEditor: React.FC<ViewFrequencyEditorProps> = ({
  useLocalViewLog,
  onUseLocalViewLogChange,
  maxViews,
  defaultViews,
  onMaxViewsChanged,
  onValidationChange,
  isDisabled,
}: ViewFrequencyEditorProps) => {
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

  const isEnabled = (value: string): boolean => value === 'enabled';

  return (
    <Container>
      <FormControl>
        <RadioGroup
          value={maxViews ? 'enabled' : 'disabled'}
          onChange={(e) => onMaxViewsChanged(isEnabled(e.target.value) ? defaultViews : undefined)}
        >
          <Tooltip
            describeChild
            title={
              'Override the view limit to show this test regardless of how many messages a user has viewed.'
            }
            placement="right"
            arrow
          >
            <FormControlLabel
              value="disabled"
              key="disabled"
              control={<Radio />}
              label="No view limit"
              disabled={isDisabled}
            />
          </Tooltip>
          <FormControlLabel
            value="enabled"
            key="enabled"
            control={<Radio />}
            label="Limit views per browser"
            disabled={isDisabled}
          />
        </RadioGroup>
      </FormControl>

      {maxViews && (
        <ContainerSection>
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
                label="Maximum views"
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
                label="Time period (days)"
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
                label="Minimum gap between views (days)"
                InputLabelProps={{ shrink: true }}
                variant="filled"
                fullWidth
                disabled={isDisabled}
              />
            </div>
          </FormContainer>
          <ContainerSection>
            <FormControl>
              <RadioGroup
                value={useLocalViewLog ? 'enabled' : 'disabled'}
                onChange={(e) => onUseLocalViewLogChange(isEnabled(e.target.value))}
              >
                <FormControlLabel
                  value="disabled"
                  key="disabled"
                  control={<Radio />}
                  label="Use shared view count"
                  disabled={isDisabled}
                />
                <Tooltip
                  describeChild
                  title={
                    'For example, if a user has already hit the max views for this month, they will get an additional set of views for this specific test.'
                  }
                  placement="right"
                  arrow
                >
                  <FormControlLabel
                    value="enabled"
                    key="enabled"
                    control={<Radio />}
                    label="Create a separate view count for this test"
                    disabled={isDisabled}
                  />
                </Tooltip>
              </RadioGroup>
            </FormControl>
          </ContainerSection>
        </ContainerSection>
      )}
    </Container>
  );
};
