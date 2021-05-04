import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core';
import {
  fetchFrontendSettings,
  FrontendSettingsType,
  saveFrontendSettings,
} from '../../utils/requests';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';

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

type SwitchName = 'enableBanners' | 'enableEpics';

type ChannelSwitches = {
  [key in SwitchName]: boolean;
};

const defaultSwitches: ChannelSwitches = {
  enableBanners: false,
  enableEpics: false,
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

const ChannelSwitches: React.FC = () => {
  const classes = useStyles();
  const [switches, setSwitches] = useState<ChannelSwitches>(defaultSwitches);
  const [version, setVersion] = useState<string | null>(null);

  const fetchSwitches = (): void => {
    fetchFrontendSettings(FrontendSettingsType.channelSwitches)
      .then(result => {
        setVersion(result.version);
        setSwitches(result.value);
      })
      .catch(err => alert(err));
  };

  useEffect(() => {
    fetchSwitches();
  }, []);

  const onSwitchChange = (name: SwitchName, enabled: boolean): void => {
    setSwitches({
      ...switches,
      [name]: enabled,
    });
  };

  const onSubmit = (): void => {
    const payload = {
      value: switches,
      version,
    };
    saveFrontendSettings(FrontendSettingsType.channelSwitches, payload)
      .then(() => {
        fetchSwitches();
      })
      .catch(err => alert(err));
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

      {version && (
        <Button
          onClick={onSubmit}
          color="primary"
          variant="contained"
          size="large"
          fullWidth={false}
        >
          Submit
        </Button>
      )}
    </div>
  );
};

export default ChannelSwitches;
