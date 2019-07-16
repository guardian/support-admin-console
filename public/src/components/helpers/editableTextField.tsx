import React from 'react';
import {createStyles, Theme, withStyles, WithStyles} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import TextField from '@material-ui/core/TextField';
import InputLabel from "@material-ui/core/InputLabel";

const styles = ({ palette, spacing, mixins }: Theme) => createStyles({
});

interface Props extends WithStyles<typeof styles> {
  text: string,
  label: string,
  onSubmit: (updatedText: string) => void
}

interface EditableTextFieldState {
  editMode: boolean,
  currentText: string
}

class EditableTextField extends React.Component<Props, EditableTextFieldState> {
  state: EditableTextFieldState;

  constructor(props: Props) {
    super(props);
    this.state = {
      editMode: false,
      currentText: this.props.text
    }
  }

  onClickButton = (): void => {
    if (this.state.editMode) {
      this.props.onSubmit(this.state.currentText);

      this.setState((prevState) => {
        return {
          ...prevState,
          editMode: false
        }
      });
    } else {
      this.setState((prevState) => {
        return {
          ...prevState,
          editMode: true
        }
      });
    }
  };

  render(): React.ReactNode {
    return (
      <div>
        <InputLabel htmlFor={this.props.label}>
          {this.props.label}
        </InputLabel>
        <TextField
          id={this.props.label}
          disabled={!this.state.editMode}
          value={this.state.currentText}
          onChange={event => {
            const newValue = event.target.value;
            this.setState((prevState) => {
              return {
                ...prevState,
                currentText: newValue
              }
            })
          }}
        />
        <Button onClick={this.onClickButton}>{this.state.editMode ? "Save" : "Edit"}</Button>
      </div>
    )
  }
}

export default withStyles(styles)(EditableTextField);
