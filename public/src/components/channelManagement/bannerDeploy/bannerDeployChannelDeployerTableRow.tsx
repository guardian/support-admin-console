import React from 'react';

import { Checkbox, TableRow, TableCell } from '@material-ui/core';

type BannerDeployChannelDeployerTableRowProps = {
  region: string;
  timestamp: number;
  email: string;
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
  const day = date
    .getUTCDay()
    .toString()
    .padStart(2, '0');
  const month = date
    .getUTCMonth()
    .toString()
    .padStart(2, '0');
  const year = date.getUTCFullYear();

  const hour = date
    .getUTCHours()
    .toString()
    .padStart(2, '0');

  const minute = date
    .getUTCMinutes()
    .toString()
    .padStart(2, '0');

  return `${hour}:${minute} - ${day}/${month}/${year}`;
};

const prettifiedUser = (email: string): string => {
  const nameArr: RegExpMatchArray | null = email.match(/^([a-z]*)\.([a-z]*).*@.*/);
  return nameArr
    ? `${nameArr[1][0].toUpperCase()}${nameArr[1].slice(
        1,
      )} ${nameArr[2][0].toUpperCase()}${nameArr[2].slice(1)}`
    : email;
};

const BannerDeployChannelDeployerTableRow: React.FC<BannerDeployChannelDeployerTableRowProps> = ({
  region,
  timestamp,
  email,
}: BannerDeployChannelDeployerTableRowProps) => {
  return (
    <TableRow key={region}>
      <TableCell padding="checkbox">
        <Checkbox />
      </TableCell>
      <TableCell>{prettifiedRegion(region)}</TableCell>
      <TableCell>{prettifiedTimestamp(timestamp)}</TableCell>
      <TableCell>{prettifiedUser(email)}</TableCell>
    </TableRow>
  );
};

export default BannerDeployChannelDeployerTableRow;
