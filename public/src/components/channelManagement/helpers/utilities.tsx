import React from 'react';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';

import { Typography } from '@material-ui/core';

export const renderVisibilityIcons = (isOn: boolean): React.ReactNode => {
  return isOn ? <VisibilityIcon color={'action'} /> : <VisibilityOffIcon color={'disabled'} />;
};

export const renderVisibilityHelpText = (isOn: boolean): React.ReactNode => {
  return isOn ? (
    <Typography color={'textSecondary'}>
      (Visible to readers at <a href="https://www.theguardian.com">theguardian.com</a>)
    </Typography>
  ) : (
    <Typography color={'textSecondary'}>
      (Only visible at <a href="https://www.theguardian.com">theguardian.com</a> if you add{' '}
      <em>#show-draft-epics</em> at the end of the url)
    </Typography>
  );
};

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const formattedTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp);

  const hours = date.getHours();
  const paddedhours = String(hours).padStart(2, '0');
  const minutes = date.getMinutes();
  const paddedMinutes = String(minutes).padStart(2, '0');
  const day = date.getDate();
  const paddedDay = String(day).padStart(2, '0');
  const monthName = MONTH_NAMES[date.getMonth()];

  return `${monthName} ${paddedDay} at ${paddedhours}:${paddedMinutes}`;
};
