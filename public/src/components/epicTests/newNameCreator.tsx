import React from 'react';

import {
  Theme, createStyles, WithStyles, withStyles, Button, Dialog, TextField
} from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';

const styles = ({ spacing }: Theme) => createStyles({
  newButton: {
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
    marginTop: spacing(2),
    marginBottom: spacing(2),
    marginLeft: spacing(3),
    marginRight: spacing(3),
  },
  createButton: {
    marginTop: spacing(1),
    marginBottom: spacing(2),
    marginLeft: 'auto',
    marginRight: 'auto',
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
    defaultNameHelperText: this.props.type === 'test' ? 'Date format: YYYY-MM-DD_TEST_NAME' : '',
    defaultNicknameHelperText: 'Pick a name for your test that\'s easy to recognise',
    errorEmpty: 'Field cannot be empty - please enter some text',
    errorDuplicate: 'Name already exists - please try another',
    errorInvalidChars: 'Only letters, numbers, underscores and hyphens are allowed',
  }

  defaultState: NewNameCreatorState = {
    currentNameText: "",
    currentNicknameText: "",
    newNamePopoverOpen: false,
    anchorElForPopover: undefined,
    nameHelperText: this.messages.defaultNameHelperText,
    nicknameHelperText: this.messages.defaultNicknameHelperText,
    nameError: false,
    nicknameError: false
  }

  state: NewNameCreatorState = this.defaultState;


  resetState = (): void => {
    this.setState(this.defaultState);
  }

  onNewNameButtonClick = (event: React.MouseEvent<HTMLButtonElement>): void =>  {
    this.setState({
      newNamePopoverOpen: true,
      anchorElForPopover: event.currentTarget
    });
  }

  closePopover = (): void => {
    this.resetState();
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
    } else {
      nameType === 'name' ? this.setNameHelperText(this.messages.defaultNameHelperText) : this.setNicknameHelperText(this.messages.defaultNicknameHelperText);
      return false;
    }
  }

  duplicateName = (newName: string, existingNames: string[], nameType: nameType): boolean => {
    if (existingNames.some(existingName => existingName.toUpperCase() === newName.toUpperCase())) {
      nameType === 'name' ? this.setNameHelperText(this.messages.errorDuplicate) : this.setNicknameHelperText(this.messages.errorDuplicate);
      return true;
    } else {
      nameType === 'name' ? this.setNameHelperText(this.messages.defaultNameHelperText) : this.setNicknameHelperText(this.messages.defaultNicknameHelperText);
      return false;
    }
  };

  invalidChars = (newName: string, nameType: nameType): boolean => {
    if (/[^\w-]/.test(newName)) {
      nameType === 'name' ? this.setNameHelperText(this.messages.errorInvalidChars) : this.setNicknameHelperText(this.messages.errorInvalidChars);
      return true;
    } else {
      nameType === 'name' ? this.setNameHelperText(this.messages.defaultNameHelperText) : this.setNicknameHelperText(this.messages.defaultNicknameHelperText);
      return false;
    }
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
      } else {
        this.setState({
          nameError: false
        });
      }
      if (nicknameHasErrors) {
        this.setState({
          nicknameError: true
        });
      } else {
        this.setState({
          nicknameError: false
        });
      }
    }
  }

  handleNewVariantName = (newVariantName: string): void => {
    if (!this.nameHasErrors(newVariantName)) {
      this.closePopover();
      this.props.onValidName(newVariantName, "");
    }
  }

  showCreateButton = (buttonText: string, onClick: () => void): React.ReactFragment | null => {
    return this.props.editEnabled && (
      <Button
        className={this.props.classes.createButton}
        onClick={onClick}
        color={'primary'}
        variant={'contained'}
        size={'medium'}
      >
        {buttonText}
      </Button>
    )
  }

  render(): React.ReactNode {
    const { classes } = this.props;

    const renderNicknameFieldAndButton = (): React.ReactNode => (
      <>
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
        {this.showCreateButton('Create your test', () => this.handleNewTestName(this.state.currentNameText, this.state.currentNicknameText))}
      </>
    );

    const renderVariantButton = (): React.ReactNode => this.showCreateButton('Create variant', () => this.handleNewVariantName(this.state.currentNameText));

    return (
      <>
        <Button variant="contained" color="primary" onClick={this.onNewNameButtonClick} className={classes.newButton}>
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
            label={this.props.type === 'test' ? 'Full test name' : 'Variant name'}
            autoFocus
            className={classes.textField}
            margin={'normal'}
            variant={'outlined'}
            value={this.state.currentNameText}
            onChange={this.onNameFieldChange}
            helperText={this.state.nameHelperText}
            error={this.state.nameError}
         />
         {this.props.type === 'test' ? renderNicknameFieldAndButton() : renderVariantButton()}

        </Dialog>
      </>
    );
  }
}

export default withStyles(styles)(NewNameCreator);
