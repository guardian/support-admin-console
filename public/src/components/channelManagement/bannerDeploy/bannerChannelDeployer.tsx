import { Box, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import {
  fetchFrontendSettings,
  FrontendSettingsType,
  saveFrontendSettings,
} from '../../../utils/requests';
import BannerChannelDeployerTable from './bannerChannelDeployerTable';
import { BannerDeploys, BannersToRedeploy, DataFromServer } from './bannerDeployTypes';
import type { BannerChannel } from './bannerDeployTypes';

const Container = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));
const RedeployButton = styled(Button)({
  alignSelf: 'flex-start',
});

interface BannerChannelDeployerProps {
  channel: BannerChannel;
}

const BannerChannelDeployer: React.FC<BannerChannelDeployerProps> = ({
  channel,
}: BannerChannelDeployerProps) => {
  const isChannel1 = channel === 'CHANNEL1';
  const settingsType = isChannel1
    ? FrontendSettingsType.BannerDeploy
    : FrontendSettingsType.BannerDeploy2;

  const [dataFromServer, setDataFromServer] = useState<DataFromServer | null>(null);
  const [bannersToRedeploy, setBannersToRedeploy] = useState<BannersToRedeploy>({
    Australia: false,
    EuropeanUnion: false,
    RestOfWorld: false,
    UnitedStates: false,
    UnitedKingdom: false,
  });

  const onRedeployAllClick = (shouldRedeploy: boolean): void => {
    setBannersToRedeploy({
      Australia: shouldRedeploy,
      EuropeanUnion: shouldRedeploy,
      RestOfWorld: shouldRedeploy,
      UnitedStates: shouldRedeploy,
      UnitedKingdom: shouldRedeploy,
    });
  };

  const onRedeployClick = (region: string, shouldRedeploy: boolean): void => {
    setBannersToRedeploy({
      ...bannersToRedeploy,
      [region as keyof BannersToRedeploy]: shouldRedeploy,
    });
  };

  const fetchDataFromServer = (): void => {
    fetchFrontendSettings<DataFromServer>(settingsType)
      .then((data) => setDataFromServer(data))
      .catch((err) => alert(String(err)));
  };

  const resetBannersToDeploy = (): void => {
    setBannersToRedeploy({
      Australia: false,
      EuropeanUnion: false,
      RestOfWorld: false,
      UnitedStates: false,
      UnitedKingdom: false,
    });
  };

  const redeploy = (): void => {
    if (!dataFromServer) {
      return;
    }

    const now = Date.now();

    const newBannerDeploys = { ...dataFromServer.value };
    Object.entries(bannersToRedeploy).forEach(([region, shouldRedeploy]) => {
      if (shouldRedeploy) {
        newBannerDeploys[region as keyof BannerDeploys] = {
          timestamp: now,
          email: dataFromServer.email,
        };
      }
    });

    saveFrontendSettings(settingsType, {
      value: newBannerDeploys,
      version: dataFromServer.version,
    })
      .then(() => {
        fetchDataFromServer();
        resetBannersToDeploy();
      })
      .catch((err) => alert(String(err)));
  };

  useEffect(fetchDataFromServer, [settingsType]);

  return (
    <Container>
      <BannerChannelDeployerTable
        channel={channel}
        bannerDeploys={dataFromServer?.value}
        bannersToRedeploy={bannersToRedeploy}
        onRedeployAllClick={onRedeployAllClick}
        onRedeployClick={onRedeployClick}
      />

      <RedeployButton onClick={redeploy} color="primary" variant="contained" size="large">
        Redeploy channel {isChannel1 ? ' 1 ' : ' 2 '} in selected regions
      </RedeployButton>
    </Container>
  );
};

export default BannerChannelDeployer;
