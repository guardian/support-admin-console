import React from 'react';
import {
  createStyles,
  FormControl,
  InputLabel,
  Radio,
  RadioGroup,
  Theme,
  withStyles,
  WithStyles
} from "@material-ui/core";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import {TickerCountType, TickerEndType, TickerSettings} from "./epicTestsForm";
import EditableTextField from "../helpers/editableTextField"
import {onFieldValidationChange, ValidationStatus} from "../helpers/validation";

const styles = ({ spacing, typography}: Theme) => createStyles({
  formControl: {
    marginTop: spacing(2),
    marginBottom: spacing(1),
    display: 'block',
  },
  selectLabel: {
    fontSize: typography.pxToRem(22),
    color: 'black',
  },
  radio: {
    paddingTop: '20px',
    marginBottom: '10px'
  },
  fieldsContainer: {
    marginLeft: '30px',
    marginBottom: '20px',
    borderRadius: '4px',
    border: '1px solid #dcdcdc',
    padding: '2px 2px 0px 10px',
  }
});

interface Props extends WithStyles<typeof styles> {
  editMode: boolean,
  tickerSettings?: TickerSettings,
  onChange: (tickerSettings: TickerSettings | undefined) => void,
  onValidationChange: (isValid: boolean) => void
}

interface State {
  validationStatus: ValidationStatus
}

class TickerEditor extends React.Component<Props, State> {

  state: State = {
    validationStatus: {}
  };

  defaultTickerSettings: TickerSettings = {
    endType: TickerEndType.unlimited,
    countType: TickerCountType.money,
    copy: {
      countLabel: 'contributions',
      goalReachedPrimary: 'We\'ve hit our goal!',
      goalReachedSecondary: 'but you can still support us',
    },
    currencySymbol: '$',
  };

  renderFields(tickerSettings: TickerSettings) {
    const classes = this.props.classes;

    const onChange = (updatedTickerSettings: TickerSettings) => this.props.onChange(updatedTickerSettings);
    const onCopyFieldChange = (fieldName: string) => (value: string) =>
      onChange({
        ...tickerSettings,
        copy: {
          ...tickerSettings.copy,
          [fieldName]: value
        }
      });

    const emptyFieldCheck = (value: string): string | null => {
      if (value.trim() === '') return "Field must not be empty";
      else return null;
    };

    const renderTextField = (value: string, fieldName: string, label: string) => (
      <EditableTextField
        text={value}
        label={label}
        onSubmit={onCopyFieldChange(fieldName)}
        editEnabled={this.props.editMode}
        required={true}
        validation={
          {
            getError: emptyFieldCheck,
            onChange: onFieldValidationChange(this)(fieldName)
          }
        }
      />
    );

    return (
      <div className={classes.fieldsContainer}>
        {renderTextField(tickerSettings.copy.countLabel, 'countLabel', 'Count label')}
        {renderTextField(tickerSettings.copy.goalReachedPrimary, 'goalReachedPrimary', 'Goal reached primary text')}
        {renderTextField(tickerSettings.copy.goalReachedSecondary, 'goalReachedSecondary', 'Goal reached secondary text')}

        { tickerSettings.countType === 'money' &&
          <EditableTextField
            text={tickerSettings.currencySymbol}
            label="Currency"
            onSubmit={value => onChange({
              ...tickerSettings,
              currencySymbol: value
            })}
            editEnabled={this.props.editMode}
            required={true}
            validation={
              {
                getError: emptyFieldCheck,
                onChange: onFieldValidationChange(this)('currencySymbol')
              }
            }
          />
        }

        <FormControl
          className={classes.formControl}>
          <InputLabel
            className={classes.selectLabel}
            shrink
            htmlFor="count-type">
            Ticker count type - are we fund-raising or accumulating supporters?
          </InputLabel>
          <RadioGroup
            className={classes.radio}
            value={tickerSettings.countType}
            onChange={(event, value: string) =>
              onChange({
                ...tickerSettings,
                countType: (value as TickerCountType)
              })
            }
          >
            {Object.values(TickerCountType).map(countType =>
              <FormControlLabel
                value={countType}
                key={countType}
                control={<Radio />}
                label={countType}
                disabled={!this.props.editMode}
              />
            )}
          </RadioGroup>
        </FormControl>

        <FormControl
          className={classes.formControl}>
          <InputLabel
            className={classes.selectLabel}
            shrink
            htmlFor="end-type">
            Ticker end type - the behaviour when the goal is reached
          </InputLabel>
          <RadioGroup
            className={classes.radio}
            value={tickerSettings.endType}
            onChange={(event, value: string) =>
              onChange({
                ...tickerSettings,
                endType: (value as TickerEndType)
              })
            }
          >
            {Object.values(TickerEndType).map(endType =>
              <FormControlLabel
                value={endType}
                key={endType}
                control={<Radio />}
                label={endType}
                disabled={!this.props.editMode}
              />
            )}
          </RadioGroup>
        </FormControl>
      </div>
    )
  }

  render() {
    return (
      <>
        <FormControl>
          <FormControlLabel
            control={
              <Switch
                checked={!!this.props.tickerSettings}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  this.props.onChange(event.target.checked ? this.defaultTickerSettings : undefined)
                }
                disabled={!this.props.editMode}
              />
            }
            label={`Ticker is ${!!this.props.tickerSettings ? "on" : "off"}`}
          />
        </FormControl>

        {
          !!this.props.tickerSettings && this.renderFields(this.props.tickerSettings)
        }
      </>
    )
  }
}

export default withStyles(styles)(TickerEditor);
