import React from 'react';

import {
  Theme, createStyles, WithStyles, withStyles, Button, Popover, Dialog, TextField
} from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';
import EditableTextField from '../helpers/editableTextField';
import EnhancedTextField from '../helpers/enhancedTextField';

const styles = ({ spacing }: Theme) => createStyles({
  button: {
    marginRight: spacing(2),
    marginBottom: spacing(2)
  },
  popover: {
    padding: '10px',
    width: '450px'
  },
  dialog: {
    maxWidth: '600px',
    margin: '0 auto',
  }
});

interface NewNameCreatorProps extends WithStyles<typeof styles> {
  existingNames: string[],
  type: 'test' | 'variant',
  action: 'New' | 'Copy',
  onValidName: (name: string, nickname: string) => void,
  editEnabled: boolean,
  initialValue?: string
}

interface NewNameCreatorState {
  currentNameText: string,
  currentNicknameText: string,
  newNamePopoverOpen: boolean,
  anchorElForPopover?: HTMLButtonElement,
  helperText: string,
}

class NewNameCreator extends React.Component<NewNameCreatorProps, NewNameCreatorState> {

  state: NewNameCreatorState = {
    currentNameText: "",
    currentNicknameText: "",
    newNamePopoverOpen: false,
    anchorElForPopover: undefined,
    helperText: "",
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
        helperText: ""
      }
    );
  }

  sethelperText = (message: string): void => {
    this.setState( {helperText: message });
  };

  isDuplicateName = (newName: string): boolean => {
    const newLowerCase: string = newName.toLowerCase();
    const isDuplicate = this.props.existingNames.some(name => name.toLowerCase() === newLowerCase);
    return isDuplicate;
  };

  containsInvalidChars = (newName: string): boolean => {
    return (/[^\w-]/.test(newName));
  };

  hasErrors = (text: string): boolean => {
    if (text === "") {
      this.sethelperText("Name cannot be empty - please enter some text");
      return true;
    } else if (this.isDuplicateName(text)) {
      this.sethelperText("Name already exists - please try another");
      return true;
    } else if (this.containsInvalidChars(text)) {
      this.sethelperText("Only letters, numbers, underscores and hyphens are allowed");
      return true;
    } else {
      return false;
    }
  }

  handleNewTestName = (newTestName: string, newTestNickname: string): void => {
    if (!this.hasErrors(newTestName)) {
      this.closePopover();
      this.props.onValidName(newTestName, newTestNickname);
    }
  }

  handleNewVariantName = (newVariantName: string): void => {
    if (!this.hasErrors(newVariantName)) {
      this.closePopover();
      this.props.onValidName(newVariantName, "");
    }
  }

  showButton = (buttonText: string, onClick: () => void): React.ReactFragment | null => {
    return this.props.editEnabled && (
    <Button onClick={onClick}>{buttonText}</Button>
    )
  }

  render(): React.ReactNode {
    const { classes } = this.props;

    const renderTestNameCreator = () => (
      <>
        <Button variant="contained" color="primary" onClick={this.onNewNameButtonClick} className={classes.button}>
            <AddIcon />
            {this.props.action} {this.props.type}
        </Button>
        <Dialog
          className={classes.dialog}
          open={this.state.newNamePopoverOpen}
          onBackdropClick={this.closePopover}
          fullWidth
        >
          <EnhancedTextField
            label="Test name for dashboard"
            autoFocus
            required
            helperText="Date format: YYYY-MM-DD_TEST_NAME"
          />
          <EnhancedTextField
            label="Nickname"
            required
            helperText="Pick a name for your test that's easy to recognise"
          />
          {this.showButton('Create your test', () => this.handleNewTestName(this.state.currentNameText, this.state.currentNicknameText))}
        </Dialog>
      </>
    );

  const renderVariantNameCreator = () => (
    <>
      <Button variant="contained" color="primary" onClick={this.onNewNameButtonClick} className={classes.button}>
          <AddIcon />
          {this.props.action} {this.props.type}
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
        text={this.props.initialValue ? this.props.initialValue : ""}
        onSubmit={this.handleNewVariantName}
        label={this.props.type[0].toUpperCase() + this.props.type.substr(1,) + " name:"}
        startInEditMode
        autoFocus
        helperText={this.state.helperText}
        editEnabled={true}
      />

      {this.showButton('Cancel', this.closePopover)}
    </div>
  </Popover>
  </>
  );

    return this.props.type === 'test' ? renderTestNameCreator() : renderVariantNameCreator();
  }
}

export default withStyles(styles)(NewNameCreator);
