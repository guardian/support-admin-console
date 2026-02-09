import React from 'react';
import Drawer from '@mui/material/Drawer';
import ListItemText from '@mui/material/ListItemText';
import { Link } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { makeStyles } from '@mui/styles';
import RRControlPanelLogo from './rrControlPanelLogo';
import { getStage } from '../utils/stage';
import ListItemButton from '@mui/material/ListItemButton';

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

  icon: {
    maxWidth: '32px',
  },
  bat: {
    width: '60px',
  },
  super: {
    fontSize: '20px',
  },
});

const anchor = 'left';

export default function NavDrawer(): React.ReactElement {
  const classes = useStyles();
  const [state, setState] = React.useState({
    left: false,
  });

  const toggleDrawer =
    (anchor: string, open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent): void => {
      if (
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }

      setState({ ...state, [anchor]: open });
    };

  const isHalloween = () => {
    const now = new Date();
    return now.getMonth() == 9 && now.getDate() == 31;
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
        {isHalloween() && <img src="/assets/images/bat.png" className={classes.bat} />}
      </div>

      <div>
        <h2 className={classes.topSectionHeader}>Channels</h2>
        <Link key="Campaigns" to="/campaigns" className={classes.link}>
          <ListItemButton className={classes.listItem} key="Campaigns">
            <ListItemText primary="Campaigns" />
          </ListItemButton>
        </Link>
        <Link key="Header" to="/header-tests" className={classes.link}>
          <ListItemButton className={classes.listItem} key="Header">
            <ListItemText primary="Header" />
          </ListItemButton>
        </Link>
        <Link key="Epic" to="/epic-tests" className={classes.link}>
          <ListItemButton className={classes.listItem} key="Epic">
            <ListItemText primary="Epic" />
          </ListItemButton>
        </Link>
        <Link key="Apple News Epic" to="/apple-news-epic-tests" className={classes.link}>
          <ListItemButton className={classes.listItem} key="Apple News Epic">
            <ListItemText primary="Apple News Epic" />
            <img className={classes.icon} src="assets/images/apple-news-icon.png" />
          </ListItemButton>
        </Link>
        <Link key="Liveblog Epic" to="/liveblog-epic-tests" className={classes.link}>
          <ListItemButton className={classes.listItem} key="Liveblog Epic">
            <ListItemText primary="Liveblog Epic" />
          </ListItemButton>
        </Link>
        <Link key="Liveblog Gutter" to="/gutter-liveblog-tests" className={classes.link}>
          <ListItemButton className={classes.listItem} key="Liveblog Gutter">
            <ListItemText primary="Liveblog Gutter" />
          </ListItemButton>
        </Link>
        <Link key="Banner 1" to="/banner-tests" className={classes.link}>
          <ListItemButton className={classes.listItem} key="Banner 1">
            <ListItemText primary="Banner 1" />
          </ListItemButton>
        </Link>
        <Link key="Banner 2" to="/banner-tests2" className={classes.link}>
          <ListItemButton className={classes.listItem} key="Banner 2">
            <ListItemText primary="Banner 2" />
          </ListItemButton>
        </Link>
        <Link key="Banner Design" to="/banner-designs" className={classes.link}>
          <ListItemButton className={classes.listItem} key="Banner Design">
            <ListItemText primary="Banner Design" />
            <span className={classes.super}>🎨</span>
          </ListItemButton>
        </Link>
      </div>

      <div>
        <h2 className={classes.sectionHeader}>Support Site</h2>
        <Link key="Landing Page" to="/support-landing-page-tests" className={classes.link}>
          <ListItemButton className={classes.listItem} key="Landing Page">
            <ListItemText primary="Landing Page" />
          </ListItemButton>
        </Link>
        {getStage() != 'PROD' && (
          <Link
            key="Student Landing Page Offers"
            to="/student-landing-page-tests"
            className={classes.link}
          >
            <ListItemButton className={classes.listItem} key="Student Landing Page Offers">
              <ListItemText primary="Student Landing Page Offers" />
            </ListItemButton>
          </Link>
        )}
        <Link key="Checkout Nudge" to="/checkout-nudge-tests" className={classes.link}>
          <ListItemButton className={classes.listItem} key="Checkout Nudge">
            <ListItemText primary="Checkout Nudge" />
          </ListItemButton>
        </Link>
        <Link key="Single Amounts" to="/amounts" className={classes.link}>
          <ListItemButton className={classes.listItem} key="Single Amounts">
            <ListItemText primary="Single Amounts" />
          </ListItemButton>
        </Link>
        <Link key="Promo Tool" to="/promo-tool" className={classes.link}>
          <ListItemButton className={classes.listItem} key="Promo Tool">
            <ListItemText primary="Promo Tool" />
          </ListItemButton>
        </Link>
        <Link key="Default Promos" to="/default-promos" className={classes.link}>
          <ListItemButton className={classes.listItem} key="Default Promos">
            <ListItemText primary="Default Promos" />
          </ListItemButton>
        </Link>
        {getStage() != 'PROD' && (
          <Link
            key="One Time Checkout Tests"
            to="/one-time-checkout-tests"
            className={classes.link}
          >
            <ListItemButton className={classes.listItem} key="One Time Checkout Tests">
              <ListItemText primary="One Time Checkout Tests" />
            </ListItemButton>
          </Link>
        )}
      </div>

      <div>
        <h2 className={classes.sectionHeader}>Admin Console</h2>
        <Link key="Banner Deploy" to="/banner-deploy" className={classes.link}>
          <ListItemButton className={classes.listItem} key="Banner Deploy">
            <ListItemText primary="Banner Deploy" />
          </ListItemButton>
        </Link>
        <Link key="Switches" to="/switches" className={classes.link}>
          <ListItemButton className={classes.listItem} key="Switches">
            <ListItemText primary="Switches" />
          </ListItemButton>
        </Link>
        <Link key="Channel Switches" to="/channel-switches" className={classes.link}>
          <ListItemButton className={classes.listItem} key="Channel Switches">
            <ListItemText primary="Channel Switches" />
          </ListItemButton>
        </Link>
        <Link key="App Meter Switches" to="/apps-metering-switches" className={classes.link}>
          <ListItemButton className={classes.listItem} key="App Meter Switches">
            <ListItemText primary="App Meter Switches" />
          </ListItemButton>
        </Link>
        <Link key="Test Audits" to="/audit-tests" className={classes.link}>
          <ListItemButton className={classes.listItem} key="Test Audits">
            <ListItemText primary="Test Audits" />
          </ListItemButton>
        </Link>
        <Link key="Super Mode Dashboard" to="/super-mode" className={classes.link}>
          <ListItemButton className={classes.listItem} key="Super Mode Dashboard">
            <ListItemText primary="Super Mode Dashboard" />
            <span className={classes.super}>🦸</span>
          </ListItemButton>
        </Link>
        <Link key="Link Tracking Builder" to="/lynx" className={classes.link}>
          <ListItemButton className={classes.listItem} key="Link Tracking Builder">
            <ListItemText primary="Link Tracking Builder" />
          </ListItemButton>
        </Link>
        <Link key="QR Code Generator" to="/qr-code" className={classes.link}>
          <ListItemButton className={classes.listItem} key="QR Code Generator">
            <ListItemText primary="QR Code Generator" />
          </ListItemButton>
        </Link>
        <Link key="Bookmarklets" to="/bookmarklets" className={classes.link}>
          <ListItemButton className={classes.listItem} key="Bookmarklets">
            <ListItemText primary="Bookmarklets" />
          </ListItemButton>
        </Link>
        <Link key="AccessManagement" to="/access-management" className={classes.link}>
          <ListItemButton className={classes.listItem} key="AccessManagement">
            <ListItemText primary="Access Management" />
          </ListItemButton>
        </Link>
      </div>

      <div>
        <h2 className={classes.sectionHeader}>Help Centre</h2>
        <a
          href="https://forms.gle/Z8Fzn6iw2d9F631n9"
          key="Report an issue"
          className={classes.link}
          target="_blank"
          rel="noopener noreferrer"
        >
          <ListItemButton className={classes.listItem} key="Report an issue">
            <ListItemText primary="Report an issue" />
          </ListItemButton>
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
