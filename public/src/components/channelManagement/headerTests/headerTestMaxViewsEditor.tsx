import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import {
  FormControl,
  makeStyles,
  Radio,
  RadioGroup,
  FormControlLabel,
  TextField,
  Theme,
} from '@material-ui/core';
import { MaxHeaderViews } from './headerTestsForm';
import { notNumberValidator, EMPTY_ERROR_HELPER_TEXT } from '../helpers/validation';
import { DEFAULT_MAX_HEADER_VIEWS } from './utils/defaults';

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
  maxHeaderViews?: MaxHeaderViews;
  onMaxViewsChanged: (updatedMaxViews?: MaxHeaderViews) => void;
  onValidationChange: (isValid: boolean) => void;
  isDisabled: boolean;
}

const HeaderTestMaxViewsEditor: React.FC<TestEditorArticleCountEditorProps> = ({
  maxHeaderViews,
  onMaxViewsChanged,
  onValidationChange,
  isDisabled,
}: TestEditorArticleCountEditorProps) => {
  const classes = useStyles();

  const defaultValues: FormData = {
    maxViewsCount: maxHeaderViews?.maxViewsCount.toString() || '',
    maxViewsDays: maxHeaderViews?.maxViewsDays.toString() || '',
    minDaysBetweenViews: maxHeaderViews?.minDaysBetweenViews.toString() || '',
  };

  const { register, errors, handleSubmit, reset } = useForm<FormData>({
    mode: 'onChange',
    defaultValues,
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues.maxViewsCount, defaultValues.maxViewsDays, defaultValues.minDaysBetweenViews]);

  const onSubmit = ({ maxViewsCount, maxViewsDays, minDaysBetweenViews }: FormData): void => {
    onMaxViewsChanged({
      maxViewsCount: parseInt(maxViewsCount),
      maxViewsDays: parseInt(maxViewsDays),
      minDaysBetweenViews: parseInt(minDaysBetweenViews),
    });
  };

  useEffect(() => {
    const isValid = Object.keys(errors).length === 0;
    onValidationChange(isValid);
  }, [errors.maxViewsCount, errors.maxViewsDays, errors.minDaysBetweenViews]);

  const onRadioGroupChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (event.target.value === 'enabled') {
      onMaxViewsChanged(DEFAULT_MAX_HEADER_VIEWS);
    } else {
      onMaxViewsChanged(undefined);
    }
  };

  return (
    <div className={classes.container}>
      <FormControl>
        <RadioGroup value={maxHeaderViews ? 'enabled' : 'disabled'} onChange={onRadioGroupChange}>
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

      {maxHeaderViews && (
        <div className={classes.formContainer}>
          <div>
            <TextField
              inputRef={register({
                required: EMPTY_ERROR_HELPER_TEXT,
                validate: notNumberValidator,
              })}
              error={errors.maxViewsCount !== undefined}
              helperText={errors.maxViewsCount?.message}
              onBlur={handleSubmit(onSubmit)}
              name="maxViewsCount"
              label="Maximum view counts"
              InputLabelProps={{ shrink: true }}
              variant="filled"
              fullWidth
              disabled={isDisabled}
            />
          </div>
          <div>
            <TextField
              inputRef={register({
                required: EMPTY_ERROR_HELPER_TEXT,
                validate: notNumberValidator,
              })}
              error={errors.maxViewsDays !== undefined}
              helperText={errors.maxViewsDays?.message}
              onBlur={handleSubmit(onSubmit)}
              name="maxViewsDays"
              label="Number of days"
              InputLabelProps={{ shrink: true }}
              variant="filled"
              fullWidth
              disabled={isDisabled}
            />
          </div>
          <div>
            <TextField
              inputRef={register({
                required: EMPTY_ERROR_HELPER_TEXT,
                validate: notNumberValidator,
              })}
              error={errors.minDaysBetweenViews !== undefined}
              helperText={errors.minDaysBetweenViews?.message}
              onBlur={handleSubmit(onSubmit)}
              name="minDaysBetweenViews"
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

export default HeaderTestMaxViewsEditor;
