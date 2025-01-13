import React from 'react';
import Drawer from '@mui/material/Drawer';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { Link } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { makeStyles } from '@mui/styles';
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

  const isHalloween = () => {
    const now = new Date();
    return now.getMonth() == 9 && now.getDate() == 31;
  };
  /* HIDING GUTTER ASK UNTIL READY */
  const showGutterAsk = true;

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
        <h2 className={classes.topSectionHeader}>Channel Management</h2>
        <Link key="Campaigns" to="/campaigns" className={classes.link}>
          <ListItem className={classes.listItem} button key="Campaigns">
            <ListItemText primary="Campaigns" />
          </ListItem>
        </Link>
        <Link key="Header" to="/header-tests" className={classes.link}>
          <ListItem className={classes.listItem} button key="Header">
            <ListItemText primary="Header" />
          </ListItem>
        </Link>
        <Link key="Epic" to="/epic-tests" className={classes.link}>
          <ListItem className={classes.listItem} button key="Epic">
            <ListItemText primary="Epic" />
          </ListItem>
        </Link>
        <Link key="Liveblog Epic" to="/liveblog-epic-tests" className={classes.link}>
          <ListItem className={classes.listItem} button key="Liveblog Epic">
            <ListItemText primary="Liveblog Epic" />
          </ListItem>
        </Link>
        <Link key="Apple News Epic" to="/apple-news-epic-tests" className={classes.link}>
          <ListItem className={classes.listItem} button key="Apple News Epic">
            <ListItemText primary="Apple News Epic" />
            <img className={classes.icon} src="assets/images/apple-news-icon.png" />
          </ListItem>
        </Link>
        <Link key="AMP Epic" to="/amp-epic-tests" className={classes.link}>
          <ListItem className={classes.listItem} button key="AMP Epic">
            <ListItemText primary="AMP Epic" />
            <img className={classes.icon} src="assets/images/amp-icon.png" />
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
        <Link key="Banner Deploy" to="/banner-deploy" className={classes.link}>
          <ListItem className={classes.listItem} button key="Banner Deploy">
            <ListItemText primary="Banner Deploy" />
          </ListItem>
        </Link>
        {showGutterAsk && <Link key="Gutter Ask" to="/gutter-ask" className={classes.link}>
          <ListItem className={classes.listItem} button key="Gutter Ask">
            <ListItemText primary="Gutter Ask" />
          </ListItem>
        </Link>}
        <Link key="Channel Switches" to="/channel-switches" className={classes.link}>
          <ListItem className={classes.listItem} button key="Channel Switches">
            <ListItemText primary="Channel Switches" />
          </ListItem>
        </Link>
        <Link key="Super Mode" to="/super-mode" className={classes.link}>
          <ListItem className={classes.listItem} button key="Super Mode">
            <ListItemText primary="Epic Super Mode Dashboard" />
            <span className={classes.super}>🦸</span>
          </ListItem>
        </Link>
        <Link key="Banner Designs" to="/banner-designs" className={classes.link}>
          <ListItem className={classes.listItem} button key="Banner Designs">
            <ListItemText primary="Banner Designs" />
            <span className={classes.super}>🎨</span>
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
        <Link key="QR Code Generator" to="/qr-code" className={classes.link}>
          <ListItem className={classes.listItem} button key="QR Code Generator">
            <ListItemText primary="QR Code Generator" />
          </ListItem>
        </Link>
        <Link key="Link Tracking Builder" to="/lynx" className={classes.link}>
          <ListItem className={classes.listItem} button key="Link Tracking Builder">
            <ListItemText primary="Link Tracking Builder" />
          </ListItem>
        </Link>
        <Link key="Apps Metering Switches" to="/apps-metering-switches" className={classes.link}>
          <ListItem className={classes.listItem} button key="Apps Metering Switches">
            <ListItemText primary="Apps Metering Switches" />
          </ListItem>
        </Link>
        <Link key="Default Promos" to="/default-promos" className={classes.link}>
          <ListItem className={classes.listItem} button key="Default Promos">
            <ListItemText primary="Default Promos" />
          </ListItem>
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
          <ListItem className={classes.listItem} button key="Report an issue">
            <ListItemText primary="Report an issue" />
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
