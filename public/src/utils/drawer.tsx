import React from 'react';
import clsx from 'clsx';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import {Link} from "react-router-dom";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import makeStyles from "@material-ui/core/styles/makeStyles";
import RoundelSVG from "./roundel";

const useStyles = makeStyles({
  list: {
    margin: 10
  },
  drawerHeading: {
    fontSize: 20,
    display: 'inline-block',
    padding: 20
  },
  link: {
    textDecoration: 'none',
    color: '#616161'
  },
  listItem: {
    '&:hover': {
      backgroundColor: '#ededed'
    },
    '&:focus': {
      backgroundColor: '#dcdcdc'
    },
  },

  menuButton: {
    marginRight: 20,
  },
});

const anchor = 'left';

export default function NavDrawer() {
  const classes = useStyles();
  const [state, setState] = React.useState({
    left: false
  });

  const toggleDrawer = (anchor: string, open: boolean) => (
    event: React.KeyboardEvent | React.MouseEvent,
  ) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const list = (anchor: string) => (
    <div
      className={clsx(classes.list)}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <RoundelSVG/>
      <h2 className={classes.drawerHeading}>Support Station</h2>
      <Divider/>
      <List>
        <h2>Channel Tests</h2>
        <Divider />
        <Link key='Epic tests' to='/epic-tests' className={classes.link}>
          <ListItem className={classes.listItem} button key='Epic tests'>
            <ListItemText primary='Epic tests'/>
          </ListItem>
        </Link>
        <Divider />
        <Link key='Banner Tool' to='/epic-tests' className={classes.link}>
          <ListItem className={classes.listItem} button key='Banner Tool'>
            <ListItemText primary='Banner Tool'/>
          </ListItem>
        </Link>
        <Divider />

        <h2>Admin Console</h2>
        <Divider/>
        <Link key='Switches' to='/switches' className={classes.link}>
          <ListItem className={classes.listItem} button key='Switches'>
            <ListItemText primary='Switches' />
          </ListItem>
        </Link>
        <Divider/>
        <Link key='Amounts' to='/amounts' className={classes.link}>
          <ListItem className={classes.listItem} button key='Amounts'>
            <ListItemText primary='Amounts' />
          </ListItem>
        </Link>
        <Divider/>
        <Link key='Contribution Types' to='/contribution-types' className={classes.link} >
          <ListItem className={classes.listItem} button key='Contribution Types'>
            <ListItemText primary='Contribution Types' />
          </ListItem>
        </Link>
      </List>
      <Divider/>
      <h2>Help Centre</h2>
      <a href='https://docs.google.com/document/d/1PT-xQRrk9g-w-Tv9Du2G6aEXenSc806hEcQlZsvaJS0' key='Testing FAQ' className={classes.link}>
        <ListItem className={classes.listItem} button key='Testing FAQ'>
          <ListItemText primary='Testing FAQ'/>
        </ListItem>
      </a>
    </div>
  );

  return (
    <div>
        <React.Fragment key={anchor}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer(anchor, true)}
            edge="start"
            className={clsx(classes.menuButton)}
          >
            <MenuIcon />
          </IconButton>
          <Drawer anchor={anchor} open={state[anchor]} onClose={toggleDrawer(anchor, false)}>
            {list(anchor)}
          </Drawer>
        </React.Fragment>
    </div>
  );
}
