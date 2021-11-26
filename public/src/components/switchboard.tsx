import React, { useState } from 'react';

import { makeStyles, Theme } from '@material-ui/core/styles';

import { Divider, Typography } from '@material-ui/core';

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
    [switchName: string]: Switch
  };
}

interface SupportFrontendSwitches {
  [groupName: string]: SwitchGroup;
}

const useStyles = makeStyles(({ spacing }: Theme) => ({

  container: {
    margin: spacing(4),
  }
}));

const Switchboard: React.FC<InnerProps<SupportFrontendSwitches>> = ({
  data,
  setData,
  saveData,
}: InnerProps<SupportFrontendSwitches>) => {
  const classes = useStyles();

  console.log('data', data);

  return (
    // <div className={classes.body}>
    //   <div className={classes.leftCol}>
    //     <Sidebar onRegionSelected={setSelectedRegion} save={saveConfiguredAmounts} />
    //   </div>
    //   <div className={classes.rightCol}>
    //     <ConfiguredRegionAmountsEditor
    //       label={selectedRegionPrettifiedName}
    //       configuredRegionAmounts={selectedRegionAmounts}
    //       updateConfiguredRegionAmounts={updateConfiguredRegionAmounts}
    //       existingTestNames={existingTestNames}
    //     />
    //   </div>
    // </div>
    <div className={classes.container}>
      <Typography variant="h4">
        Manage existing switches
      </Typography>
      <Typography variant="body1">
        Save settings buttons should go here
      </Typography>
      <Divider variant="middle" />
      <Typography variant="h4" component="div">
        Create new switches
      </Typography>
      <Typography variant="body1">
        Form for creating new switches. Also: new switch groups? 
      </Typography>
    </div>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fetchSettings = (): Promise<any> =>
  fetchSupportFrontendSettings(SupportFrontendSettingsType.switches);

const saveSettings = (data: DataFromServer<SupportFrontendSwitches>): Promise<Response> =>
  saveSupportFrontendSettings(SupportFrontendSettingsType.switches, data);

export default withS3Data<SupportFrontendSwitches>(Switchboard, fetchSettings, saveSettings);
