import React, {useEffect, useState} from 'react';
import {makeStyles, Theme} from "@material-ui/core";
import {fetchFrontendSettings, FrontendSettingsType, saveFrontendSettings} from "../../utils/requests";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles(({ palette }: Theme) => ({
  container: {
    margin: '30px',
    display: 'flex',
    flexDirection: 'column',
    '& > * + *': {
      marginTop: '5px',
    },
  }
}));

type SwitchName = 'enableBanners' | 'enableEpics';

type ChannelSwitches = {
  [key in SwitchName]: boolean;
}

const defaultSwitches: ChannelSwitches = {
  enableBanners: false,
  enableEpics: false,
}

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
}) => (
  <FormControlLabel
    key={name}
    label={label}
    control={
      <Switch
        checked={enabled}
        onChange={event => {
          setSwitch(name, event.target.checked);
        }}
        value={name}
      />
    }
  />
)

interface Props {
}

const ChannelSwitches: React.FC<Props> = (props: Props) => {
  const classes = useStyles();
  const [switches, setSwitches] = useState<ChannelSwitches>(defaultSwitches)

  useEffect(() => {
    fetchFrontendSettings(FrontendSettingsType.channelSwitches)
      .then(result => setSwitches(result.value))
      .catch(err => alert(err));
  }, []);

  const onSwitchChange = (name: SwitchName, enabled: boolean): void => {
    setSwitches({
      ...switches,
      [name]: enabled,
    })
  }

  const onSubmit = (): void => {
    saveFrontendSettings(FrontendSettingsType.channelSwitches, switches)
  }

  return (
    <div className={classes.container}>
      <ChannelSwitch
        name="enableEpics"
        label="Enable Epics"
        enabled={switches.enableEpics}
        setSwitch={onSwitchChange}
      />
      <ChannelSwitch
        name="enableBanners"
        label="Enable Banners"
        enabled={switches.enableBanners}
        setSwitch={onSwitchChange}
      />

      <Button
        onClick={onSubmit}
        color="primary"
        variant="contained"
        size="large"
      >
        Submit
      </Button>
    </div>
  )
}

export default ChannelSwitches;
