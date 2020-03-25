import React from 'react';
import {createStyles, Theme, withStyles, WithStyles, Typography} from "@material-ui/core";
import TextField from '@material-ui/core/TextField';

const styles = ({ typography, spacing }: Theme) => createStyles({
  container: {
    marginLeft: 0,
    marginRight: "8px",
    display: "flex",
    "justify-content": "space-between"
  },
  numberContainer: {
    width: "40%"
  },
  textContainer: {
    width: "100%"
  },
  formControl: {
    marginTop: spacing(2),
    marginBottom: spacing(1),
    marginRight: spacing(1),
    width: "100%"
  },
  label: {
    fontSize: typography.pxToRem(22),
    fontWeight: typography.fontWeightMedium,
    color: "black"
  },
  button: {
    marginTop: "30px",
    height: "36px"
  }
});

interface Validation {
  getError: (value: string) => string | null, //return null if no errors
  onChange: (valid: boolean) => void  //called every time the validation status of this field changes
}

interface EditableTextFieldProps extends WithStyles<typeof styles> {
  text: string,
  label: string,
  textarea?: boolean,
  onSubmit: (updatedText: string) => void,
  errorMessage?: string,
  helperText?: string,
  autoFocus?: boolean,
  required?: boolean,
  editEnabled: boolean,
  validation?: Validation
  isNumberField?: boolean
}

interface EditableTextFieldState {
  currentText: string
}

class EditableTextField extends React.Component<EditableTextFieldProps, EditableTextFieldState> {

  state: EditableTextFieldState = {
    currentText: this.props.text
  };

  componentDidMount() {
    if (this.props.validation) {
      // Report initial validation status
      this.props.validation.onChange(this.isValid())
    }
  }

  componentDidUpdate(prevProps: EditableTextFieldProps) {
    if (prevProps.text !== this.props.text) {
      this.setState({
        currentText: this.props.text
      })
    }
  }

  isValid = (): boolean =>
    !this.props.validation ||
    this.props.validation.getError(this.state.currentText) === null;

  onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;

    this.setState({
      currentText: newValue
    });
  };

  onExitField = (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    if (this.props.validation) {
      this.props.validation.onChange(this.isValid());
    }

    this.props.onSubmit(this.state.currentText);
  };

  render(): React.ReactNode {
    const {classes} = this.props;

    const error: string | null | undefined = this.props.errorMessage ||
      (this.props.validation && this.props.validation.getError(this.state.currentText));

    return (
      <>
        <div className={`${classes.container} ${this.props.isNumberField ? classes.numberContainer : classes.textContainer}`}>
            <TextField
              className={classes.formControl}
              label={this.props.label}
              variant={'outlined'}
              required={this.props.required}
              multiline={this.props.textarea}
              fullWidth
              name={this.props.label}
              disabled={!this.props.editEnabled}
              value={this.state.currentText}
              onChange={this.onChange}
              helperText={error ? error : this.props.helperText}
              autoFocus={this.props.autoFocus}
              error={this.props.validation ? !this.isValid() : false}
              onBlur={this.onExitField}
            />
        </div>
      </>

    )
  }
}

export default withStyles(styles)(EditableTextField);
