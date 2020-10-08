import React, { useState, useEffect } from 'react';

import { Button, Theme, withStyles, createStyles, WithStyles } from '@material-ui/core';
import { BannerChannel } from './bannerDeployDashboard';
import BannerChannelDeployerTable from './bannerDeployChannelDeployerTable';

import {
  fetchFrontendSettings,
  saveFrontendSettings,
  FrontendSettingsType,
} from '../../../utils/requests';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const styles = ({ spacing }: Theme) =>
  createStyles({
    container: {
      '& > * + *': {
        marginTop: spacing(2),
      },
    },
  });

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

type BannerDeployChannelDeployerProps = WithStyles<typeof styles> & {
  channel: BannerChannel;
};

const BannerDeployChannelDeployer: React.FC<BannerDeployChannelDeployerProps> = ({
  classes,
  channel,
}: BannerDeployChannelDeployerProps) => {
  const isChannel1 = channel === 'CHANNEL1';
  const settingsType = isChannel1
    ? FrontendSettingsType.bannerDeploy
    : FrontendSettingsType.bannerDeploy2;

  const [bannerDeploys, setBannerDeploys] = useState<BannerDeploys | null>(null);
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

  useEffect(() => {
    fetchFrontendSettings(settingsType)
      .then(data => setBannerDeploys(data.value))
      .catch(err => alert(err));
  });

  return (
    <div className={classes.container}>
      <BannerChannelDeployerTable
        channel={channel}
        bannerDeploys={bannerDeploys}
        bannersToRedeploy={bannersToRedeploy}
        onRedeployAllClick={onRedeployAllClick}
        onRedeployClick={onRedeployClick}
      />

      <Button color="primary" variant="contained" size="large">
        {isChannel1 ? 'Redeploy channel 1' : 'Redeploy channel 2'}
      </Button>
    </div>
  );
};

// class Switchboard extends React.Component<Props, Switches> {
//   state: Switches;
//   previousStateFromServer: DataFromServer | null;

//   UNSAFE_componentWillMount(): void {
//     this.fetchStateFromServer();
//   }

//   fetchStateFromServer(): void {
//     fetchSupportFrontendSettings(SupportFrontendSettingsType.switches).then(serverData => {
//       this.previousStateFromServer = serverData;
//       this.setState({
//         ...serverData.value,
//       });
//     });
//   }

//   updateOneOffPaymentMethodSwitch(paymentMethod: string, switchState: SwitchState): void {
//     this.setState(prevState =>
//       update(prevState, {
//         oneOffPaymentMethods: {
//           [paymentMethod]: { $set: switchState },
//         },
//       }),
//     );
//   }

//   updateRecurringPaymentMethodSwitch(paymentMethod: string, switchState: SwitchState): void {
//     this.setState(prevState =>
//       update(prevState, {
//         recurringPaymentMethods: {
//           [paymentMethod]: { $set: switchState },
//         },
//       }),
//     );
//   }

//   updateFeatureSwitch(switchName: string, switchState: SwitchState): void {
//     this.setState(prevState =>
//       update(prevState, {
//         experiments: {
//           [switchName]: {
//             state: { $set: switchState },
//           },
//         },
//       }),
//     );
//   }

//   saveSwitches = (): void => {
//     const newState = update(this.previousStateFromServer, {
//       value: { $set: this.state },
//     });

//     saveSupportFrontendSettings(SupportFrontendSettingsType.switches, newState)
//       .then(resp => {
//         if (!resp.ok) {
//           resp.text().then(msg => alert(msg));
//         }
//         this.fetchStateFromServer();
//       })
//       .catch(resp => {
//         alert(`Error while saving: ${resp}`);
//         this.fetchStateFromServer();
//       });
//   };
//   }
// }

export default withStyles(styles)(BannerDeployChannelDeployer);
