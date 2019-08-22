import React from 'react';

import {
  Theme, createStyles, WithStyles, withStyles, Button, Popover
} from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';
import EditableTextField from '../helpers/editableTextField';

const styles = ({ spacing }: Theme) => createStyles({
  button: {
    marginRight: spacing.unit * 2,
    marginBottom: spacing.unit * 2
  },
  popover: {
    padding: "10px",
    width: "450px"
  }
});

interface NewNameCreatorProps extends WithStyles<typeof styles> {
  existingNames: string[],
  text: string,
  onValidName: (name: string) => void
}

interface NewNameCreatorState {
  newNamePopoverOpen: boolean,
  anchorElForPopover?: HTMLAnchorElement,
  errorMessage: string
}

class NewNameCreator extends React.Component<NewNameCreatorProps, NewNameCreatorState> {

  state: NewNameCreatorState = {
    newNamePopoverOpen: false,
    anchorElForPopover: undefined,
    errorMessage: ""
  }

  onNewTestButtonClick = (event: any) =>  {
    this.setState({
      newNamePopoverOpen: true,
      anchorElForPopover: event.currentTarget
    })
  }

  handleCancel = () => {
    this.setState({ newNamePopoverOpen: false });
  }

  isDuplicateName = (newName: string) => {
    const isDuplicate = this.props.existingNames.includes(newName);
    return isDuplicate;
  }

  handleName = (newTestName: string) => {
    if (newTestName === "") {
      this.setState( { errorMessage: "Name cannot be empty - please enter some text"});
      return;
    }
    else if (this.isDuplicateName(newTestName)) {
      this.setState( { errorMessage: "Name already exists - please try another" });
      return;
    } else {
      this.setState({ newNamePopoverOpen: false })
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
              />
              <Button onClick={this.handleCancel}>Cancel</Button>
            </div>
          </Popover>
    </div>
    )
  }
}

export default withStyles(styles)(NewNameCreator);
