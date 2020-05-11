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

const useStyles = makeStyles({
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
  heading: {
    fontSize: 24
  },
});

const anchor = 'left';

const getLinkPathsAndNames = (): string[][] =>
  [
    ['/switches', 'Switches'],
    ['/contribution-types', 'Contribution types'],
    ['/amounts', 'Amounts'],
    ['/epic-tests', 'Epic tests']
  ];

export default function TemporaryDrawer() {
  const classes = useStyles();
  const [state, setState] = React.useState({
    left: false,
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
      <List>

Channel Tests
        <Divider />
        <Link key='Epic tests' to='/epic-tests' className={classes.link}>
          <ListItem className={classes.listItem} button key='Epic tests'>
            <ListItemText primary='Epic tests' />
          </ListItem>
        </Link>
        <Divider />

Admin Console
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
        <Link key='Contribution Types' to='/contribution-types' className={classes.link}>
          <ListItem className={classes.listItem} button key='Contribution Types'>
            <ListItemText primary='Contribution Types' />
          </ListItem>
        </Link>
        <Divider/>
        <Link key='Contribution Types' to='/contribution-types' className={classes.link}>
          <ListItem className={classes.listItem} button key='Contribution Types'>
            <ListItemText primary='Contribution Types' />
          </ListItem>
        </Link>
      </List>
      <Divider/>
      Help Centre
      <Link key='Testing FAQ' to='https://docs.google.com/document/d/1PT-xQRrk9g-w-Tv9Du2G6aEXenSc806hEcQlZsvaJS0' className={classes.link}>
        <ListItem className={classes.listItem} button key='Testing FAQ'>
          <ListItemText primary='Testing FAQ'/>
        </ListItem>
      </Link>
    </div>
  );

  return (
    <Toolbar>

    <div>
        <React.Fragment key={anchor}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer(anchor, true)}
            edge="start"
            className={clsx(classes.menuButton, open && classes.hide)}
          >
            <MenuIcon />
          </IconButton>
          <Drawer anchor={anchor} open={state[anchor]} onClose={toggleDrawer(anchor, false)}>
            {list(anchor)}
          </Drawer>
        </React.Fragment>
    </div>
      <Typography className={classes.heading} variant="h1" color="inherit" noWrap>
        Support Admin Console
      </Typography>
    </Toolbar>

  );
}
