import React from 'react';
import {createStyles, Theme, withStyles, WithStyles, Typography, FormControl, InputLabel} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import TextField from '@material-ui/core/TextField';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';

const styles = ({ typography, spacing }: Theme) => createStyles({
  container: {
    marginLeft: 0,
    marginRight: "8px",
    width: "100%",
    display: "flex",
    "justify-content": "space-between"
  },
  formControl: {
    marginTop: spacing.unit * 2,
    marginBottom: spacing.unit,
    width: "100%"
  },
  label: {
    fontSize: typography.pxToRem(22),
    fontWeight: typography.fontWeightMedium,
    color: "black"
  },
  textField: {
    marginTop: "20px"
  },
  button: {
    marginTop: "30px",
    height: "36px"
  }
});

interface EditableTextFieldProps extends WithStyles<typeof styles> {
  text: string,
  label: string,
  textarea?: boolean,
  onSubmit: (updatedText: string) => void,
  startInEditMode?: boolean,
  errorMessage?: string,
  helperText?: string,
  autoFocus?: boolean,
  required?: boolean
}

interface EditableTextFieldState {
  editMode: boolean,
  currentText: string
}

class EditableTextField extends React.Component<EditableTextFieldProps, EditableTextFieldState> {

  state: EditableTextFieldState =  {
        editMode: this.props.startInEditMode || false,
        currentText: this.props.text
      }

  componentDidUpdate(prevProps: EditableTextFieldProps) {
    // If a different test is selected or 'refresh' is clicked then we should reset the field based on the new props
    // TODO - if text is empty then editMode is not unset. This needs a better solution
    if (prevProps.text !== this.props.text) {
      // if (prevProps.text !== this.props.text || prevProps.text === "") {
      this.setState({
        editMode: false,
        currentText: this.props.text
      })
    }
  }

  onClickButton = (): void => {
    if (this.state.editMode) {
      this.props.onSubmit(this.state.currentText);

      this.setState({
        editMode: false
      });
    } else {
      this.setState({
        editMode: true
      });
    }
  };

  render(): React.ReactNode {
    const {classes} = this.props;


    return (
      <>
        <div className={classes.container}>
          <FormControl
            required={this.props.required}
            className={classes.formControl}
          >
            <InputLabel
              className={classes.label}
              shrink
            >
              {this.props.label}
            </InputLabel>
            <TextField
              className={classes.textField}
              multiline={this.props.textarea}
              fullWidth
              name={this.props.label}
              disabled={!this.state.editMode}
              value={this.state.currentText}
              onChange={event => {
                const newValue = event.target.value;
                this.setState({
                  currentText: newValue
                })
              }}
              helperText={this.props.helperText}
              autoFocus={this.props.autoFocus}
            />
          </FormControl>
          <Button
            className={classes.button}
            type="submit"
            variant="contained"
            color="primary"
            onClick={this.onClickButton}>
              {this.state.editMode ? <SaveIcon /> : <EditIcon />}
            </Button>
        </div>
        <Typography color={'error'} variant={'body2'}>{this.props.errorMessage}</Typography>
      </>

    )
  }
}

export default withStyles(styles)(EditableTextField);
