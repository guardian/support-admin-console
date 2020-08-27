import React from "react";
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles,
  Typography,
} from "@material-ui/core";
import TextField from "@material-ui/core/TextField";

const styles = ({ typography, spacing }: Theme) =>
  createStyles({
    label: {
      fontSize: typography.pxToRem(22),
      fontWeight: typography.fontWeightMedium,
      color: "black",
    },
    button: {
      marginTop: "30px",
      height: "36px",
    },
  });

interface Validation {
  getError: (value: string) => string | null; //return null if no errors
  onChange: (valid: boolean) => void; //called every time the validation status of this field changes
}

type Variant = "outlined" | "filled";

interface EditableTextFieldProps extends WithStyles<typeof styles> {
  text: string;
  label: string;
  textarea?: boolean;
  height?: number;
  onSubmit: (updatedText: string) => void;
  errorMessage?: string;
  helperText?: string;
  autoFocus?: boolean;
  required?: boolean;
  editEnabled: boolean;
  validation?: Validation;
  isNumberField?: boolean;
  variant?: Variant;
  fullWidth?: boolean;
}

interface EditableTextFieldState {
  currentText: string;
}

class EditableTextField extends React.Component<
  EditableTextFieldProps,
  EditableTextFieldState
> {
  state: EditableTextFieldState = {
    currentText: this.props.text,
  };

  componentDidMount() {
    if (this.props.validation) {
      // Report initial validation status
      this.props.validation.onChange(this.isValid());
    }
  }

  componentDidUpdate(prevProps: EditableTextFieldProps) {
    if (prevProps.text !== this.props.text) {
      this.setState({
        currentText: this.props.text,
      });
    }
  }

  isValid = (): boolean =>
    !this.props.validation ||
    this.props.validation.getError(this.state.currentText) === null;

  onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;

    this.setState({
      currentText: newValue,
    });
  };

  onExitField = (
    event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    if (this.props.validation) {
      this.props.validation.onChange(this.isValid());
    }

    this.props.onSubmit(this.state.currentText);
  };

  render(): React.ReactNode {
    const error =
      this.props.errorMessage ||
      (this.props.validation &&
        this.props.validation.getError(this.state.currentText));

    return (
      <TextField
        label={this.props.label}
        variant={this.props.variant || "outlined"}
        required={this.props.required}
        multiline={this.props.textarea}
        rows={this.props.height}
        fullWidth={this.props.fullWidth}
        name={this.props.label}
        disabled={!this.props.editEnabled}
        value={this.state.currentText}
        onChange={this.onChange}
        helperText={error ? error : this.props.helperText}
        autoFocus={this.props.autoFocus}
        error={error ? true : false}
        onBlur={this.onExitField}
      />
    );
  }
}

export default withStyles(styles)(EditableTextField);
