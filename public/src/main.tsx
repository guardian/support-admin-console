import React from 'react';
import ReactDOM from 'react-dom';

import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Switchboard from './components/switchboard';
import ContributionTypesForm from './components/contributionTypes';
import AmountsForm from './components/amounts/amounts';
import EpicTestsForm from './components/epicTests/epicTestsForm';
import { createStyles, Theme, WithStyles, withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem';
import {CSSProperties} from "@material-ui/core/styles/withStyles";
import {Menu} from "@material-ui/core";
import MenuItem from "@material-ui/core/MenuItem";
import SimpleMenu from "./utils/menu";
import TemporaryDrawer from "./utils/drawer";
import PersistentDrawerLeft from "./utils/persistentDrawer";
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
          <Toolbar>
            <TemporaryDrawer/>
            <Typography className={classes.heading} variant="h1" color="inherit" noWrap>
              Support Admin Console
            </Typography>
          </Toolbar>
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
