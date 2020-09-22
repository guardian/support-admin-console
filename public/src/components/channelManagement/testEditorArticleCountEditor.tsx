import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import {
  FormControl,
  Radio,
  RadioGroup,
  FormControlLabel,
  TextField,
  Theme,
  WithStyles,
  createStyles,
  withStyles,
} from '@material-ui/core';
import { ArticlesViewedSettings } from './helpers/shared';
import { notNumberValidator, EMPTY_ERROR_HELPER_TEXT } from './helpers/validation';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const styles = ({ spacing }: Theme) =>
  createStyles({
    container: {
      '& > * + *': {
        marginTop: spacing(2),
      },
    },
    formContainer: {
      '& > * + *': {
        marginTop: spacing(1),
      },
    },
  });

const DEFAULT_ARTICLES_VIEWED_SETTINGS: ArticlesViewedSettings = {
  minViews: 3,
  maxViews: 999,
  periodInWeeks: 6,
};

interface FormData {
  minViews: string;
  maxViews: string;
  periodInWeeks: string;
}

interface TestEditorArticleCountEditorProps extends WithStyles<typeof styles> {
  articlesViewedSettings?: ArticlesViewedSettings;
  onArticlesViewedSettingsChanged: (updatedArticlesViewedSettings?: ArticlesViewedSettings) => void;
  onValidationChange: (isValid: boolean) => void;
  isDisabled: boolean;
}

const TestEditorArticleCountEditor: React.FC<TestEditorArticleCountEditorProps> = ({
  classes,
  articlesViewedSettings,
  onArticlesViewedSettingsChanged,
  onValidationChange,
  isDisabled,
}: TestEditorArticleCountEditorProps) => {
  const defaultValues: FormData = {
    minViews: articlesViewedSettings?.minViews?.toString() || '',
    maxViews: articlesViewedSettings?.maxViews?.toString() || '',
    periodInWeeks: articlesViewedSettings?.periodInWeeks.toString() || '',
  };

  const { register, errors, handleSubmit, reset } = useForm<FormData>({
    mode: 'onChange',
    defaultValues,
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues.minViews, defaultValues.maxViews, defaultValues.periodInWeeks]);

  const onSubmit = ({ minViews, maxViews, periodInWeeks }: FormData): void => {
    onArticlesViewedSettingsChanged({
      minViews: parseInt(minViews),
      maxViews: parseInt(maxViews),
      periodInWeeks: parseInt(periodInWeeks),
    });
  };

  useEffect(() => {
    const isValid = Object.keys(errors).length === 0;
    onValidationChange(isValid);
  }, [errors.minViews, errors.maxViews, errors.periodInWeeks]);

  const onRadioGroupChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (event.target.value === 'enabled') {
      onArticlesViewedSettingsChanged(DEFAULT_ARTICLES_VIEWED_SETTINGS);
    } else {
      onArticlesViewedSettingsChanged(undefined);
    }
  };

  return (
    <div className={classes.container}>
      <FormControl>
        <RadioGroup
          value={articlesViewedSettings ? 'enabled' : 'disabled'}
          onChange={onRadioGroupChange}
        >
          <FormControlLabel
            value="disabled"
            key="disabled"
            control={<Radio />}
            label="Do not show user's article count"
            disabled={isDisabled}
          />
          <FormControlLabel
            value="enabled"
            key="enabled"
            control={<Radio />}
            label="Show user's article count"
            disabled={isDisabled}
          />
        </RadioGroup>
      </FormControl>

      {articlesViewedSettings && (
        <div className={classes.formContainer}>
          <div>
            <TextField
              inputRef={register({ validate: notNumberValidator })}
              error={errors.minViews !== undefined}
              helperText={errors.minViews?.message}
              onBlur={handleSubmit(onSubmit)}
              name="minViews"
              label="Minimum page views"
              variant="filled"
              disabled={isDisabled}
            />
          </div>
          <div>
            <TextField
              inputRef={register({ validate: notNumberValidator })}
              error={errors.maxViews !== undefined}
              helperText={errors.maxViews?.message}
              onBlur={handleSubmit(onSubmit)}
              name="maxViews"
              label="Maximum page views"
              variant="filled"
              disabled={isDisabled}
            />
          </div>
          <div>
            <TextField
              inputRef={register({
                required: EMPTY_ERROR_HELPER_TEXT,
                validate: notNumberValidator,
              })}
              error={errors.periodInWeeks !== undefined}
              helperText={errors.periodInWeeks?.message}
              onBlur={handleSubmit(onSubmit)}
              name="periodInWeeks"
              label="Time period in weeks"
              variant="filled"
              disabled={isDisabled}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default withStyles(styles)(TestEditorArticleCountEditor);
