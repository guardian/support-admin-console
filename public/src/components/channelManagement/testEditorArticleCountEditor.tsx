import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { FormControl, Radio, RadioGroup, FormControlLabel, TextField, Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { ArticlesViewedSettings } from './helpers/shared';
import { notNumberValidator, EMPTY_ERROR_HELPER_TEXT } from './helpers/validation';
import MultiselectAutocomplete from './MutliSelectTagEditor';

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

export const DEFAULT_ARTICLES_VIEWED_SETTINGS: ArticlesViewedSettings = {
  minViews: 5,
  maxViews: null,
  periodInWeeks: 52,
  tagIds: [],
};

interface FormData {
  minViews: string;
  maxViews: string;
  periodInWeeks: string;
  tagIds: string[];
}

interface TestEditorArticleCountEditorProps {
  articlesViewedSettings?: ArticlesViewedSettings;
  onArticlesViewedSettingsChanged: (updatedArticlesViewedSettings?: ArticlesViewedSettings) => void;
  onValidationChange: (isValid: boolean) => void;
  isDisabled: boolean;
}

const TestEditorArticleCountEditor: React.FC<TestEditorArticleCountEditorProps> = ({
  articlesViewedSettings,
  onArticlesViewedSettingsChanged,
  onValidationChange,
  isDisabled,
}: TestEditorArticleCountEditorProps) => {
  const classes = useStyles();

  const defaultValues: FormData = {
    minViews: articlesViewedSettings?.minViews?.toString() || '',
    maxViews: articlesViewedSettings?.maxViews?.toString() || '',
    periodInWeeks: articlesViewedSettings?.periodInWeeks.toString() || '',
    tagIds: articlesViewedSettings?.tagIds || [],
  };

  const { register, errors, handleSubmit, reset } = useForm<FormData>({
    mode: 'onChange',
    defaultValues,
  });
  const tagIds = articlesViewedSettings?.tagIds || [];

  useEffect(() => {
    reset(defaultValues);
  }, [
    defaultValues.minViews,
    defaultValues.maxViews,
    defaultValues.periodInWeeks,
    defaultValues.tagIds,
  ]);

  const onSubmit = ({ minViews, maxViews, periodInWeeks }: FormData): void => {
    onArticlesViewedSettingsChanged({
      minViews: parseInt(minViews) || null,
      maxViews: parseInt(maxViews) || null,
      periodInWeeks: parseInt(periodInWeeks),
      tagIds: articlesViewedSettings?.tagIds || null,
    });
  };

  useEffect(() => {
    const isValid = Object.keys(errors).length === 0;
    onValidationChange(isValid);
  }, [errors.minViews, errors.maxViews, errors.periodInWeeks, errors.tagIds]);

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
            label="Do not target by user's article count"
            disabled={isDisabled}
          />
          <FormControlLabel
            value="enabled"
            key="enabled"
            control={<Radio />}
            label="Target by user's article count"
            disabled={isDisabled}
          />
        </RadioGroup>
      </FormControl>

      {articlesViewedSettings && (
        <div>
          <div className={classes.formContainer}>
            <div>
              <TextField
                inputRef={register({ validate: notNumberValidator })}
                error={errors.minViews !== undefined}
                helperText={errors.minViews?.message}
                onBlur={handleSubmit(onSubmit)}
                name="minViews"
                label="Minimum page views"
                InputLabelProps={{ shrink: true }}
                variant="filled"
                fullWidth
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
                error={errors.periodInWeeks !== undefined}
                helperText={errors.periodInWeeks?.message}
                onBlur={handleSubmit(onSubmit)}
                name="periodInWeeks"
                label="Time period in weeks"
                InputLabelProps={{ shrink: true }}
                variant="filled"
                fullWidth
                disabled={isDisabled}
              />
            </div>
          </div>
          <div>
            <MultiselectAutocomplete
              disabled={isDisabled}
              tagIds={tagIds}
              onUpdate={(newTagIds): void => {
                onArticlesViewedSettingsChanged({ ...articlesViewedSettings, tagIds: newTagIds });
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TestEditorArticleCountEditor;
