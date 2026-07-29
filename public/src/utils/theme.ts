import green from '@mui/material/colors/green';
import purple from '@mui/material/colors/purple';
import { createTheme, Theme } from '@mui/material/styles';
import { getStage } from './stage';

const CODE_THEME = createTheme({
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
  if (stage === 'CODE') {
    return CODE_THEME;
  }
  return PROD_THEME;
};
