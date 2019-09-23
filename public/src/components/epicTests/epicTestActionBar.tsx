import React, { ReactElement } from 'react';
import {createStyles, Theme, withStyles, WithStyles, Typography} from "@material-ui/core";
import LockOpenIcon from '@material-ui/icons/LockOpen'
import RefreshIcon from '@material-ui/icons/Refresh';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Button from "@material-ui/core/Button";
import ButtonWithConfirmationPopup from '../helpers/buttonWithConfirmationPopup';
import { LockStatus, ModifiedTests } from './epicTestsForm';

const styles = ({ spacing, typography }: Theme) => createStyles({
 actionBar: {
    marginTop: spacing.unit * 2,
    marginBottom: spacing.unit * 2,
    borderRadius: "5px",
    paddingTop: spacing.unit * 2,
    display: "flex",
    justifyContent: "space-between",
    minHeight: spacing.unit * 9
  },
  actionBarText: {
    fontSize: typography.pxToRem(18),
    marginLeft: spacing.unit * 2,
    marginTop: spacing.unit
  },
  actionBarButtons: {
    marginLeft: spacing.unit * 2,
    marginRight: spacing.unit * 2
  },
  editModeColour: {
    backgroundColor: "#ffe500"
  },
  readOnlyModeColour: {
    backgroundColor: "#dcdcdc"
  },
  modeTag: {
    marginLeft: spacing.unit * 2,
    marginBottom: spacing.unit * 2,
    padding: spacing.unit,
    borderRadius: "5px"
  },
  editModeTagColour: {
    backgroundColor: "#ffbb50"
  },
  readOnlyModeTagColour: {
    backgroundColor: "#f6f6f6"
  },
  modeTagText: {
    fontSize: typography.pxToRem(18),
    fontWeight: typography.fontWeightMedium
  }
});

interface ActionBarProps extends WithStyles<typeof styles> {
  modifiedTests: ModifiedTests,
  lockStatus: LockStatus,
  editMode: boolean,
  requestTakeControl: () => void,
  requestLock: () => void,
  cancel: () => void,
  save: () => void
};

class EpicTestActionBar extends React.Component<ActionBarProps> {

  makeFriendlyDate = (timestamp: string): string => {
    const datetime = new Date(timestamp);
    const hours = `${datetime.getHours() < 10 ? "0" : ""}${datetime.getHours()}`;
    const minutes = `${datetime.getMinutes() < 10 ? "0": ""}${datetime.getMinutes()}`;
    const date = datetime.getDate();
    const month = datetime.getMonth() + 1;
    const year = datetime.getFullYear();

    return `${hours}:${minutes} on ${date}/${month}/${year}`;
  }

  makeFriendlyName = (email: string): string | undefined => {
    const nameArr: RegExpMatchArray | null = email.match(/^([a-z]*)\.([a-z]*).*@.*/);
    return nameArr ? `${nameArr[1][0].toUpperCase()}${nameArr[1].slice(1,)} ${nameArr[2][0].toUpperCase()}${nameArr[2].slice(1,)}` : undefined;
  }

  renderLockedMessageAndButton = (): ReactElement<any> => {
    const friendlyName: string | undefined = this.props.lockStatus.email && this.makeFriendlyName(this.props.lockStatus.email);
    const friendlyTimestamp: string | undefined = this.props.lockStatus.timestamp && this.makeFriendlyDate(this.props.lockStatus.timestamp);
    const {classes} = this.props;
    return (
      <>
        <div className={`${classes.modeTag} ${classes.readOnlyModeTagColour}`}><Typography className={classes.modeTagText}>Read-only (locked)</Typography></div>
        <Typography className={classes.actionBarText}>File locked for editing by {friendlyName} (<a href={"mailto:" + this.props.lockStatus.email}>{this.props.lockStatus.email}</a>) at {friendlyTimestamp}.</Typography>
        <div className={classes.actionBarButtons}>
          <ButtonWithConfirmationPopup
            buttonText="Take control"
            confirmationText={`Are you sure? Please tell ${friendlyName} that their unpublished changes will be lost.`}
            onConfirm={this.props.requestTakeControl}
            icon={<LockOpenIcon />}
            color={'primary'}
          />
        </div>
      </>
    )
  };

  renderEditButton = (): ReactElement<any> => {
    const {classes} = this.props;

    return (
      <>
        <div className={`${classes.modeTag} ${classes.readOnlyModeTagColour}`}><Typography className={classes.modeTagText}>Read-only mode</Typography></div>
        <Typography className={classes.actionBarText}>Click the button on the right to create and edit tests.</Typography>
        <div className={classes.actionBarButtons}>
          <Button
            onClick={this.props.requestLock}
            variant="contained"
            color="primary"
          >
            Create & edit tests
          </Button>
        </div>
      </>
    );
  };

  renderPublishButtons = (): ReactElement<any> => {
    const {classes} = this.props;
    const unmodified = Object.keys(this.props.modifiedTests).length === 0;

    return (
    <>
      <div className={`${classes.modeTag} ${classes.editModeTagColour}`}><Typography className={classes.modeTagText}>Edit mode</Typography></div>
      <div><Typography className={classes.actionBarText}>WARNING: Any changes you make will be lost if you refresh the page.</Typography></div>
      <div className={classes.actionBarButtons}>
        <ButtonWithConfirmationPopup
        buttonText="Save all"
        confirmationText={this.buildConfirmationText(this.props.modifiedTests)}
        onConfirm={this.props.save}
        icon={<CloudUploadIcon />}
        disabled={
          unmodified ||
          Object.keys(this.props.modifiedTests).some(name =>
            !this.props.modifiedTests[name].isValid && !this.props.modifiedTests[name].isDeleted
          )
        }
        color={'primary'}
        />
        <ButtonWithConfirmationPopup
        buttonText={unmodified ? "Cancel" : "Discard"}
        confirmationText={`Are you sure? ${unmodified ? "" : "All new, modified and deleted tests will be lost!"}`}
        onConfirm={this.props.cancel}
        icon={<RefreshIcon />}
        color={'primary'}
        />
      </div>
    </>
  );
  };

  buildConfirmationText = (modifiedTests: ModifiedTests): ReactElement<any> => {
    const counts = {
      deleted: 0,
      created: 0,
      modified: 0
    };
    Object.keys(modifiedTests).forEach(key => {
      if (modifiedTests[key].isDeleted) counts.deleted++;
      else if (modifiedTests[key].isNew) counts.created++;
      else counts.modified++;
    });

    const statusLine = (status: 'deleted' | 'created' | 'modified') => counts[status] > 0 &&
      <span>
        <br />&bull; {`${counts[status]} test${counts[status] !== 1 ? "s" : ""} ${status}`}
      </span>;

    return (
      <>
      Are you sure you want to save these changes?
        {statusLine('deleted')}
        {statusLine('created')}
        {statusLine('modified')}
      </>
    );
  };

  render(): ReactElement<any> {
    const {classes} = this.props;
    const classNames = [
      classes.actionBar,
      this.props.editMode && classes.editModeColour,
      !this.props.editMode && classes.readOnlyModeColour
    ].join(' ');

    return (
      <div className={classNames}>
        {!this.props.editMode ? (
          this.props.lockStatus.locked ? this.renderLockedMessageAndButton() : this.renderEditButton()
        ) : this.renderPublishButtons()}
      </div>
    )
  }
}

export default withStyles(styles)(EpicTestActionBar);
