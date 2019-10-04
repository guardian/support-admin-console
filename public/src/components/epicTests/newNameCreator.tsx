import React from 'react';

import {
  Theme, createStyles, WithStyles, withStyles, Button, Popover
} from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';
import EditableTextField from '../helpers/editableTextField';

const styles = ({ spacing }: Theme) => createStyles({
  button: {
    marginRight: spacing(2),
    marginBottom: spacing(2)
  },
  popover: {
    padding: "10px",
    width: "450px"
  }
});

interface NewNameCreatorProps extends WithStyles<typeof styles> {
  existingNames: string[],
  text: string,
  onValidName: (name: string) => void,
  editEnabled: boolean
}

interface NewNameCreatorState {
  newNamePopoverOpen: boolean,
  anchorElForPopover?: HTMLButtonElement,
  errorMessage: string
}

class NewNameCreator extends React.Component<NewNameCreatorProps, NewNameCreatorState> {

  state: NewNameCreatorState = {
    newNamePopoverOpen: false,
    anchorElForPopover: undefined,
    errorMessage: ""
  }

  onNewNameButtonClick = (event: React.MouseEvent<HTMLButtonElement>): void =>  {
    this.setState({
      newNamePopoverOpen: true,
      anchorElForPopover: event.currentTarget
    });
  }

  closePopover = (): void => {
    this.setState(
      {
        newNamePopoverOpen: false,
        errorMessage: ""
      }
    );
  }

  setErrorMessage = (message: string): void => {
    this.setState( {errorMessage: message });
  };

  isDuplicateName = (newName: string): boolean => {
    const newLowerCase: string = newName.toLowerCase();
    const isDuplicate = this.props.existingNames.some(name => name.toLowerCase() === newLowerCase);
    return isDuplicate;
  };

  containsInvalidChars = (newName: string): boolean => {
    return (/[^\w-]/.test(newName));
  };

  handleName = (newTestName: string): void => {
    if (newTestName === "") {
      this.setErrorMessage("Name cannot be empty - please enter some text");
    } else if (this.isDuplicateName(newTestName)) {
      this.setErrorMessage("Name already exists - please try another");
    } else if (this.containsInvalidChars(newTestName)) {
      this.setErrorMessage("Only letters, numbers, underscores and hyphens are allowed");
    } else {
      this.closePopover();
      this.props.onValidName(newTestName);
    }
  }

  showButton = (): React.ReactFragment | null => {
    return this.props.editEnabled && (
      <Button onClick={this.closePopover}>Cancel</Button>
    )
  }

  render(): React.ReactNode {
    const { classes } = this.props;

    return (
      <div>
        <Button variant="contained" color="primary" onClick={this.onNewNameButtonClick} className={classes.button}>
            <AddIcon />
            New {this.props.text}
        </Button>
        <Popover
          open={this.state.newNamePopoverOpen}
          anchorEl={this.state.anchorElForPopover}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}

        >
      <div className={classes.popover}>
        <EditableTextField
          required
          text=""
          onSubmit={this.handleName}
          label={this.props.text[0].toUpperCase() + this.props.text.substr(1,) + " name:"}
          startInEditMode
          autoFocus
          errorMessage={this.state.errorMessage}
          editEnabled={true}
        />
        {this.showButton()}
      </div>
    </Popover>
    </div>
    )
  }
}

export default withStyles(styles)(NewNameCreator);
