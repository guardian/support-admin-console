import React from 'react';

import {
  Theme, createStyles, WithStyles, withStyles, Button, Dialog, TextField, IconButton
} from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';
import CancelIcon from '@material-ui/icons/Cancel';

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
  },
  topDialog: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
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

type NameType = 'name' | 'nickname';
type ErrorType = 'empty' | 'duplicate' | 'invalid';

class NewNameCreator extends React.Component<NewNameCreatorProps, NewNameCreatorState> {

  nameMessages = {
    test: 'Date format: YYYY-MM-DD_TEST_NAME',
    variant: 'Format: \'control\' or \'v1_name\''
  }

  messages = {
    default: {
      name: this.props.type === 'test' ? this.nameMessages.test : this.nameMessages.variant,
      nickname: 'Pick a name for your test that\'s easy to recognise',
    },
    error: {
      empty: 'Field cannot be empty - please enter some text',
      duplicate: 'Name already exists - please try another',
      invalid: 'Only letters, numbers, underscores and hyphens are allowed',
    },
  }

  defaultState: NewNameCreatorState = {
    currentNameText: "",
    currentNicknameText: "",
    newNamePopoverOpen: false,
    anchorElForPopover: undefined,
    nameHelperText: this.messages.default.name,
    nicknameHelperText: this.messages.default.nickname,
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

  closeDialog = (): void => {
    this.resetState();
  }

  setNameHelperText = (message: string): void => {
    this.setState({nameHelperText: message });
  };

  setNicknameHelperText = (message: string): void => {
    this.setState({nicknameHelperText: message });
  };

  setErrorText = (errorType: ErrorType, nameType: NameType) => {
    const errorMessage = this.messages.error[errorType];
    nameType === 'name' ? this.setNameHelperText(errorMessage) : this.setNicknameHelperText(errorMessage);
  }

  setDefaultText = (nameType: NameType) => {
    nameType === 'name' ? this.setNameHelperText(this.messages.default.name) : this.setNicknameHelperText(this.messages.default.nickname);
  }

  emptyString = (text: string, nameType: NameType): boolean => {
    if (text === "") {
      this.setErrorText('empty', nameType);
      return true;
    } else {
      this.setDefaultText(nameType) ;
      return false;
    }
  }

  duplicateName = (newName: string, existingNames: string[], nameType: NameType): boolean => {
    if (existingNames.some(existingName => existingName.toUpperCase() === newName.toUpperCase())) {
      this.setErrorText('duplicate', nameType);
      return true;
    } else {
      this.setDefaultText(nameType);
      return false;
    }
  };

  invalidChars = (newName: string, nameType: NameType): boolean => {
    if (/[^\w-]/.test(newName)) {
      this.setErrorText('invalid', nameType);
      return true;
    } else {
      this.setDefaultText(nameType);
      return false;
    }
  };

  hasErrors = (newName: string, nameType: NameType): boolean => {
    return nameType === 'name' ?
      this.emptyString(newName, nameType) || this.duplicateName(newName, this.props.existingNames, nameType) || this.invalidChars(newName, nameType)
    :
      this.emptyString(newName, nameType) || this.duplicateName(newName, this.props.existingNicknames, nameType);
  }

  onFieldChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, nameType: NameType) => {
    const newValue = event.target.value.toUpperCase();
    if (nameType === 'name') {
      this.setState({
        currentNameText: newValue,
        nameError: false
      });
    } else {
      this.setState({
        currentNicknameText: newValue,
        nicknameError: false
      })
    }
    this.setDefaultText(nameType);
  }

  handleNewTestName = (newTestName: string, newTestNickname: string): void => {
    const nameHasErrors = this.hasErrors(newTestName, 'name')
    const nicknameHasErrors = this.hasErrors(newTestNickname, 'nickname');
    if (!nameHasErrors && !nicknameHasErrors) {
      this.setState({
        nameError: false,
        nicknameError: false
      });
      this.closeDialog();
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
    if (!this.hasErrors(newVariantName, 'name')) {
      this.closeDialog();
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
          onChange={(event) => this.onFieldChange(event, 'nickname')}
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
          onBackdropClick={this.closeDialog}
          fullWidth
        >
          <div className={classes.topDialog}>
            <IconButton
              color={'primary'}
              onClick={() => this.closeDialog()}
              children={<CancelIcon
              />}
            />
          </div>

          <TextField
            label={this.props.type === 'test' ? 'Full test name' : 'Variant name'}
            autoFocus
            className={classes.textField}
            margin={'normal'}
            variant={'outlined'}
            value={this.state.currentNameText}
            onChange={(event) => this.onFieldChange(event, 'name')}
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
