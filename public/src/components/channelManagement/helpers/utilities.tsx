import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Typography } from '@mui/material';
import React from 'react';

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

export type VariantSample = {
  variantName: string;
  views: number;
  mean: number;
};

export type TestSample = {
  timestamp: string;
  variants: VariantSample[];
};

export type ChartDataPoint = Record<string, string | number | null>;

export function buildChartData(
  samples: TestSample[],
  variantNames: string[],
  fieldName: keyof VariantSample,
): ChartDataPoint[] {
  return samples.map(({ timestamp, variants }) => {
    const date = new Date(timestamp);
    const sample: ChartDataPoint = {
      dateHour: formatToUtcString(date),
    };

    if (variants.length > 0) {
      variants.forEach((variant) => {
        sample[variant.variantName] = variant[fieldName];
      });
      return sample;
    }

    // When no variants are present, set all variant values to null
    variantNames.forEach((variantName) => {
      sample[variantName] = null;
    });

    return sample;
  });
}

function pad(n: number) {
  return n < 10 ? '0' + n : n;
}

function formatToUtcString(date: Date): string {
  return (
    date.getUTCFullYear() +
    '-' +
    pad(date.getUTCMonth() + 1) +
    '-' +
    pad(date.getUTCDate()) +
    ' ' +
    pad(date.getUTCHours()) +
    ':' +
    pad(date.getUTCMinutes())
  );
}
