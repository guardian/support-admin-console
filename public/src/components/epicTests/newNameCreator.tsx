import React from 'react';

import {
  List, ListItem, Theme, createStyles, WithStyles, withStyles, Button, Popover
} from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';
import EditableTextField from '../helpers/editableTextField';

const styles = ({ spacing }: Theme) => createStyles({
  button: {
    marginRight: spacing.unit * 2,
    marginBottom: spacing.unit * 2
  }
});

interface NewNameCreatorProps extends WithStyles<typeof styles> {
  existingNames: string[],
  text: string,
  onValidName: (name: string) => void
}

interface NewNameCreatorState {
  newTestPopoverOpen: boolean,
  anchorElForPopover?: HTMLAnchorElement,
  errorMode: boolean
}

class NewNameCreator extends React.Component<NewNameCreatorProps, NewNameCreatorState> {

  state = {
    newTestPopoverOpen: false,
    anchorElForPopover: undefined,
    errorMode: false
  }

  onNewTestButtonClick = (event: any) =>  {
    this.setState({
      newTestPopoverOpen: true,
      anchorElForPopover: event.currentTarget
    })
  }

  handleCancel = () => {
    this.setState({ newTestPopoverOpen: false });
  }

  isDuplicateName = (newName: string) => {
    const isDuplicate = this.props.existingNames.includes(newName);
    return isDuplicate;
  }

  handleName = (newTestName: string) => {
    if (this.isDuplicateName(newTestName)) {
      this.setState( { errorMode: true })
      return;
    } else {
      this.setState({ newTestPopoverOpen: false })
      this.props.onValidName(newTestName);
    }
  }

  render(): React.ReactNode {
    const { classes } = this.props;

    return (
      <div>
        <Button variant="contained" color="primary" onClick={this.onNewTestButtonClick} className={classes.button}>
            <AddIcon />
            New {this.props.text}
          </Button>
          <Popover
            open={this.state.newTestPopoverOpen}
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
            <EditableTextField
              text=""
              onSubmit={this.handleName}
              label={this.props.text[0].toUpperCase() + this.props.text.substr(1,) + " name:"}
              startInEditMode
              autoFocus
              errorMessage={this.state.errorMode ? "Name already exists - please try another" : ""}
            />
            <Button onClick={this.handleCancel}>Cancel</Button>
          </Popover>
    </div>
    )
  }
}

export default withStyles(styles)(NewNameCreator);
