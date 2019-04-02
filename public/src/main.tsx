import React from 'react';
import ReactDOM from 'react-dom';

import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Switchboard from './components/switchboard';
import ContributionTypesComponent from './components/contributionTypes';
import AmountsComponent from './components/amounts/amounts';
import { createStyles, Theme, WithStyles, withStyles } from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem';

const drawerWidth = 240;


const styles = ({ palette, spacing, mixins }: Theme) => createStyles({
  root: {
    display: 'flex',
  },
  appBar: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  toolbar: mixins.toolbar,
  content: {
    flexGrow: 1,
    backgroundColor: palette.background.default,
    padding: spacing.unit * 3,
  },
  link: {
    textDecoration: 'none',
  }
});

const Index = () => <h2>Home</h2>;

interface Props extends WithStyles<typeof styles> {}

const AppRouter = withStyles(styles)(({classes}: Props) => (
  <Router>
    <div className={classes.root}>
      <CssBaseline />
      <nav>
        <AppBar position="fixed" className={classes.appBar}>
          <Toolbar>
            <Typography variant="h6" color="inherit" noWrap>
              Support Admin Console
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer
          className={classes.drawer}
          variant="permanent"
          classes={{
            paper: classes.drawerPaper,
          }}
          anchor="left"
        >
          <div className={classes.toolbar} />
          <Divider />
          {/* TODO: use link from react router to avoid a full page reload */}
          <List>
            {[['/', 'Home'], ['/switches', 'Switches'], ['/contribution-types', 'Contribution Types'], ['/amounts', 'Amounts']].map(([href, name]) => (
              <Link to={href} className={classes.link}>
                <ListItem button key={name}>
                  <ListItemText primary={name} />
                </ListItem>
              </Link>
            ))}
          </List>
        </Drawer>
      </nav>

      <main className={classes.content}>
        <div className={classes.toolbar} />
        <Route path="/" exact component={Index} />
        <Route path="/switches" component={Switchboard} />
        <Route path="/contribution-types" component={ContributionTypesComponent} />
        <Route path="/amounts" component={AmountsComponent} />
      </main>
    </div>
  </Router>
));

ReactDOM.render(
  <AppRouter />,
  document.getElementById('root')
);
