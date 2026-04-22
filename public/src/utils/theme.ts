import green from '@mui/material/colors/green';
import purple from '@mui/material/colors/purple';
import type { Theme } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';
import { getStage } from './stage';

const DEV_AND_CODE_THEME = createTheme({
  palette: {
    primary: {
      main: purple[500],
    },
    secondary: {
      main: green[500],
    },
  },
});

const PROD_THEME = createTheme({});

export const getTheme = (): Theme => {
  const stage = getStage();
  if (stage == 'DEV' || stage === 'CODE') {
    return DEV_AND_CODE_THEME;
  }
  return PROD_THEME;
};
