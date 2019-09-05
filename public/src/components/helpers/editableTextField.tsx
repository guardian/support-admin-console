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
    marginRight: spacing.unit,
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
  required?: boolean,
  editEnabled: boolean
}

interface EditableTextFieldState {
  fieldEditMode: boolean,
  currentText: string,
}

class EditableTextField extends React.Component<EditableTextFieldProps, EditableTextFieldState> {

  state: EditableTextFieldState =  {
        fieldEditMode: this.props.startInEditMode || false,
        currentText: this.props.text,
      }

  componentDidUpdate(prevProps: EditableTextFieldProps) {
    if (prevProps.text !== this.props.text) {
      this.setState({
        fieldEditMode: false,
        currentText: this.props.text
      })
    }
  }

  onClickButton = (): void => {
    if (this.state.fieldEditMode) {
      this.props.onSubmit(this.state.currentText);

      this.setState({
        fieldEditMode: false
      });
    } else {
      this.setState({
        fieldEditMode: true
      });
    }
  };

  showButton = (): React.ReactFragment | null => {
    const {classes} = this.props;
    return this.props.editEnabled && (
      <Button
      className={classes.button}
      type="submit"
      variant="contained"
      color="primary"
      onClick={this.onClickButton}>
        {this.state.fieldEditMode ? <SaveIcon /> : <EditIcon />}
      </Button>
    )
  }

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
              disabled={!this.state.fieldEditMode}
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
         {this.showButton()}
        </div>
        <Typography color={'error'} variant={'body2'}>{this.props.errorMessage}</Typography>
      </>

    )
  }
}

export default withStyles(styles)(EditableTextField);
