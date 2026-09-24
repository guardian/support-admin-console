import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  Switch,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useState } from 'react';
import { FrontendSettingsType, updateStatuses } from '../../../utils/requests';
import { Status, Test } from '../helpers/shared';
import { testChannelData, testChannelOrder } from './CampaignsTypes';

const DialogHeader = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingRight: '8px',
});

const OnOffLabel = styled(Typography)({
  fontSize: '13px',
});

const ChannelLabel = styled(Typography)({
  fontSize: '14px',
  marginLeft: '16px',
});

const TestLabel = styled(Typography)({
  fontSize: '14px',
  marginLeft: '10px',
});

interface StatusUpdateDialogProps {
  isOpen: boolean;
  close: () => void;
  tests: Test[];
  updatePage: () => void;
}

type TestStatus = Record<string, Status>;

type UpdateStatusesArguments = [FrontendSettingsType, string[], Status];

const StatusUpdateDialog: React.FC<StatusUpdateDialogProps> = ({
  isOpen,
  close,
  tests,
  updatePage,
}: StatusUpdateDialogProps) => {
  const getStatusKey = (test: Test) => {
    return `${test.channel}|${test.name}`;
  };

  const [testData, setTestData] = useState<TestStatus>(() => {
    const initial: TestStatus = {};
    tests.forEach((test) => {
      const key = getStatusKey(test);
      initial[key] = test.status;
    });
    return initial;
  });

  const updateSwitch = (e: React.ChangeEvent) => {
    e.persist();

    const key = e.target.id;
    const newTestData = { ...testData };
    newTestData[key] = testData[key] === 'Live' ? 'Draft' : 'Live';
    setTestData(newTestData);
  };

  const onSubmit = (): void => {
    const changes: UpdateStatusesArguments[] = [];
    tests.forEach((test) => {
      const key = getStatusKey(test);
      if (test.status !== testData[key]) {
        const { channel, name } = test;
        if (channel != null) {
          const link = testChannelData[channel].link as FrontendSettingsType;
          const data = testData[key];
          changes.push([link, [name], data]);
        }
      }
    });

    if (changes.length > 0) {
      const promises: Array<Promise<unknown>> = [];
      changes.forEach((change) => {
        promises.push(updateStatuses(...change));
      });

      void Promise.all(promises).then(() => updatePage());
    }
    close();
  };

  const orderTests = () => {
    const nonArchivedTests = tests.filter((t) => t.status !== 'Archived');

    nonArchivedTests.sort((a, b) => {
      const tcoLength = testChannelOrder.length;
      const channelA = a.channel != null ? testChannelOrder.indexOf(a.channel) : tcoLength;
      const channelB = b.channel != null ? testChannelOrder.indexOf(b.channel) : tcoLength;

      if (channelA === channelB) {
        return a.name < b.name ? -1 : 1;
      }
      return channelA - channelB;
    });
    return nonArchivedTests;
  };

  return (
    <Dialog open={isOpen} onClose={close} aria-labelledby="create-test-dialog-title">
      <DialogHeader>
        <DialogTitle id="create-campaign-dialog-title">Update Test status values</DialogTitle>
        <IconButton onClick={close} aria-label="close">
          <CloseIcon />
        </IconButton>
      </DialogHeader>
      {tests.length > 0 ? (
        <>
          <DialogContent dividers>
            <List>
              {orderTests().map((t) => {
                const labelId = `checkbox-label-${t.name}`;
                const key = getStatusKey(t);
                const [channelLabel, testLabel] = key.split('|');

                return (
                  <ListItem key={labelId}>
                    <OnOffLabel>Draft</OnOffLabel>
                    <Switch id={key} checked={testData[key] === 'Live'} onChange={updateSwitch} />
                    <OnOffLabel>Live</OnOffLabel>
                    <ChannelLabel>[{channelLabel}]</ChannelLabel>
                    <TestLabel>{testLabel}</TestLabel>
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
