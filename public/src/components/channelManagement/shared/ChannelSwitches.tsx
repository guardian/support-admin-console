import React from 'react';
import { makeStyles } from '@mui/styles';
import {
  fetchFrontendSettings,
  FrontendSettingsType,
  saveFrontendSettings,
} from '../../utils/requests';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Button from '@mui/material/Button';
import withS3Data, { DataFromServer, InnerProps } from '../../hocs/withS3Data';

const useStyles = makeStyles(() => ({
  container: {
    margin: '30px',
    maxWidth: '500px',
    display: 'flex',
    flexDirection: 'column',
    '& > * + *': {
      marginTop: '5px',
    },
  },
}));

type SwitchName =
  | 'enableBanners'
  | 'enableEpics'
  | 'enableHeaders'
  | 'enableSuperMode'
  | 'enableHardcodedEpicTests'
  | 'enableHardcodedBannerTests'
  | 'enableScheduledBannerDeploys';

type ChannelSwitches = {
  [key in SwitchName]: boolean;
};

interface ChannelSwitchProps {
  name: SwitchName;
  label: string;
  enabled: boolean;
  setSwitch: (name: SwitchName, enabled: boolean) => void;
}

const ChannelSwitch: React.FC<ChannelSwitchProps> = ({
  name,
  label,
  enabled,
  setSwitch,
}: ChannelSwitchProps) => (
  <FormControlLabel
    key={name}
    label={label}
    control={
      <Switch
        checked={enabled}
        onChange={(event): void => {
          setSwitch(name, event.target.checked);
        }}
        value={name}
      />
    }
  />
);

const ChannelSwitches: React.FC<InnerProps<ChannelSwitches>> = ({
  data: switches,
  update,
  sendToS3,
  saving,
}: InnerProps<ChannelSwitches>) => {
  const classes = useStyles();

  const onSwitchChange = (name: SwitchName, enabled: boolean): void => {
    update({
      ...switches,
      [name]: enabled,
    });
  };

  return (
    <div className={classes.container}>
      <ChannelSwitch
        name="enableEpics"
        label="Enable Epics (this does not include Apple News)"
        enabled={switches.enableEpics}
        setSwitch={onSwitchChange}
      />
      <ChannelSwitch
        name="enableBanners"
        label="Enable Banners"
        enabled={switches.enableBanners}
        setSwitch={onSwitchChange}
      />
      <ChannelSwitch
        name="enableHeaders"
        label="Enable Headers"
        enabled={switches.enableHeaders}
        setSwitch={onSwitchChange}
      />
      <ChannelSwitch
        name="enableSuperMode"
        label="Enable Article Super Mode"
        enabled={switches.enableSuperMode}
        setSwitch={onSwitchChange}
      />
      <ChannelSwitch
        name="enableHardcodedEpicTests"
        label="Enable hardcoded epic tests"
        enabled={switches.enableHardcodedEpicTests}
        setSwitch={onSwitchChange}
      />
      <ChannelSwitch
        name="enableHardcodedBannerTests"
        label="Enable hardcoded banner tests"
        enabled={switches.enableHardcodedBannerTests}
        setSwitch={onSwitchChange}
      />
      <ChannelSwitch
        name="enableScheduledBannerDeploys"
        label="Enable scheduled banner deploys"
        enabled={switches.enableScheduledBannerDeploys}
        setSwitch={onSwitchChange}
      />

      <Button
        onClick={sendToS3}
        color="primary"
        variant="contained"
        size="large"
        fullWidth={false}
        disabled={saving}
      >
        Submit
      </Button>
    </div>
  );
};

const fetchSettings = (): Promise<DataFromServer<ChannelSwitches>> =>
  fetchFrontendSettings(FrontendSettingsType.channelSwitches);
const saveSettings = (data: DataFromServer<ChannelSwitches>): Promise<Response> =>
  saveFrontendSettings(FrontendSettingsType.channelSwitches, data);

export default withS3Data<ChannelSwitches>(ChannelSwitches, fetchSettings, saveSettings);
