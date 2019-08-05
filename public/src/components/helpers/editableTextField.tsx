import React from 'react';
import {createStyles, Theme, withStyles, WithStyles} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import TextField from '@material-ui/core/TextField';
import FormControlLabel from "@material-ui/core/FormControlLabel";
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';

const styles = ({ palette, spacing, mixins }: Theme) => createStyles({
  label: {
    marginRight: "8px",
    fontWeight: "bold",
    width: "180px"
  },
  container: {
    marginLeft: 0,
    marginRight: "8px",
    width: "80%"
  },
  row: {
    margin: "10px 0 0 10px"
  }
});

interface Props extends WithStyles<typeof styles> {
  text: string,
  label: string,
  textarea?: boolean,
  onSubmit: (updatedText: string) => void
}

interface EditableTextFieldState {
  editMode: boolean,
  currentText: string
}

class EditableTextField extends React.Component<Props, EditableTextFieldState> {

  state: EditableTextFieldState =  {
        editMode: false,
        currentText: this.props.text
      }

  componentDidUpdate(prevProps: Props) {
    // If a different test is selected or 'refresh' is clicked then we should reset the field based on the new props
    // TODO - if text is empty then editMode is not unset. This needs a better solution
    if (prevProps.text !== this.props.text) {
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
      <div className={classes.row}>
        <FormControlLabel
          className={classes.container}
          control={
            <TextField
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
            />
          }
          label={this.props.label}
          labelPlacement="start"
          classes={{
            label: classes.label
          }}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          onClick={this.onClickButton}>
            {this.state.editMode ? <SaveIcon /> : <EditIcon />}
        </Button>
      </div>

    )
  }
}

export default withStyles(styles)(EditableTextField);
