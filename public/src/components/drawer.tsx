import React from 'react';
import Drawer from '@material-ui/core/Drawer';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { Link } from 'react-router-dom';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import makeStyles from '@material-ui/core/styles/makeStyles';
import RRControlPanelLogo from './rrControlPanelLogo';

const useStyles = makeStyles({
  list: {
    width: '20vw',
    minWidth: '260px',
  },

  drawerHeading: {
    top: '0',
    left: '0',
    width: '100%',
    minHeight: '64px',
    paddingTop: '10px',
    paddingLeft: '10px',
    marginBottom: '12%',
    boxSizing: 'border-box',
    borderBottom: '1px solid #616161',
  },

  link: {
    textDecoration: 'none',
    color: '#616161',
  },

  disabledListItem: {
    borderTop: '1px solid #E0E0E0',
    marginLeft: '15%',
    width: '85%',
    '&:after': {
      content: ' (disabled)',
    },
  },

  listItem: {
    borderTop: '1px solid #E0E0E0',
    marginLeft: '15%',
    width: '85%',
    '&:hover': {
      backgroundColor: '#ededed',
    },
    '&:focus': {
      backgroundColor: '#dcdcdc',
    },
  },

  menuButton: {
    marginRight: 20,
  },

  fullWidthRule: {
    width: '100%',
    borderTop: '1px solid #616161',
  },

  sectionHeader: {
    borderTop: '1px solid #616161',
    width: '100%',
    paddingLeft: '5%',
    paddingTop: '7%',
    marginTop: '13%',
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: '18px',
    lineHeight: '20px',
  },

  topSectionHeader: {
    width: '100%',
    paddingLeft: '5%',
    paddingTop: '7%',
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: '18px',
    lineHeight: '20px',
  },
});

const anchor = 'left';

export default function NavDrawer(): React.ReactElement {
  const classes = useStyles();
  const [state, setState] = React.useState({
    left: false,
  });

  const toggleDrawer = (anchor: string, open: boolean) => (
    event: React.KeyboardEvent | React.MouseEvent,
  ): void => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const list = (anchor: string): React.ReactElement => (
    <div
      className={classes.list}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <div className={classes.drawerHeading}>
        <RRControlPanelLogo />
      </div>

      <div>
        <h2 className={classes.topSectionHeader}>Channel Management</h2>
        <Link key="Epic" to="/epic-tests" className={classes.link}>
          <ListItem className={classes.listItem} button key="Epic">
            <ListItemText primary="Epic" />
          </ListItem>
        </Link>
        <Link key="Banner1" to="/banner-tests" className={classes.link}>
          <ListItem className={classes.listItem} button key="Banner1">
            <ListItemText primary="Banner 1" />
          </ListItem>
        </Link>
        <Link key="Banner2" to="/banner-tests2" className={classes.link}>
          <ListItem className={classes.listItem} button key="Banner2">
            <ListItemText primary="Banner 2" />
          </ListItem>
        </Link>
      </div>

      <div>
        <h2 className={classes.sectionHeader}>Admin Console</h2>
        <Link key="Switches" to="/switches" className={classes.link}>
          <ListItem className={classes.listItem} button key="Switches">
            <ListItemText primary="Switches" />
          </ListItem>
        </Link>
        <Link key="Amounts" to="/amounts" className={classes.link}>
          <ListItem className={classes.listItem} button key="Amounts">
            <ListItemText primary="Amounts" />
          </ListItem>
        </Link>
        <Link key="Contribution Types" to="/contribution-types" className={classes.link}>
          <ListItem className={classes.listItem} button key="Contribution Types">
            <ListItemText primary="Contribution Types" />
          </ListItem>
        </Link>
      </div>

      <div>
        <h2 className={classes.sectionHeader}>Help Centre</h2>
        <a
          href="https://docs.google.com/document/d/15XeUDHMSt7Urv0I3LyAAhC8kcC2JRWtkiD1xlEVitcE"
          key="Testing FAQ"
          className={classes.link}
        >
          <ListItem className={classes.listItem} button key="Testing FAQ">
            <ListItemText primary="Testing FAQ" />
          </ListItem>
        </a>
      </div>
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
          className={classes.menuButton}
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
