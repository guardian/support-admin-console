import React from 'react';

import {
  Theme, createStyles, WithStyles, withStyles, Button, Popover, Dialog, TextField
} from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';
import EditableTextField from '../helpers/editableTextField';

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
  },
  textField: {
    margin:'0 auto',
    marginTop: spacing(2),
    marginBottom: spacing(2),
    marginLeft: spacing(3),
    marginRight: spacing(3),
  }
});

interface NewNameCreatorProps extends WithStyles<typeof styles> {
  existingNames: string[],
  existingNicknames: string[],
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
  nameHelperText: string,
  nicknameHelperText: string,
  nameError: boolean,
  nicknameError: boolean,
}

type nameType = 'name' | 'nickname';

class NewNameCreator extends React.Component<NewNameCreatorProps, NewNameCreatorState> {

  messages = {
    defaultNameHelperText: 'Date format: YYYY-MM-DD_TEST_NAME',
    defaultNicknameHelperText: 'Pick a name for your test that\'s easy to recognise',
    errorEmpty: 'Field cannot be empty - please enter some text',
    errorDuplicate: 'Name already exists - please try another',
    errorInvalidChars: 'Only letters, numbers, underscores and hyphens are allowed',
  }

  state: NewNameCreatorState = {
    currentNameText: "",
    currentNicknameText: "",
    newNamePopoverOpen: false,
    anchorElForPopover: undefined,
    nameHelperText: this.messages.defaultNameHelperText,
    nicknameHelperText: this.messages.defaultNicknameHelperText,
    nameError: false,
    nicknameError: false
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
        nameHelperText: ""
      }
    );
  }

  setNameHelperText = (message: string): void => {
    this.setState({nameHelperText: message });
  };

  setNicknameHelperText = (message: string): void => {
    this.setState({nicknameHelperText: message });
  };

  emptyString = (text: string, nameType: nameType): boolean => {
    if (text === "") {
      nameType === 'name' ? this.setNameHelperText(this.messages.errorEmpty) : this.setNicknameHelperText(this.messages.errorEmpty);
      return true;
    }
    return false;
  }

  duplicateName = (newName: string, existingNames: string[], nameType: nameType): boolean => {
    if (existingNames.some(existingName => existingName.toUpperCase() === newName.toUpperCase())) {
      nameType === 'name' ? this.setNameHelperText(this.messages.errorDuplicate) : this.setNicknameHelperText(this.messages.errorDuplicate);
      return true;
    }
    return false;
  };

  invalidChars = (newName: string, nameType: nameType): boolean => {
    if (/[^\w-]/.test(newName)) {
      nameType === 'name' ? this.setNameHelperText(this.messages.errorInvalidChars) : this.setNicknameHelperText(this.messages.errorInvalidChars);
      return true;
    }
    return false;
  };

  nameHasErrors = (name: string): boolean => {
    return this.emptyString(name, 'name') || this.duplicateName(name, this.props.existingNames, 'name') || this.invalidChars(name, 'name');
  }

  nicknameHasErrors = (nickname: string): boolean => {
    return this.emptyString(nickname, 'nickname') || this.duplicateName(nickname, this.props.existingNicknames, 'nickname');
  }

  onNameFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value.toUpperCase();
    this.setState({
      currentNameText: newValue
    })
  };

  onNicknameFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value.toUpperCase();
    this.setState({
      currentNicknameText: newValue
    })
  };

  handleNewTestName = (newTestName: string, newTestNickname: string): void => {
    const nameHasErrors = this.nameHasErrors(newTestName);
    const nicknameHasErrors = this.nicknameHasErrors(newTestNickname);
    if (!nameHasErrors && !nicknameHasErrors) {
      this.setState({
        nameError: false,
        nicknameError: false
      });
      this.closePopover();
      this.props.onValidName(newTestName, newTestNickname);
    } else {
      if (nameHasErrors) {
        this.setState({
          nameError: true
        });
      }
      if (nicknameHasErrors) {
        this.setState({
          nicknameError: true
        })
      }
     }
  }

  handleNewVariantName = (newVariantName: string): void => {
    if (!this.nameHasErrors(newVariantName)) {
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
          <TextField
            label="Full test name"
            autoFocus
            className={classes.textField}
            margin={'normal'}
            variant={'outlined'}
            value={this.state.currentNameText}
            onChange={this.onNameFieldChange}
            helperText={this.state.nameHelperText }
            error={this.state.nameError}
         />
          <TextField
            label="Nickname"
            className={classes.textField}
            margin={'normal'}
            variant={'outlined'}
            value={this.state.currentNicknameText}
            onChange={this.onNicknameFieldChange}
            helperText={this.state.nicknameHelperText}
            error={this.state.nicknameError}
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
        helperText={this.state.nameHelperText}
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
