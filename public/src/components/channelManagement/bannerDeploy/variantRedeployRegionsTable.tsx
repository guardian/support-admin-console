import {
  Checkbox,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import React from 'react';
import BannerChannelDeployerTableRow from './bannerChannelDeployerTableRow';
import { bannerDeployRegionNames } from './bannerDeployTypes';
import type { BannerDeployRegionName, BannerDeploys, BannersToRedeploy } from './bannerDeployTypes';

interface VariantRedeployRegionsTableProps {
  selectedRegions: BannersToRedeploy;
  manualRedeploysByRegion?: Partial<BannerDeploys>;
  lastManualRedeployTimestamp?: number;
  onSelectAll: (shouldRedeploy: boolean) => void;
  onSelectRegion: (region: BannerDeployRegionName, shouldRedeploy: boolean) => void;
}

const VariantRedeployRegionsTable: React.FC<VariantRedeployRegionsTableProps> = ({
  selectedRegions,
  manualRedeploysByRegion,
  lastManualRedeployTimestamp,
  onSelectAll,
  onSelectRegion,
}) => {
  const selectedCount = Object.values(selectedRegions).filter(Boolean).length;
  const allRegionsSelected = selectedCount === bannerDeployRegionNames.length;

  return (
    <TableContainer component={Paper}>
      <Table size="small" aria-label="Variant Banner 1 redeploy regions">
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox">
              <Checkbox
                checked={allRegionsSelected}
                indeterminate={selectedCount > 0 && !allRegionsSelected}
                onChange={(event) => onSelectAll(event.target.checked)}
                inputProps={{ 'aria-label': 'Select all Variant redeploy regions' }}
              />
            </TableCell>
            <TableCell>Region</TableCell>
            <TableCell>Last Manual Deploy (UTC)</TableCell>
            <TableCell>User</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {bannerDeployRegionNames.map((region) => {
            const manualRedeploy = manualRedeploysByRegion?.[region];

            return (
              <BannerChannelDeployerTableRow
                key={region}
                region={region}
                timestamp={manualRedeploy?.timestamp ?? lastManualRedeployTimestamp}
                email={manualRedeploy?.email}
                shouldRedeploy={selectedRegions[region]}
                onRedeployClick={(shouldRedeploy) => onSelectRegion(region, shouldRedeploy)}
              />
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default VariantRedeployRegionsTable;
