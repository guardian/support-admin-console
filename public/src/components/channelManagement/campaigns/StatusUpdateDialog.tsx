import React, { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  IconButton,
  makeStyles,
  Switch,
  Typography,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { Test, Status } from '../helpers/shared';
import { updateStatuses, FrontendSettingsType } from '../../../utils/requests';
import { testChannelData, testChannelOrder } from './CampaignsEditor';

const useStyles = makeStyles(() => ({
  dialogHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: '8px',
  },
  input: {
    '& input': {
      textTransform: 'uppercase !important',
    },
  },
  onOffLabel: {
    fontSize: '13px',
  },
  channelLabel: {
    fontSize: '14px',
    marginLeft: '16px',
  },
  testLabel: {
    fontSize: '14px',
    marginLeft: '10px',
  },
}));

interface StatusUpdateDialogProps {
  isOpen: boolean;
  close: () => void;
  tests: Test[];
  updatePage: () => void;
}

interface TestStatus {
  [index: string]: Status;
}

type UpdateStatusesArguments = [FrontendSettingsType, string[], Status];

const StatusUpdateDialog: React.FC<StatusUpdateDialogProps> = ({
  isOpen,
  close,
  tests,
  updatePage,
}: StatusUpdateDialogProps) => {
  const classes = useStyles();

  const getStatusKey = (test: Test) => {
    return `${test.channel}|${test.name}`;
  };

  const [testData, setTestData] = useState<TestStatus>({});

  useEffect(() => {
    const res: TestStatus = {};
    tests.map(test => {
      const key = getStatusKey(test);
      res[key] = test.status;
    });
    setTestData(res);
  }, [tests]);

  const updateSwitch = (e: React.ChangeEvent) => {
    e.persist();

    if (e.target != null) {
      const key = e.target.id;
      const newTestData = { ...testData };
      newTestData[key] = testData[key] === 'Live' ? 'Draft' : 'Live';
      setTestData(newTestData);
    }
  };

  const onSubmit = (): void => {
    const changes: UpdateStatusesArguments[] = [];
    tests.forEach(test => {
      const key = getStatusKey(test);
      if (test.status !== testData[key]) {
        const { channel, name } = test;
        if (channel != null) {
          const link = testChannelData[channel].link as FrontendSettingsType;
          const data = testData[key] as Status;
          changes.push([link, [name], data]);
        }
      }
    });

    if (changes.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const promises: Promise<any>[] = [];
      changes.forEach(change => {
        promises.push(updateStatuses(...change));
      });

      Promise.all(promises).then(() => updatePage());
    }
    close();
  };

  const orderTests = () => {
    const nonArchivedTests = tests.filter(t => t.status !== 'Archived');

    nonArchivedTests.sort((a, b) => {
      const tcoLength = testChannelOrder.length;
      const channelA = (a.channel != null) ? testChannelOrder.indexOf(a.channel) : tcoLength;
      const channelB = (b.channel != null) ? testChannelOrder.indexOf(b.channel) : tcoLength;

      if (channelA === channelB) {
        return a.name < b.name ? -1 : 1;
      }
      return channelA - channelB;
    });
    return nonArchivedTests;
  };

  return (
    <Dialog open={isOpen} onClose={close} aria-labelledby="create-test-dialog-title">
      <div className={classes.dialogHeader}>
        <DialogTitle id="create-campaign-dialog-title">Update Test status values</DialogTitle>
        <IconButton onClick={close} aria-label="close">
          <CloseIcon />
        </IconButton>
      </div>
      {tests.length > 0 ? (
        <>
          <DialogContent dividers>
            <List>
              {orderTests().map(t => {
                const labelId = `checkbox-label-${t.name}`;
                const key = getStatusKey(t);
                const [channelLabel, testLabel] = key.split('|');

                return (
                  <ListItem key={labelId}>
                    <Typography className={classes.onOffLabel}>Draft</Typography>
                    <Switch id={key} checked={testData[key] === 'Live'} onChange={updateSwitch} />
                    <Typography className={classes.onOffLabel}>Live</Typography>
                    <Typography className={classes.channelLabel}>[{channelLabel}]</Typography>
                    <Typography className={classes.testLabel}>{testLabel}</Typography>
                  </ListItem>
                );
              })}
            </List>
          </DialogContent>
          <DialogContent dividers>
            Clicking on the UPDATE NOW button will change Test statuses on the site with immediate
            effect - are you sure?
          </DialogContent>
          <DialogActions>
            <Button onClick={onSubmit} color="primary">
              Update now
            </Button>
          </DialogActions>
        </>
      ) : (
        <DialogContent dividers>No tests have been added to this campaign.</DialogContent>
      )}
    </Dialog>
  );
};

export default StatusUpdateDialog;
