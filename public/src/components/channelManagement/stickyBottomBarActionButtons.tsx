import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core';

import CloseIcon from '@material-ui/icons/Close';
import SaveIcon from '@material-ui/icons/Save';
import EditIcon from '@material-ui/icons/Edit';
import LockIcon from '@material-ui/icons/Lock';

import useOpenable from '../../hooks/useOpenable';

const useStyles = makeStyles(({ spacing }: Theme) => ({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  leftContainer: {},
  rightContainer: {
    '& > * + *': {
      marginLeft: spacing(1),
    },
  },
  button: {
    color: 'white',
    borderColor: 'white',
  },
  buttonText: {
    fontSize: '14px',
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
}));

const SAVE_BUTTON_TEST_SELECTED_TEXT = 'Save test';
const SAVE_BUTTON_TEST_NOT_SELECTED_TEXT = 'Save changes';

interface StickyBottomBarActionButtonsProps {
  isInEditMode: boolean;
  selectedTestIsBeingEdited: boolean;
  isLocked: boolean;
  requestTakeControl: () => void;
  requestLock: () => void;
  save: () => void;
  cancel: () => void;
  saving: boolean;
}

const StickyBottomBarActionButtons: React.FC<StickyBottomBarActionButtonsProps> = ({
  isInEditMode,
  selectedTestIsBeingEdited,
  isLocked,
  requestTakeControl,
  requestLock,
  save,
  cancel,
  saving,
}: StickyBottomBarActionButtonsProps) => {
  const classes = useStyles();

  const CancelButton: React.FC = () => {
    const [isOpen, open, close] = useOpenable();

    return (
      <>
        <Button
          variant="outlined"
          // eslint-disable-next-line react/prop-types
          className={classes.button}
          startIcon={<CloseIcon />}
          onClick={open}
        >
          {/*eslint-disable-next-line react/prop-types */}
          <Typography className={classes.buttonText}>Discard</Typography>
        </Button>
        <Dialog
          open={isOpen}
          onClose={close}
          aria-labelledby="cancel-dialog-title"
          aria-describedby="cancel-dialog-description"
        >
          <DialogTitle id="cancel-dialog-title">Discard changes?</DialogTitle>
          <DialogContent>
            <DialogContentText id="cancel-dialog-description">
              You have unsaved changes - these will be lost if you move on. Please consider saving
              your work now.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={cancel} color="primary">
              Discard changes
            </Button>
            <Button onClick={save} color="primary" autoFocus>
              Save changes
            </Button>
            <Button onClick={close} color="primary" autoFocus>
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  };

  const SaveButton: React.FC = () => (
    <Button
      variant="contained"
      color="primary"
      disableElevation
      startIcon={<SaveIcon />}
      // this is a bit of a hack to prevent needing to click save twice when a field is focused
      onMouseUp={save}
    >
      {/*eslint-disable-next-line react/prop-types */}
      <Typography className={classes.buttonText}>
        {selectedTestIsBeingEdited
          ? SAVE_BUTTON_TEST_SELECTED_TEXT
          : SAVE_BUTTON_TEST_NOT_SELECTED_TEXT}
      </Typography>
    </Button>
  );

  const SavingButton: React.FC = () => (
    <Button variant="contained" color="primary" disableElevation startIcon={<SaveIcon />}>
      <Typography className={classes.buttonText}>Saving...</Typography>
    </Button>
  );

  const EditButton: React.FC = () => (
    <Button
      variant="outlined"
      // eslint-disable-next-line react/prop-types
      className={classes.button}
      startIcon={<EditIcon />}
      onClick={requestLock}
    >
      {/*eslint-disable-next-line react/prop-types */}
      <Typography className={classes.buttonText}>Enter edit mode</Typography>
    </Button>
  );

  const TakeControlButton: React.FC = () => {
    const [isOpen, open, close] = useOpenable();

    return (
      <>
        <Button
          variant="outlined"
          // eslint-disable-next-line react/prop-types
          className={classes.button}
          startIcon={<LockIcon />}
          onClick={open}
        >
          {/*eslint-disable-next-line react/prop-types */}
          <Typography className={classes.buttonText}>Take control</Typography>
        </Button>
        <Dialog
          open={isOpen}
          onClose={close}
          aria-labelledby="take-control-dialog-title"
          aria-describedby="take-control-dialog-description"
        >
          <DialogTitle id="take-control-dialog-title">Take control?</DialogTitle>
          <DialogContent>
            <DialogContentText id="take-control-dialog-description">
              The current editor will lose any unsaved work if you take control. If they were live
              recently, please check with them first.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={close} color="primary">
              Cancel
            </Button>
            <Button onClick={requestTakeControl} color="primary" autoFocus>
              Proceed
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  };
  return (
    <div className={classes.container}>
      <div className={classes.leftContainer}>{isInEditMode && <CancelButton />}</div>

      <div className={classes.rightContainer}>
        {saving ? (
          <SavingButton />
        ) : isInEditMode ? (
          // Edit mode
          <SaveButton />
        ) : isLocked ? (
          // Read only mode + locked
          <TakeControlButton />
        ) : (
          // Read only mode + not locked
          <EditButton />
        )}
      </div>
    </div>
  );
};

export default StickyBottomBarActionButtons;
