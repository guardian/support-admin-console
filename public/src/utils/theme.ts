import { createMuiTheme, Theme } from '@material-ui/core/styles';
import purple from '@material-ui/core/colors/purple';
import green from '@material-ui/core/colors/green';
import { getStage } from './stage';

const DEV_AND_CODE_THEME = createMuiTheme({
  palette: {
    primary: {
      main: purple[500],
    },
    secondary: {
      main: green[500],
    },
  },
});

const PROD_THEME = createMuiTheme({});

export const getTheme = (): Theme => {
  const stage = getStage();
  if (stage == 'DEV' || stage === 'CODE') {
    return DEV_AND_CODE_THEME;
  }
  return PROD_THEME;
};
