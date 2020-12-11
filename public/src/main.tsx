import React from 'react';
import ReactDOM from 'react-dom';

import { BrowserRouter as Router, Route } from 'react-router-dom';
import Switchboard from './components/switchboard';
import BannerDeployDashboard from './components/channelManagement/bannerDeploy/bannerDeployDashboard';
import ContributionTypesForm from './components/contributionTypes';
import AmountsForm from './components/amounts/amounts';
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
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IndexPage from './components/indexPage';
import { getTheme } from './utils/theme';

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
      fontWeight: typography.fontWeightMedium,
    },
  });

type Props = WithStyles<typeof styles>;

const AppRouter = withStyles(styles)(({ classes }: Props) => {
  const createComponent = (component: JSX.Element, displayName: string): React.ReactElement => (
    <div className={classes.appContainer}>
      <AppBar position="relative" className={classes.appBar}>
        <Toolbar>
          <NavDrawer />
          <Typography className={classes.heading} variant="h1" color="inherit" noWrap>
            {displayName}
          </Typography>
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
            render={(): React.ReactElement => createComponent(<AmountsForm />, 'Amounts')}
          />
          <Route
            path="/epic-tests"
            render={(): React.ReactElement =>
              createComponent(<ArticleEpicTestsForm />, 'Epic Tests')
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
        </div>
      </Router>
    </ThemeProvider>
  );
});

ReactDOM.render(<AppRouter />, document.getElementById('root'));
