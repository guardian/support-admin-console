import React from 'react';
import ReactDOM from 'react-dom';

import { BrowserRouter as Router, Route } from 'react-router-dom';
import Switchboard from './components/switchboard';
import BannerDeployDashboard from './components/channelManagement/bannerDeploy/bannerDeployDashboard';
import ContributionTypesForm from './components/contributionTypes';
import ConfiguredAmountsEditor from './components/amounts/configuredAmountsEditor';
import {
  ArticleEpicTestsForm,
  ArticleEpicHoldbackTestsForm,
  LiveblogEpicTestsForm,
  AppleNewsEpicTestsForm,
  AMPEpicTestsForm,
} from './components/channelManagement/epicTests/epicTestsForm';
import {
  BannerTestsForm1,
  BannerTestsForm2,
} from './components/channelManagement/bannerTests/bannerTestsForm';

import { HeaderTestsForm } from './components/channelManagement/headerTests/headerTestsForm';

import {
  createStyles,
  Theme,
  ThemeProvider,
  WithStyles,
  withStyles,
} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import { CSSProperties } from '@material-ui/core/styles/withStyles';
import NavDrawer from './components/drawer';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IndexPage from './components/indexPage';
import { getTheme } from './utils/theme';
import ChannelSwitches from './components/channelManagement/ChannelSwitches';
import { FontWeightProperty } from 'csstype';

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

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const styles = ({ palette, mixins, typography, transitions }: Theme) =>
  createStyles({
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
  });

type Props = WithStyles<typeof styles>;

const HELP_GUIDE_URL =
  'https://docs.google.com/document/d/1ErgEoQJRpiVMHZZpUmAnq3MGY8tJCaHTun0INzLcLRc/edit';

const AppRouter = withStyles(styles)(({ classes }: Props) => {
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
    <ThemeProvider theme={getTheme()}>
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
            path="/contribution-types"
            render={(): React.ReactElement =>
              createComponent(<ContributionTypesForm />, 'Contribution Types')
            }
          />
          <Route
            path="/amounts"
            render={(): React.ReactElement =>
              createComponent(<ConfiguredAmountsEditor />, 'Amounts')
            }
          />
          <Route
            path="/header-tests"
            render={(): React.ReactElement => createComponent(<HeaderTestsForm />, 'Header Tests')}
          />
          <Route
            path="/epic-tests"
            render={(): React.ReactElement =>
              createComponent(<ArticleEpicTestsForm />, 'Epic Tests')
            }
          />
          <Route
            path="/epic-holdback-tests"
            render={(): React.ReactElement =>
              createComponent(<ArticleEpicHoldbackTestsForm />, 'Epic Holdback Tests')
            }
          />
          <Route
            path="/liveblog-epic-tests"
            render={(): React.ReactElement =>
              createComponent(<LiveblogEpicTestsForm />, 'Liveblog Epic Tests')
            }
          />
          <Route
            path="/apple-news-epic-tests"
            render={(): React.ReactElement =>
              createComponent(<AppleNewsEpicTestsForm />, 'Apple News Epics')
            }
          />
          <Route
            path="/amp-epic-tests"
            render={(): React.ReactElement => createComponent(<AMPEpicTestsForm />, 'AMP Epics')}
          />
          <Route
            path="/banner-tests"
            render={(): React.ReactElement =>
              createComponent(<BannerTestsForm1 />, 'Banner Tests 1')
            }
          />
          <Route
            path="/banner-tests2"
            render={(): React.ReactElement =>
              createComponent(<BannerTestsForm2 />, 'Banner Tests 2')
            }
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
        </div>
      </Router>
    </ThemeProvider>
  );
});

ReactDOM.render(<AppRouter />, document.getElementById('root'));
