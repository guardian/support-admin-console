import React from 'react';
import ReactDOM from 'react-dom';

import {BrowserRouter as Router, Route} from 'react-router-dom';
import Switchboard from './components/switchboard';
import ContributionTypesForm from './components/contributionTypes';
import AmountsForm from './components/amounts/amounts';
import EpicTestsForm from './components/epicTests/epicTestsForm';
import {createStyles, Theme, WithStyles, withStyles} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import {CSSProperties} from "@material-ui/core/styles/withStyles";
import TemporaryDrawer from "./utils/drawer";
import clsx from "clsx";

const drawerWidth = 240;

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
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  toolbar: mixins.toolbar as CSSProperties, // createStyles expects material-ui's CSSProperties type, not react's
  content: {
    flexGrow: 1,
    backgroundColor: palette.background.default,
    padding: spacing(3),
  },
  link: {
    textDecoration: 'none'
  },
  heading: {
    fontSize: typography.pxToRem(24),
    fontWeight: typography.fontWeightMedium
  },
  listItem: {
    '&:hover': {
      backgroundColor: '#ededed'
    },
    '&:focus': {
      backgroundColor: '#dcdcdc'
    },
  }
});

const getLinkPathsAndNames = (): string[][] =>
  [
    ['/switches', 'Switches'],
    ['/contribution-types', 'Contribution types'],
    ['/amounts', 'Amounts'],
    ['/epic-tests', 'Epic tests']
  ];

const Index = () => <h2>Home</h2>;

interface Props extends WithStyles<typeof styles> {}

const AppRouter = withStyles(styles)(({classes}: Props) => (

  <Router>
    <div className={classes.root}>
      <CssBaseline />
      <nav>
        <AppBar
          position="fixed"
          className={clsx(classes.appBar, {
            [classes.appBarShift]: open,
          })}
        >
          <TemporaryDrawer/>
        </AppBar>

      </nav>

      <main className={classes.content}>
        <div className={classes.toolbar} />
        <Route path="/" exact component={Index} />
        <Route path="/switches" component={Switchboard} />
        <Route path="/contribution-types" component={ContributionTypesForm} />
        <Route path="/amounts" component={AmountsForm} />
        <Route path="/epic-tests" component={EpicTestsForm} />
      </main>
    </div>
  </Router>
));

ReactDOM.render(
  <AppRouter />,
  document.getElementById('root')
);
