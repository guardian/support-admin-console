import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import { makeStyles } from '@mui/styles';
import React from 'react';
import withS3Data, { DataFromServer, InnerProps } from '../../hocs/withS3Data';
import {
  fetchFrontendSettings,
  FrontendSettingsType,
  saveFrontendSettings,
} from '../../utils/requests';

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
  | 'enableAppleNewsEpics'
  | 'enableHeaders'
  | 'enableSuperMode'
  | 'enableHardcodedEpicTests'
  | 'enableHardcodedBannerTests'
  | 'enableScheduledBannerDeploys'
  | 'enableGutterLiveblogs'
  | 'enableMParticle'
  | 'enableAuxia'
  | 'enableAuxiaForBanners';

type ChannelSwitches = Record<SwitchName, boolean> & {
  // Gandalf: marketing name for the Guardian-managed sign-in gate journey.
  // Countries listed here (ISO codes) run the journey; an empty list means it
  // is off everywhere, which is the rollback path.
  gandalfSignInGateCountries: string[];
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
        name="enableAppleNewsEpics"
        label="Enable Epics on Apple News"
        enabled={switches.enableAppleNewsEpics}
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
      <ChannelSwitch
        name="enableGutterLiveblogs"
        label="Enable Gutter Liveblogs"
        enabled={switches.enableGutterLiveblogs}
        setSwitch={onSwitchChange}
      />
      <ChannelSwitch
        name="enableMParticle"
        label="Enable mParticle API use"
        enabled={switches.enableMParticle}
        setSwitch={onSwitchChange}
      />
      <ChannelSwitch
        name="enableAuxia"
        label="Enable Auxia for sign-in gate"
        enabled={switches.enableAuxia}
        setSwitch={onSwitchChange}
      />
      <ChannelSwitch
        name="enableAuxiaForBanners"
        label="Enable Auxia for banners"
        enabled={switches.enableAuxiaForBanners}
        setSwitch={onSwitchChange}
      />

      <TextField
        label="Gandalf sign-in gate countries"
        helperText="Comma-separated ISO country codes (e.g. NZ, CA) for the Guardian-managed sign-in gate journey. Empty disables it everywhere (rollback)."
        value={switches.gandalfSignInGateCountries.join(', ')}
        onChange={(event): void => {
          update({
            ...switches,
            gandalfSignInGateCountries: event.target.value
              .split(',')
              .map((country) => country.trim().toUpperCase())
              .filter((country) => country.length > 0),
          });
        }}
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
  fetchFrontendSettings(FrontendSettingsType.ChannelSwitches);
const saveSettings = (data: DataFromServer<ChannelSwitches>): Promise<Response> =>
  saveFrontendSettings(FrontendSettingsType.ChannelSwitches, data);

export default withS3Data<ChannelSwitches>(ChannelSwitches, fetchSettings, saveSettings);
