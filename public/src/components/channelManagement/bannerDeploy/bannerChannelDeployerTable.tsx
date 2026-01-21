import React from 'react';

import {
  Checkbox,
  Paper,
  Theme,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Toolbar,
  Typography,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { BannerChannel } from './bannerDeployDashboard';
import { BannerDeploys, BannersToRedeploy } from './bannerChannelDeployer';
import BannerChannelDeployerTableRow from './bannerChannelDeployerTableRow';

const useStyles = makeStyles(({ spacing }: Theme) => ({
  schedule: {
    paddingLeft: spacing(3),
  },
}));

interface BannerChannelDeployerTableProps {
  channel: BannerChannel;
  bannerDeploys?: BannerDeploys;
  bannersToRedeploy: BannersToRedeploy;
  onRedeployAllClick: (shouldRedeploy: boolean) => void;
  onRedeployClick: (region: string, shouldRedeploy: boolean) => void;
}

const BannerChannelDeployerTable: React.FC<BannerChannelDeployerTableProps> = ({
  channel,
  bannerDeploys,
  bannersToRedeploy,
  onRedeployAllClick,
  onRedeployClick,
}: BannerChannelDeployerTableProps) => {
  const classes = useStyles();

  const isChannel1 = channel === 'CHANNEL1';
  const shouldRedeployAllBanners = Object.values(bannersToRedeploy).every(
    (shouldRedeploy) => shouldRedeploy,
  );

  const Schedule = (): JSX.Element => (
    <div className={classes.schedule}>
      This banner is automatically deployed at:
      {isChannel1 ? (
        <ul>
          <li>9am every Sunday</li>
          <li>9am every Thursday</li>
        </ul>
      ) : (
        <ul>
          <li>9am every Tuesday</li>
        </ul>
      )}
    </div>
  );

  return (
    <TableContainer component={Paper}>
      <Toolbar>
        <Typography variant="h6" id="tableTitle" component="div">
          {isChannel1 ? 'Banner 1' : 'Banner 2'}
        </Typography>
      </Toolbar>
      <Schedule />
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox">
              <Checkbox
                checked={shouldRedeployAllBanners}
                onChange={(event): void => onRedeployAllClick(event.target.checked)}
              />
            </TableCell>
            <TableCell>Region</TableCell>
            <TableCell>Last Manual Deploy (UTC)</TableCell>
            <TableCell>User</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {bannerDeploys &&
            Object.keys(bannerDeploys).map((region) => (
              <BannerChannelDeployerTableRow
                key={region}
                region={region}
                timestamp={bannerDeploys[region as keyof BannerDeploys].timestamp}
                email={bannerDeploys[region as keyof BannerDeploys].email}
                shouldRedeploy={bannersToRedeploy[region as keyof BannersToRedeploy]}
                onRedeployClick={(shouldRedeploy: boolean): void =>
                  onRedeployClick(region, shouldRedeploy)
                }
              />
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default BannerChannelDeployerTable;
