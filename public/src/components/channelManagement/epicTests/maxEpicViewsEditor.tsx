import React from 'react';
import {
  createStyles,
  FormControl,
  FormControlLabel,
  InputLabel,
  Radio,
  RadioGroup,
  Theme,
  withStyles,
  WithStyles,
} from '@material-ui/core';
import EditableTextField from '../editableTextField';
import { onFieldValidationChange, ValidationStatus, isNumber } from '../helpers/validation';
import { EpicTest, MaxEpicViews } from './epicTestsForm';

export const MaxEpicViewsDefaults: MaxEpicViews = {
  maxViewsCount: 4,
  maxViewsDays: 30,
  minDaysBetweenViews: 0,
};

const styles = ({ spacing, typography }: Theme) =>
  createStyles({
    button: {
      marginTop: '20px',
    },
    formControl: {
      marginTop: spacing(2),
      marginBottom: spacing(1),
      display: 'block',
    },
    selectLabel: {
      fontSize: typography.pxToRem(22),
      fontWeight: typography.fontWeightMedium,
      color: 'black',
    },
    radio: {
      paddingTop: '20px',
      marginBottom: '10px',
    },
    maxEpicViewsContainer: {
      marginTop: '10px',
      marginLeft: '20px',
    },
  });

type AskStrategy = 'AlwaysAsk' | 'MaxEpicViews';

type MaxEpicViewsFieldName = 'maxViewsCount' | 'maxViewsDays' | 'minDaysBetweenViews';

interface Props extends WithStyles<typeof styles> {
  test: EpicTest;
  editMode: boolean;
  onChange: (alwaysAsk: boolean, maxEpicViews: MaxEpicViews) => void;
  onValidationChange: (isValid: boolean) => void;
}

interface State {
  validationStatus: ValidationStatus;
}

class MaxEpicViewsEditor extends React.Component<Props, State> {
  state: State = {
    validationStatus: {},
  };

  buildField = (fieldName: MaxEpicViewsFieldName, label: string) => {
    const test = this.props.test;

    return (
      <EditableTextField
        text={
          test.maxViews
            ? test.maxViews[fieldName].toString()
            : MaxEpicViewsDefaults[fieldName].toString()
        }
        onSubmit={(value: string) => {
          if (isNumber(value)) {
            this.props.onChange(this.props.test.alwaysAsk, {
              ...(this.props.test.maxViews || MaxEpicViewsDefaults),
              [fieldName]: Number(value),
            });
          }
        }}
        label={label}
        helperText="Must be a number"
        editEnabled={this.props.editMode}
        validation={{
          getError: (value: string) => (isNumber(value) ? null : 'Must be a number'),
          onChange: onFieldValidationChange(this)(fieldName),
        }}
        isNumberField
      />
    );
  };

  onRadioChange(askStrategy: AskStrategy) {
    this.props.onChange(
      askStrategy === 'AlwaysAsk',
      this.props.test.maxViews || MaxEpicViewsDefaults,
    );
  }

  render(): React.ReactNode {
    const classes = this.props.classes;

    return (
      <>
        <FormControl className={classes.formControl}>
          <InputLabel className={classes.selectLabel} shrink htmlFor="ask-strategy">
            Ask strategy:
          </InputLabel>

          <RadioGroup
            className={classes.radio}
            value={this.props.test.alwaysAsk ? 'AlwaysAsk' : 'MaxEpicViews'}
            onChange={(event, value) => {
              if (value === 'AlwaysAsk' || value === 'MaxEpicViews') {
                this.onRadioChange(value);
              }
            }}
          >
            <FormControlLabel
              value={'AlwaysAsk'}
              key={'AlwaysAsk'}
              control={<Radio />}
              label={'Always ask'}
              disabled={!this.props.editMode}
            />
            <FormControlLabel
              value={'MaxEpicViews'}
              key={'MaxEpicViews'}
              control={<Radio />}
              label={'Use max views settings...'}
              disabled={!this.props.editMode}
            />
          </RadioGroup>
        </FormControl>

        {!this.props.test.alwaysAsk && (
          <div className={classes.maxEpicViewsContainer}>
            {this.buildField('maxViewsCount', 'Maximum view counts')}
            {this.buildField('maxViewsDays', 'Number of days')}
            {this.buildField('minDaysBetweenViews', 'Minimum days between views')}
          </div>
        )}
      </>
    );
  }
}

export default withStyles(styles)(MaxEpicViewsEditor);
