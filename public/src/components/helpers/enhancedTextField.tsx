import React from 'react';
import {createStyles, Theme, withStyles, WithStyles, TextField} from "@material-ui/core";

const styles = ({ spacing }: Theme) => createStyles({
  textField: {
    margin:'0 auto',
    marginTop: spacing(3),
    marginBottom: spacing(3),
    marginLeft: spacing(3),
    marginRight: spacing(3),
  }
});

interface Validation {
  getError: (value: string) => string | null, //return null if no errors
  onChange: (valid: boolean) => void  //called every time the validation status of this field changes
}

interface EnhancedTextFieldProps extends WithStyles<typeof styles> {
  label: string,
  errorMessage?: string,
  helperText?: string,
  autoFocus?: boolean,
  required?: boolean,
  validation?: Validation,
}

interface EnhancedTextFieldState {
  currentText: string,
  error: boolean,
  helperText: string | undefined,
}

class EnhancedTextField extends React.Component<EnhancedTextFieldProps, EnhancedTextFieldState> {

  state: EnhancedTextFieldState =  {
    currentText: "",
    error: false,
    helperText: this.props.helperText,
  };

  isValid = (): boolean =>
    !this.props.validation ||
    this.props.validation.getError(this.state.currentText) === null;

  onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;

    this.setState({
      currentText: newValue
    })
  };

  render(): React.ReactNode {
    const {classes} = this.props;

    const error = this.props.errorMessage ||
      (this.props.validation && this.props.validation.getError(this.state.currentText));

    return (
      <>
        <TextField
          label={this.props.label}
          autoFocus={this.props.autoFocus}
          className={classes.textField}
          margin={'normal'}
          variant={'outlined'}
          value={this.state.currentText}
          onChange={this.onChange}
          helperText={this.state.helperText}
          error={this.props.validation ? !this.isValid() : false}
        />
      </>
    )
  }
}

export default withStyles(styles)(EnhancedTextField);
