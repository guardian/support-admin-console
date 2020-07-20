import React, {Component} from 'react';
import ReactDOM from 'react-dom';

import {BrowserRouter as Router, Route} from 'react-router-dom';
import Switchboard from './components/switchboard';
import ContributionTypesForm from './components/contributionTypes';
import AmountsForm from './components/amounts/amounts';
import EpicTestsForm from './components/channelManagement/epicTests/epicTestsForm';
import BannerTestsForm from "./components/channelManagement/bannerTests/bannerTestsForm";
import {createStyles, Theme, WithStyles, withStyles} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import {CSSProperties} from "@material-ui/core/styles/withStyles";
import NavDrawer from "./components/drawer";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IndexPage from "./components/indexPage";

const styles = ({ palette, spacing, mixins, typography, transitions }: Theme) => createStyles({
  root: {
    display: 'flex',
  },
  appBar: {
    transition: transitions.create(['margin', 'width'], {
      easing: transitions.easing.sharp,
      duration: transitions.duration.leavingScreen,
    }),
  },
  toolbar: mixins.toolbar as CSSProperties, // createStyles expects material-ui's CSSProperties type, not react's
  content: {
    flexGrow: 1,
    backgroundColor: palette.background.default,
    padding: spacing(10),
  },
  heading: {
    fontSize: typography.pxToRem(24),
    fontWeight: typography.fontWeightMedium
  },
});

const Index = () => <h2>Home</h2>;

interface Props extends WithStyles<typeof styles> {}


const AppRouter = withStyles(styles)(({classes}: Props) => {

  const createComponent = (component: JSX.Element, displayName: string) => (
    <div>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <NavDrawer/>
          <Typography className={classes.heading} variant="h1" color="inherit" noWrap>
            {displayName}
          </Typography>
        </Toolbar>
      </AppBar>
      <main className={classes.content}>
        {component}
      </main>
    </div>
  );

  return (
    <Router>
      <div className={classes.root}>
        <CssBaseline />
        <Route exact path="/" render={() => createComponent(<IndexPage/>, 'Home Page')}/>
          <Route path="/switches" render={() => createComponent(<Switchboard/>, 'Switches')}/>
          <Route path="/contribution-types" render={() => createComponent(<ContributionTypesForm/>, 'Contribution Types')} />
          <Route path="/amounts" render={() => createComponent(<AmountsForm/>, 'Amounts')} />
          <Route path="/epic-tests" render={() => createComponent(<EpicTestsForm/>, 'Epic Tests')} />
          <Route path="/banner-tests" render={() => createComponent(<BannerTestsForm/>, 'Banner Tests')} />
      </div>
    </Router>
  );

});

ReactDOM.render(
  <AppRouter />,
  document.getElementById('root')
);
