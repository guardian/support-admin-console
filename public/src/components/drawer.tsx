import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { styled } from '@mui/material/styles';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import RRControlPanelLogo from './rrControlPanelLogo';

const DrawerList = styled('div')({
  width: '20vw',
  minWidth: '260px',
});
const DrawerHeading = styled('div')({
  top: '0',
  left: '0',
  width: '100%',
  minHeight: '64px',
  paddingTop: '10px',
  paddingLeft: '10px',
  marginBottom: '12%',
  boxSizing: 'border-box',
  borderBottom: '1px solid #616161',
});
const DrawerLink = styled(Link)({
  textDecoration: 'none',
  color: '#616161',
});
const DrawerListItem = styled(ListItemButton)({
  borderTop: '1px solid #E0E0E0',
  marginLeft: '15%',
  width: '85%',
  '&:hover': {
    backgroundColor: '#ededed',
  },
  '&:focus': {
    backgroundColor: '#dcdcdc',
  },
});
const MenuButton = styled(IconButton)({
  marginRight: 20,
});
const SectionHeader = styled('h2')({
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
});
const TopSectionHeader = styled('h2')({
  width: '100%',
  paddingLeft: '5%',
  paddingTop: '7%',
  fontFamily: 'Roboto',
  fontStyle: 'normal',
  fontWeight: 'normal',
  fontSize: '18px',
  lineHeight: '20px',
});
const DrawerIcon = styled('img')({
  maxWidth: '32px',
});
const Bat = styled('img')({
  width: '60px',
});
const Super = styled('span')({
  fontSize: '20px',
});
const ExternalDrawerLink = styled('a')({
  textDecoration: 'none',
  color: '#616161',
});

const anchor = 'left';

export default function NavDrawer(): React.ReactElement {
  const navigate = useNavigate();
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

  const navigateInternalLink =
    () =>
    (event: React.MouseEvent): void => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.altKey ||
        event.ctrlKey ||
        event.shiftKey
      ) {
        return;
      }

      const link = (event.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="/"]');
      if (link) {
        event.preventDefault();
        void navigate(`${link.pathname}${link.search}${link.hash}`);
      }
    };

  const isHalloween = () => {
    const now = new Date();
    return now.getMonth() == 9 && now.getDate() == 31;
  };

  const list = (anchor: string): React.ReactElement => (
    <DrawerList
      role="presentation"
      onClickCapture={navigateInternalLink()}
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <DrawerHeading>
        <RRControlPanelLogo />
        {isHalloween() && <Bat src="/assets/images/bat.png" />}
      </DrawerHeading>

      <div>
        <TopSectionHeader>Channels</TopSectionHeader>
        <DrawerLink key="Campaigns" to="/campaigns">
          <DrawerListItem key="Campaigns">
            <ListItemText primary="Campaigns" />
          </DrawerListItem>
        </DrawerLink>
        <DrawerLink key="Header" to="/header-tests">
          <DrawerListItem key="Header">
            <ListItemText primary="Header" />
          </DrawerListItem>
        </DrawerLink>
        <DrawerLink key="Epic" to="/epic-tests">
          <DrawerListItem key="Epic">
            <ListItemText primary="Epic" />
          </DrawerListItem>
        </DrawerLink>
        <DrawerLink key="Apple News Epic" to="/apple-news-epic-tests">
          <DrawerListItem key="Apple News Epic">
            <ListItemText primary="Apple News Epic" />
            <DrawerIcon src="assets/images/apple-news-icon.png" />
          </DrawerListItem>
        </DrawerLink>
        <DrawerLink key="Liveblog Epic" to="/liveblog-epic-tests">
          <DrawerListItem key="Liveblog Epic">
            <ListItemText primary="Liveblog Epic" />
          </DrawerListItem>
        </DrawerLink>
        <DrawerLink key="Liveblog Gutter" to="/gutter-liveblog-tests">
          <DrawerListItem key="Liveblog Gutter">
            <ListItemText primary="Liveblog Gutter" />
          </DrawerListItem>
        </DrawerLink>
        <DrawerLink key="Banner 1" to="/banner-tests">
          <DrawerListItem key="Banner 1">
            <ListItemText primary="Banner 1" />
          </DrawerListItem>
        </DrawerLink>
        <DrawerLink key="Banner 2" to="/banner-tests2">
          <DrawerListItem key="Banner 2">
            <ListItemText primary="Banner 2" />
          </DrawerListItem>
        </DrawerLink>
        <DrawerLink key="Banner Design" to="/banner-designs">
          <DrawerListItem key="Banner Design">
            <ListItemText primary="Banner Design" />
            <Super>🎨</Super>
          </DrawerListItem>
        </DrawerLink>
      </div>

      <div>
        <SectionHeader>Support Site</SectionHeader>
        <DrawerLink key="Landing Page" to="/support-landing-page-tests">
          <DrawerListItem key="Landing Page">
            <ListItemText primary="Landing Page" />
          </DrawerListItem>
        </DrawerLink>
        <DrawerLink key="Student Landing Page Offers" to="/student-landing-page-tests">
          <DrawerListItem key="Student Landing Page Offers">
            <ListItemText primary="Student Landing Page Offers" />
          </DrawerListItem>
        </DrawerLink>
        <DrawerLink key="Checkout Nudge" to="/checkout-nudge-tests">
          <DrawerListItem key="Checkout Nudge">
            <ListItemText primary="Checkout Nudge" />
          </DrawerListItem>
        </DrawerLink>
        <DrawerLink key="Promo Tool" to="/promo-tool">
          <DrawerListItem key="Promo Tool">
            <ListItemText primary="Promo Tool" />
          </DrawerListItem>
        </DrawerLink>
        <DrawerLink key="Default Promos" to="/default-promos">
          <DrawerListItem key="Default Promos">
            <ListItemText primary="Default Promos" />
          </DrawerListItem>
        </DrawerLink>
        <DrawerLink key="One Time Checkout Tests" to="/one-time-checkout-tests">
          <DrawerListItem key="One Time Checkout Tests">
            <ListItemText primary="One Time Checkout Tests" />
          </DrawerListItem>
        </DrawerLink>
      </div>

      <div>
        <SectionHeader>Admin Console</SectionHeader>
        <DrawerLink key="Banner Deploy" to="/banner-deploy">
          <DrawerListItem key="Banner Deploy">
            <ListItemText primary="Banner Deploy" />
          </DrawerListItem>
        </DrawerLink>
        <DrawerLink key="Switches" to="/switches">
          <DrawerListItem key="Switches">
            <ListItemText primary="Switches" />
          </DrawerListItem>
        </DrawerLink>
        <DrawerLink key="Channel Switches" to="/channel-switches">
          <DrawerListItem key="Channel Switches">
            <ListItemText primary="Channel Switches" />
          </DrawerListItem>
        </DrawerLink>
        <DrawerLink key="App Meter Switches" to="/apps-metering-switches">
          <DrawerListItem key="App Meter Switches">
            <ListItemText primary="App Meter Switches" />
          </DrawerListItem>
        </DrawerLink>
        <DrawerLink key="Channel Exclusions" to="/exclusions">
          <DrawerListItem key="Channel Exclusions">
            <ListItemText primary="Channel Exclusions" />
          </DrawerListItem>
        </DrawerLink>
        <DrawerLink key="Default Choice Cards" to="/default-choice-cards">
          <DrawerListItem key="Default Choice Cards">
            <ListItemText primary="Default Choice Cards" />
          </DrawerListItem>
        </DrawerLink>
        <DrawerLink key="Test Audits" to="/audit-tests">
          <DrawerListItem key="Test Audits">
            <ListItemText primary="Test Audits" />
          </DrawerListItem>
        </DrawerLink>
        <DrawerLink key="Super Mode Dashboard" to="/super-mode">
          <DrawerListItem key="Super Mode Dashboard">
            <ListItemText primary="Super Mode Dashboard" />
            <Super>🦸</Super>
          </DrawerListItem>
        </DrawerLink>
        <DrawerLink key="Link Tracking Builder" to="/lynx">
          <DrawerListItem key="Link Tracking Builder">
            <ListItemText primary="Link Tracking Builder" />
          </DrawerListItem>
        </DrawerLink>
        <DrawerLink key="QR Code Generator" to="/qr-code">
          <DrawerListItem key="QR Code Generator">
            <ListItemText primary="QR Code Generator" />
          </DrawerListItem>
        </DrawerLink>
        <DrawerLink key="Bookmarklets" to="/bookmarklets">
          <DrawerListItem key="Bookmarklets">
            <ListItemText primary="Bookmarklets" />
          </DrawerListItem>
        </DrawerLink>
        <DrawerLink key="AccessManagement" to="/access-management">
          <DrawerListItem key="AccessManagement">
            <ListItemText primary="Access Management" />
          </DrawerListItem>
        </DrawerLink>
      </div>

      <div>
        <SectionHeader>Help Centre</SectionHeader>
        <ExternalDrawerLink
          href="https://forms.gle/Z8Fzn6iw2d9F631n9"
          key="Report an issue"
          target="_blank"
          rel="noopener noreferrer"
        >
          <DrawerListItem key="Report an issue">
            <ListItemText primary="Report an issue" />
          </DrawerListItem>
        </ExternalDrawerLink>
      </div>
    </DrawerList>
  );

  return (
    <div>
      <React.Fragment key={anchor}>
        <MenuButton
          color="inherit"
          aria-label="open drawer"
          onClick={toggleDrawer(anchor, true)}
          edge="start"
        >
          <MenuIcon />
        </MenuButton>
        <Drawer anchor={anchor} open={state[anchor]} onClose={toggleDrawer(anchor, false)}>
          {list(anchor)}
        </Drawer>
      </React.Fragment>
    </div>
  );
}
