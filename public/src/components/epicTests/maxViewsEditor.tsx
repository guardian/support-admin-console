import React from 'react';
import {
  createStyles, FormControl,
  FormControlLabel,
  InputLabel, Radio,
  RadioGroup,
  Theme,
  withStyles,
  WithStyles
} from "@material-ui/core";
import EditableTextField from "../helpers/editableTextField"
import {onFieldValidationChange, ValidationStatus} from "../helpers/validation";
import {EpicTest, MaxViews} from "./epicTestsForm";

const isNumber = (value: string): boolean => !Number.isNaN(Number(value));

export const MaxViewsDefaults: MaxViews = {
  maxViewsCount: 4,
  maxViewsDays: 30,
  minDaysBetweenViews: 0
};

const styles = ({ spacing, typography}: Theme) => createStyles({
  button: {
    marginTop: '20px'
  },
  formControl: {
    marginTop: spacing(2),
    marginBottom: spacing(1),
    display: "block",
  },
  selectLabel: {
    fontSize: typography.pxToRem(22),
    fontWeight: typography.fontWeightMedium,
    color: "black"
  },
  radio: {
    paddingTop: "20px",
    marginBottom: "10px"
  },
  maxViewsContainer: {
    marginTop: '10px',
    marginLeft: '20px'
  }
});

type AskStrategy = 'AlwaysAsk' | 'MaxViews';

type MaxViewsFieldName = 'maxViewsCount' | 'maxViewsDays' | 'minDaysBetweenViews';

interface Props extends WithStyles<typeof styles> {
  test: EpicTest,
  editMode: boolean,
  onChange: (alwaysAsk: boolean, maxViews: MaxViews) => void,
  onValidationChange: (isValid: boolean) => void
}

interface State {
  validationStatus: ValidationStatus
}

class MaxViewsEditor extends React.Component<Props, State> {
  state: State = {
    validationStatus: {}
  };

  buildField = (fieldName: MaxViewsFieldName, label: string) => {
    const test = this.props.test;

    return (<EditableTextField
      text={test.maxViews ? test.maxViews[fieldName].toString() : MaxViewsDefaults[fieldName].toString()}
      onSubmit={ (value: string) => {
        if (isNumber(value)) {
          this.props.onChange(
            this.props.test.alwaysAsk,
            {
              ...this.props.test.maxViews || MaxViewsDefaults,
              [fieldName]: Number(value)
            }
          )
        }
      }}
      label={label}
      helperText="Must be a number"
      editEnabled={this.props.editMode}
      validation={
        {
          getError: (value: string) => isNumber(value) ? null : 'Must be a number',
          onChange: onFieldValidationChange(this)(fieldName)
        }
      }
      isNumberField
    />)
  };

  onRadioChange(askStrategy: AskStrategy) {
    this.props.onChange(
      askStrategy === 'AlwaysAsk',
      this.props.test.maxViews || MaxViewsDefaults
    )
  }

  render(): React.ReactNode {
    const classes = this.props.classes;

    return (
      <>
        <FormControl
          className={classes.formControl}>
          <InputLabel
            className={classes.selectLabel}
            shrink
            htmlFor="ask-strategy">
            Ask strategy:
          </InputLabel>

          <RadioGroup
            className={classes.radio}
            value={this.props.test.alwaysAsk ? 'AlwaysAsk' : 'MaxViews'}
            onChange={(event, value) => {
              if (value === 'AlwaysAsk' || value === 'MaxViews') this.onRadioChange(value)
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
              value={'MaxViews'}
              key={'MaxViews'}
              control={<Radio />}
              label={'Use max views settings...'}
              disabled={!this.props.editMode}
            />
          </RadioGroup>
        </FormControl>

        { !this.props.test.alwaysAsk &&
          <div className={classes.maxViewsContainer}>
            {this.buildField('maxViewsCount', 'Max views count')}
            {this.buildField('maxViewsDays', 'Number of days')}
            {this.buildField('minDaysBetweenViews', 'Min days between views')}
          </div>
        }
      </>
    )
  }
}

export default withStyles(styles)(MaxViewsEditor);
