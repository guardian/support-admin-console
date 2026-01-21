import React from 'react';

import { Checkbox, TableRow, TableCell } from '@mui/material';

type BannerChannelDeployerTableRowProps = {
  region: string;
  timestamp: number;
  email: string;
  shouldRedeploy: boolean;
  onRedeployClick: (shouldRedeploy: boolean) => void;
};

interface PrettifiedRegions {
  Australia: string;
  EuropeanUnion: string;
  RestOfWorld: string;
  UnitedStates: string;
  UnitedKingdom: string;
}

const REGION_TO_PRETTIFIED_STRING: PrettifiedRegions = {
  Australia: 'Australia',
  EuropeanUnion: 'European Union',
  RestOfWorld: 'Rest of World',
  UnitedStates: 'United States',
  UnitedKingdom: 'United Kingdom',
};
const prettifiedRegion = (region: string): string =>
  REGION_TO_PRETTIFIED_STRING[region as keyof PrettifiedRegions];

const prettifiedTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp);
  const day = date.getUTCDate().toString().padStart(2, '0');
  const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
  const year = date.getUTCFullYear();

  const hour = date.getUTCHours().toString().padStart(2, '0');

  const minute = date.getUTCMinutes().toString().padStart(2, '0');

  return `${year}/${month}/${day} - ${hour}:${minute}`;
};

const prettifiedUser = (email: string): string => {
  const nameArr: RegExpMatchArray | null = email.match(/^([a-z]*)\.([a-z]*).*@.*/);
  return nameArr
    ? `${nameArr[1][0].toUpperCase()}${nameArr[1].slice(
        1,
      )} ${nameArr[2][0].toUpperCase()}${nameArr[2].slice(1)}`
    : email;
};

const BannerChannelDeployerTableRow: React.FC<BannerChannelDeployerTableRowProps> = ({
  region,
  timestamp,
  email,
  shouldRedeploy,
  onRedeployClick,
}: BannerChannelDeployerTableRowProps) => {
  return (
    <TableRow key={region}>
      <TableCell padding="checkbox">
        <Checkbox
          checked={shouldRedeploy}
          onChange={(event): void => onRedeployClick(event.target.checked)}
        />
      </TableCell>
      <TableCell>{prettifiedRegion(region)}</TableCell>
      <TableCell>{prettifiedTimestamp(timestamp)}</TableCell>
      <TableCell>{prettifiedUser(email)}</TableCell>
    </TableRow>
  );
};

export default BannerChannelDeployerTableRow;
