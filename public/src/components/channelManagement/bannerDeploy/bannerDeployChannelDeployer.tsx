import React, { useState, useEffect } from 'react';

import { Button, Theme, makeStyles } from '@material-ui/core';
import { BannerChannel } from './bannerDeployDashboard';
import BannerChannelDeployerTable from './bannerDeployChannelDeployerTable';

import {
  fetchFrontendSettings,
  saveFrontendSettings,
  FrontendSettingsType,
} from '../../../utils/requests';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const useStyles = makeStyles(({ spacing }: Theme) => ({
  container: {
    '& > * + *': {
      marginTop: spacing(2),
    },
  },
}));

export interface BannerDeployRegion {
  timestamp: number;
  email: string;
}

export interface BannerDeploys {
  Australia: BannerDeployRegion;
  EuropeanUnion: BannerDeployRegion;
  RestOfWorld: BannerDeployRegion;
  UnitedStates: BannerDeployRegion;
  UnitedKingdom: BannerDeployRegion;
}

export interface BannersToRedeploy {
  Australia: boolean;
  EuropeanUnion: boolean;
  RestOfWorld: boolean;
  UnitedStates: boolean;
  UnitedKingdom: boolean;
}

interface DataFromServer {
  value: BannerDeploys;
  version: string;
  email: string;
}

interface BannerDeployChannelDeployerProps {
  channel: BannerChannel;
}

const BannerDeployChannelDeployer: React.FC<BannerDeployChannelDeployerProps> = ({
  channel,
}: BannerDeployChannelDeployerProps) => {
  const classes = useStyles();

  const isChannel1 = channel === 'CHANNEL1';
  const settingsType = isChannel1
    ? FrontendSettingsType.bannerDeploy
    : FrontendSettingsType.bannerDeploy2;

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
    fetchFrontendSettings(settingsType)
      .then(data => setDataFromServer(data))
      .catch(err => alert(err));
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
      .catch(err => alert(err));
  };

  useEffect(fetchDataFromServer, []);

  return (
    <div className={classes.container}>
      <BannerChannelDeployerTable
        channel={channel}
        bannerDeploys={dataFromServer?.value}
        bannersToRedeploy={bannersToRedeploy}
        onRedeployAllClick={onRedeployAllClick}
        onRedeployClick={onRedeployClick}
      />

      <Button onClick={redeploy} color="primary" variant="contained" size="large">
        Redeploy channel {isChannel1 ? ' 1 ' : ' 2 '} in selected regions
      </Button>
    </div>
  );
};

export default BannerDeployChannelDeployer;
