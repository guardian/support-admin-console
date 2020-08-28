import React from 'react';

import {
  FormControl,
  Radio,
  RadioGroup,
  FormControlLabel,
  Theme,
  WithStyles,
  createStyles,
  withStyles,
} from '@material-ui/core';
import { ArticlesViewedSettings } from './helpers/shared';
import EditableTextField from './editableTextField';
import useValidation from './hooks/useValidation';
import { getNotNumberError, getEmptyError } from './helpers/validation';

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
  const setValidationStatusForField = useValidation(onValidationChange);

  const onRadioGroupChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value === 'enabled') {
      onArticlesViewedSettingsChanged(DEFAULT_ARTICLES_VIEWED_SETTINGS);
    } else {
      onArticlesViewedSettingsChanged(undefined);
    }
  };

  const getMinPageViewsError = getNotNumberError;
  const onMinPageViewsChange = (isValid: boolean) =>
    setValidationStatusForField('minViews', isValid);

  const onMinPageViewsChanged = (updatedMinPageViews: string) => {
    const number = Number(updatedMinPageViews);
    if (!Number.isNaN(number) && articlesViewedSettings) {
      onArticlesViewedSettingsChanged({
        ...articlesViewedSettings,
        minViews: number,
      });
    }
  };

  const getMaxPageViewsError = getNotNumberError;
  const onMaxPageViewsChange = (isValid: boolean) =>
    setValidationStatusForField('maxViews', isValid);

  const onMaxPageViewsChanged = (updatedMaxPageViews: string) => {
    const number = Number(updatedMaxPageViews);
    if (!Number.isNaN(number) && articlesViewedSettings) {
      onArticlesViewedSettingsChanged({
        ...articlesViewedSettings,
        maxViews: number,
      });
    }
  };

  const getPeriodInWeeksError = (text: string) => getNotNumberError(text) || getEmptyError(text);
  const onPeriodInWeeksChange = (isValid: boolean) =>
    setValidationStatusForField('periodInWeeks', isValid);

  const onPeriodInWeeksChanged = (updatedPeriodInWeeks: string) => {
    const number = Number(updatedPeriodInWeeks);
    if (!Number.isNaN(number) && articlesViewedSettings) {
      onArticlesViewedSettingsChanged({
        ...articlesViewedSettings,
        periodInWeeks: number,
      });
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
          <EditableTextField
            onSubmit={onMinPageViewsChanged}
            validation={{
              getError: getMinPageViewsError,
              onChange: onMinPageViewsChange,
            }}
            text={articlesViewedSettings.minViews?.toString() || ''}
            label="Minimum page views"
            variant="filled"
            isNumberField
            editEnabled={!isDisabled}
          />
          <EditableTextField
            onSubmit={onMaxPageViewsChanged}
            validation={{
              getError: getMaxPageViewsError,
              onChange: onMaxPageViewsChange,
            }}
            text={articlesViewedSettings.maxViews?.toString() || ''}
            label="Maximum page views"
            variant="filled"
            isNumberField
            editEnabled={!isDisabled}
          />
          <EditableTextField
            onSubmit={onPeriodInWeeksChanged}
            validation={{
              getError: getPeriodInWeeksError,
              onChange: onPeriodInWeeksChange,
            }}
            text={articlesViewedSettings.periodInWeeks.toString()}
            label="Time period in weeks"
            variant="filled"
            isNumberField
            editEnabled={!isDisabled}
          />
        </div>
      )}
    </div>
  );
};

export default withStyles(styles)(TestEditorArticleCountEditor);
