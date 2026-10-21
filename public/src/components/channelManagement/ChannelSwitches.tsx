import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Slider from '@mui/material/Slider';
import { styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import React from 'react';
import withS3Data, { DataFromServer, InnerProps } from '../../hocs/withS3Data';
import {
  fetchFrontendSettings,
  FrontendSettingsType,
  saveFrontendSettings,
} from '../../utils/requests';

const Container = styled('div')({
  margin: '30px',
  maxWidth: '500px',
  display: 'flex',
  flexDirection: 'column',
  gap: '5px',
});

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
  | 'enableInline1Tests'
  | 'enableMParticle'
  | 'enableAuxia'
  | 'enableAuxiaForBanners'
  | 'enableGandalfSignInGate';

type ChannelSwitches = Record<SwitchName, boolean> & {
  auxiaBannerRolloutPercentage: number;
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
  const onSwitchChange = (name: SwitchName, enabled: boolean): void => {
    update({
      ...switches,
      [name]: enabled,
    });
  };

  return (
    <Container>
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
        name="enableInline1Tests"
        label="Enable Inline1 tests"
        enabled={switches.enableInline1Tests}
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
      <div>
        <Typography id="auxia-banner-rollout-label" variant="body2">
          growth-auxia-banner consented Variant rollout: {switches.auxiaBannerRolloutPercentage}%
        </Typography>
        <Slider
          aria-labelledby="auxia-banner-rollout-label"
          min={0}
          max={100}
          step={1}
          value={switches.auxiaBannerRolloutPercentage}
          valueLabelDisplay="auto"
          onChange={(_, value): void => {
            update({
              ...switches,
              auxiaBannerRolloutPercentage: value as number,
            });
          }}
        />
      </div>
      <ChannelSwitch
        name="enableGandalfSignInGate"
        label="Enable Gandalf sign-in gate (New Zealand)"
        enabled={switches.enableGandalfSignInGate}
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
    </Container>
  );
};

const fetchSettings = (): Promise<DataFromServer<ChannelSwitches>> =>
  fetchFrontendSettings(FrontendSettingsType.ChannelSwitches);
const saveSettings = (data: DataFromServer<ChannelSwitches>): Promise<Response> =>
  saveFrontendSettings(FrontendSettingsType.ChannelSwitches, data);

export default withS3Data<ChannelSwitches>(ChannelSwitches, fetchSettings, saveSettings);
