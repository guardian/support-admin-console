import React, { useState } from 'react';

import { makeStyles, Theme } from '@material-ui/core/styles';

import {
  Divider,
  Typography,
  Button,
  FormLabel,
  FormControl,
  FormControlLabel,
} from '@material-ui/core';
import SwitchUI from '@material-ui/core/Switch';
import SaveIcon from '@material-ui/icons/Save';
import Alert from '@material-ui/lab/Alert';

import cloneDeep from 'lodash/cloneDeep';

import {
  SupportFrontendSettingsType,
  fetchSupportFrontendSettings,
  saveSupportFrontendSettings,
} from '../utils/requests';

import withS3Data, { InnerProps, DataFromServer } from '../hocs/withS3Data';

enum SwitchState {
  On = 'On',
  Off = 'Off',
}

interface Switch {
  description: string;
  state: SwitchState;
}

interface SwitchGroup {
  description: string;
  switches: {
    [switchName: string]: Switch;
  };
}

interface SupportFrontendSwitches {
  [groupName: string]: SwitchGroup;
}

const useStyles = makeStyles(({ palette, spacing }: Theme) => ({
  formControl: {
    marginRight: spacing(4),
    marginBottom: spacing(4),
    paddingTop: spacing(1),
    paddingBottom: spacing(1),
    paddingLeft: spacing(2),
    paddingRight: spacing(2),
    border: `1px solid ${palette.grey['300']}`,
  },
  button: {
    marginRight: spacing(2),
  },
  buttons: {
    marginTop: spacing(2),
  },
  form: {
    marginTop: spacing(4),
    marginLeft: spacing(4),
    marginRight: spacing(4),
    marginBottom: spacing(4),
    overflowY: 'auto',
  },
  divider: {
    marginTop: spacing(4),
    marginBottom: spacing(4),
  },
  existingSwitchesHeader: {
    marginBottom: spacing(2),
  },
  newSwitchesHeader: {
    marginBottom: spacing(2),
  },
  textParagraph: {
    marginBottom: spacing(2),
  }
}));

const Switchboard: React.FC<InnerProps<SupportFrontendSwitches>> = ({
  data,
  setData,
  saveData,
}: InnerProps<SupportFrontendSwitches>) => {
  const classes = useStyles();

  const [needToSaveDataWarning, setNeedToSaveDataWarning] = useState(false);

  const displayNeedToSaveDataWarning = (): JSX.Element | false => {
    return (
      needToSaveDataWarning && (
        <Alert severity="warning">
          Switch settings have been changed. Changes need to be saved before they take effect!
        </Alert>
      )
    );
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateSwitchSetting = (groupId: string, switchData: [string, Switch], event: any): void => {
    const updatedState = cloneDeep(data);

    // const [mySwitchId, mySwitch] = switchData;
    const mySwitchId = switchData[0];

    updatedState[groupId].switches[mySwitchId].state = event.target.checked
      ? SwitchState.On
      : SwitchState.Off;

    setData(updatedState);
    setNeedToSaveDataWarning(true);
  };

  const createSwitchesFromGroupData = (
    mySwitch: [string, Switch],
    groupId: string,
  ): JSX.Element => {
    const [switchId, switchData] = mySwitch;

    return (
      <FormControlLabel
        label={switchData.description}
        checked={switchData.state === 'On' ? true : false}
        control={<SwitchUI />}
        onChange={(event): void => updateSwitchSetting(groupId, mySwitch, event)}
        value={switchId}
        key={switchId}
      />
    );
  };

  const createGroupsFromData = (group: [string, SwitchGroup]): JSX.Element => {
    const [groupId, groupData] = group;

    return (
      <FormControl className={classes.formControl} key={groupId}>
        <FormLabel>{groupData.description}</FormLabel>
        {Object.entries(groupData.switches).map(mySwitch =>
          createSwitchesFromGroupData(mySwitch, groupId),
        )}
      </FormControl>
    );
  };

  const createSwitchFields = (): JSX.Element => {
    return <>{Object.entries(data).map(group => createGroupsFromData(group))}</>;
  };

  const actionSaveData = (): void => {
    saveData();
    setNeedToSaveDataWarning(false);
  };

  return (
    <form className={classes.form}>
      <Typography className={classes.existingSwitchesHeader} variant="h6">Manage existing switches</Typography>

      {createSwitchFields()}

      {displayNeedToSaveDataWarning()}

      <div className={classes.buttons}>
        <Button
          variant="contained"
          onClick={(): void => actionSaveData()}
          className={classes.button}
        >
          <SaveIcon />
          Save
        </Button>
      </div>

      <Divider variant="fullWidth" className={classes.divider} />

      <Typography className={classes.newSwitchesHeader} variant="h6">Create new switches</Typography>
      <Typography className={classes.textParagraph} variant="body1">
        Currently, to create a new switch, update the JSON file in AWS S3 to include details of the switch, then refresh this page so that the switch status can be viewed and updated.
      </Typography>
      <Typography className={classes.textParagraph} variant="body1">
        If there is a demand for it, we can add functionality to create new switches (and new switch groups) to this page in due course.
      </Typography>
    </form>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fetchSettings = (): Promise<any> => {
  return fetchSupportFrontendSettings(SupportFrontendSettingsType.switches);
};

const saveSettings = (data: DataFromServer<SupportFrontendSwitches>): Promise<Response> => {
  return saveSupportFrontendSettings(SupportFrontendSettingsType.switches, data);
};

export default withS3Data<SupportFrontendSwitches>(Switchboard, fetchSettings, saveSettings);
