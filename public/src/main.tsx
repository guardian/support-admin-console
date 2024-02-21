import React from 'react';
import { createRoot } from 'react-dom/client';

import { BrowserRouter as Router, Route } from 'react-router-dom';
import Switchboard from './components/switchboard';
import BannerDeployDashboard from './components/channelManagement/bannerDeploy/bannerDeployDashboard';
import AmountsForm from './components/amounts/AmountsForm';
import {
  ArticleEpicTestsForm,
  LiveblogEpicTestsForm,
  AppleNewsEpicTestsForm,
  AMPEpicTestsForm,
} from './components/channelManagement/epicTests/epicTestsForm';
import {
  BannerTestsForm1,
  BannerTestsForm2,
} from './components/channelManagement/bannerTests/bannerTestsForm';

import { HeaderTestsForm } from './components/channelManagement/headerTests/headerTestsForm';

import { Theme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import { CSSProperties } from '@mui/styles';
import NavDrawer from './components/drawer';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IndexPage from './components/indexPage';
import { getTheme } from './utils/theme';
import ChannelSwitches from './components/channelManagement/ChannelSwitches';
import CampaignsForm from './components/channelManagement/campaigns/CampaignsForm';
import { FontWeightProperty } from 'csstype';
import { makeStyles } from '@mui/styles';
import QrCodePage from './components/utilities/QrCodePage';
import AppsMeteringSwitches from './components/appsMeteringSwitches';
import { SuperModeDashboard } from './components/channelManagement/superMode/superModeDashboard';
import BannerDesigns from './components/channelManagement/bannerDesigns/';
import DefaultPromos from './components/defaultPromos';
import { StyledEngineProvider } from '@mui/material';

declare module '@mui/styles' {
  type DefaultTheme = Theme;
}

type Stage = 'DEV' | 'CODE' | 'PROD';
declare global {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  interface Window {
    remoteImport: (url: string) => Promise<any>;
    guardian: {
      stage: Stage;
      automat: {
        react: any;
        preact: any;
        emotionReact: any;
        emotionReactJsxRuntime: any;
      };
    };
  }
  /* eslint-enable @typescript-eslint/no-explicit-any */
}

const initialiseDynamicImport = (): void => {
  try {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    window.remoteImport = new Function('url', `return import(url)`) as (
      url: string,
    ) => Promise<any>;
    /* eslint-enable @typescript-eslint/no-explicit-any */
  } catch (e) {
    console.log('failed to init import');
  }
};

initialiseDynamicImport();

const useStyles = makeStyles(({ palette, mixins, typography, transitions }: Theme) => ({
  root: {
    display: 'flex',
  },
  appContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '100vw',
    height: '100vh',
  },
  appBar: {
    transition: transitions.create(['margin', 'width'], {
      easing: transitions.easing.sharp,
      duration: transitions.duration.leavingScreen,
    }),
  },
  appContent: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    flexGrow: 1,
    backgroundColor: palette.grey[100],
  },
  toolbar: mixins.toolbar as CSSProperties, // createStyles expects material-ui's CSSProperties type, not react's
  heading: {
    fontSize: typography.pxToRem(24),
    fontWeight: typography.fontWeightMedium as FontWeightProperty,
  },
  toolbarContent: {
    width: '100%',
    justifyContent: 'space-between',
  },
  link: {
    fontSize: typography.pxToRem(12),
    fontWeight: typography.fontWeightMedium as FontWeightProperty,
    textDecoration: 'none',
  },
  guideButton: {
    borderColor: palette.grey[100],
    color: palette.grey[100],
  },
}));

const HELP_GUIDE_URL =
  'https://docs.google.com/document/d/1ErgEoQJRpiVMHZZpUmAnq3MGY8tJCaHTun0INzLcLRc/edit';

const AppRouter = () => {
  const classes = useStyles();

  const createComponent = (component: JSX.Element, displayName: string): React.ReactElement => (
    <div className={classes.appContainer}>
      <AppBar position="relative" className={classes.appBar}>
        <Toolbar className={classes.toolbarContent}>
          <NavDrawer />
          <Typography className={classes.heading} variant="h1" color="inherit" noWrap>
            {displayName}
          </Typography>
          <a
            href={HELP_GUIDE_URL}
            className={classes.link}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button className={classes.guideButton} variant="outlined" disableElevation>
              User Guide
            </Button>
          </a>
        </Toolbar>
      </AppBar>
      <main className={classes.appContent}>{component}</main>
    </div>
  );

  return (
    <Router>
      <div className={classes.root}>
        <CssBaseline />
        <Route
          exact
          path="/"
          render={(): React.ReactElement => createComponent(<IndexPage />, 'Home Page')}
        />
        <Route
          path="/switches"
          render={(): React.ReactElement => createComponent(<Switchboard />, 'Switches')}
        />
        <Route
          path="/amounts"
          render={(): React.ReactElement => createComponent(<AmountsForm />, 'Amounts')}
        />
        <Route
          path="/header-tests/:testName?"
          render={(): React.ReactElement => createComponent(<HeaderTestsForm />, 'Header Tests')}
        />
        <Route
          path="/epic-tests/:testName?"
          render={(): React.ReactElement => createComponent(<ArticleEpicTestsForm />, 'Epic Tests')}
        />
        <Route
          path="/liveblog-epic-tests/:testName?"
          render={(): React.ReactElement =>
            createComponent(<LiveblogEpicTestsForm />, 'Liveblog Epic Tests')
          }
        />
        <Route
          path="/apple-news-epic-tests/:testName?"
          render={(): React.ReactElement =>
            createComponent(<AppleNewsEpicTestsForm />, 'Apple News Epics')
          }
        />
        <Route
          path="/amp-epic-tests/:testName?"
          render={(): React.ReactElement => createComponent(<AMPEpicTestsForm />, 'AMP Epics')}
        />
        <Route
          path="/banner-tests/:testName?"
          render={(): React.ReactElement => createComponent(<BannerTestsForm1 />, 'Banner Tests 1')}
        />
        <Route
          path="/banner-tests2/:testName?"
          render={(): React.ReactElement => createComponent(<BannerTestsForm2 />, 'Banner Tests 2')}
        />
        <Route
          path="/banner-deploy"
          render={(): React.ReactElement =>
            createComponent(<BannerDeployDashboard />, 'Banner Deploy')
          }
        />
        <Route
          path="/channel-switches"
          render={(): React.ReactElement =>
            createComponent(<ChannelSwitches />, 'Channel Switches')
          }
        />
        <Route
          path="/campaigns/:campaignName?"
          render={(): React.ReactElement => createComponent(<CampaignsForm />, 'Campaigns')}
        />
        <Route
          path="/qr-code"
          render={(): React.ReactElement => createComponent(<QrCodePage />, 'QR Code Generator')}
        />
        <Route
          path="/apps-metering-switches"
          render={(): React.ReactElement =>
            createComponent(<AppsMeteringSwitches />, 'Apps Metering Switches')
          }
        />
        <Route
          path="/super-mode"
          render={(): React.ReactElement =>
            createComponent(<SuperModeDashboard />, 'Epic Super Mode dashboard 🦸')
          }
        />
        <Route
          path="/default-promos"
          render={(): React.ReactElement => createComponent(<DefaultPromos />, 'Default Promos')}
        />
        <Route
          path="/banner-designs/:name?"
          render={(): React.ReactElement => createComponent(<BannerDesigns />, 'Banner Designs')}
        />
      </div>
    </Router>
  );
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <ThemeProvider theme={getTheme()}>
      <StyledEngineProvider injectFirst>
        <AppRouter />
      </StyledEngineProvider>
    </ThemeProvider>,
  );
} else {
  console.error('No root element found');
}
