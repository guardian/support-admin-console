import React from 'react';
import { makeStyles } from '@material-ui/core';
import { AppsSettingsType, fetchAppsSettings, saveAppsSettings } from '../utils/requests';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';
import withS3Data, { InnerProps } from '../hocs/withS3Data';

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

type SwitchName = 'enabled' | 'excludeBreakingNews' | 'requireApiKey';

type AppsMeteringSwitches = {
  [key in SwitchName]: boolean;
};

interface AppsMeteringSwitchProps {
  name: SwitchName;
  label: string;
  enabled: boolean;
  setSwitch: (name: SwitchName, enabled: boolean) => void;
}

const AppsMeteringSwitch: React.FC<AppsMeteringSwitchProps> = ({
  name,
  label,
  enabled,
  setSwitch,
}: AppsMeteringSwitchProps) => (
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

const AppsMeteringSwitches: React.FC<InnerProps<AppsMeteringSwitches>> = ({
  data: switches,
  update,
  sendToS3,
  saving,
}: InnerProps<AppsMeteringSwitches>) => {
  const classes = useStyles();

  const onSwitchChange = (name: SwitchName, enabled: boolean): void => {
    update({
      ...switches,
      [name]: enabled,
    });
  };

  return (
    <div className={classes.container}>
      <AppsMeteringSwitch
        name="enabled"
        label="Enable apps metering"
        enabled={switches.enabled}
        setSwitch={onSwitchChange}
      />
      <AppsMeteringSwitch
        name="excludeBreakingNews"
        label="Exclude breaking news articles from metering"
        enabled={switches.excludeBreakingNews}
        setSwitch={onSwitchChange}
      />
      <AppsMeteringSwitch
        name="requireApiKey"
        label="Require clients to provide an API key"
        enabled={switches.requireApiKey}
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

export default withS3Data<AppsMeteringSwitches>(
  AppsMeteringSwitches,
  () => fetchAppsSettings(AppsSettingsType.appsMeteringSwitches),
  data => saveAppsSettings(AppsSettingsType.appsMeteringSwitches, data),
);
