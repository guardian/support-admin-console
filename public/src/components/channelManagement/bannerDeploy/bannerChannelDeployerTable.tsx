import {
  Checkbox,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Toolbar,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';
import BannerChannelDeployerTableRow from './bannerChannelDeployerTableRow';
import { BannerDeploys, BannersToRedeploy } from './bannerDeployTypes';
import { BannerChannel } from './bannerDeployTypes';

const ScheduleRoot = styled('div')(({ theme }) => ({
  paddingLeft: theme.spacing(3),
}));

interface ScheduleProps {
  isChannel1: boolean;
}

const Schedule = ({ isChannel1 }: ScheduleProps): React.JSX.Element => (
  <ScheduleRoot>
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
  </ScheduleRoot>
);

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
  const isChannel1 = channel === 'CHANNEL1';
  const shouldRedeployAllBanners = Object.values(bannersToRedeploy).every(
    (shouldRedeploy) => shouldRedeploy,
  );

  return (
    <TableContainer component={Paper}>
      <Toolbar>
        <Typography variant="h6" id="tableTitle" component="div">
          {isChannel1 ? 'Banner 1' : 'Banner 2'}
        </Typography>
      </Toolbar>
      <Schedule isChannel1={isChannel1} />
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
