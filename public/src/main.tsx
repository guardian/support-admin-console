import { StyledEngineProvider } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import { Theme, ThemeProvider } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { makeStyles, ThemeProvider as StylesThemeProvider } from '@mui/styles';
import React, { lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import NavDrawer from './components/drawer';
import IndexPage from './components/indexPage';
import { HELP_GUIDE_URL } from './constants';
import { getTheme } from './utils/theme';

const AccessManagement = lazy(() => import('./components/accessManagement/AccessManagement'));
const AppsMeteringSwitches = lazy(() => import('./components/appsMeteringSwitches'));
const Bookmarklets = lazy(() => import('./components/bookmarklets/Bookmarklets'));
const ExclusionsBoard = lazy(() => import('./components/channelExclusions/ExclusionsBoard'));
const AuditTestsDashboard = lazy(() =>
  import('./components/channelManagement/auditTests/auditTestsDashboard').then((m) => ({
    default: m.AuditTestsDashboard,
  })),
);
const BannerDeployDashboard = lazy(
  () => import('./components/channelManagement/bannerDeploy/bannerDeployDashboard'),
);
const BannerDesigns = lazy(() => import('./components/channelManagement/bannerDesigns/'));
const BannerTestsForm1 = lazy(() =>
  import('./components/channelManagement/bannerTests/bannerTestsForm').then((m) => ({
    default: m.BannerTestsForm1,
  })),
);
const BannerTestsForm2 = lazy(() =>
  import('./components/channelManagement/bannerTests/bannerTestsForm').then((m) => ({
    default: m.BannerTestsForm2,
  })),
);
const CampaignsForm = lazy(() => import('./components/channelManagement/campaigns/CampaignsForm'));
const ChannelSwitches = lazy(() => import('./components/channelManagement/ChannelSwitches'));
const CheckoutNudgeTestsForm = lazy(() =>
  import('./components/channelManagement/checkoutNudge/checkoutNudge').then((m) => ({
    default: m.CheckoutNudgeTestsForm,
  })),
);
const AppleNewsEpicTestsForm = lazy(() =>
  import('./components/channelManagement/epicTests/testsForm').then((m) => ({
    default: m.AppleNewsEpicTestsForm,
  })),
);
const ArticleEpicTestsForm = lazy(() =>
  import('./components/channelManagement/epicTests/testsForm').then((m) => ({
    default: m.ArticleEpicTestsForm,
  })),
);
const LiveblogEpicTestsForm = lazy(() =>
  import('./components/channelManagement/epicTests/testsForm').then((m) => ({
    default: m.LiveblogEpicTestsForm,
  })),
);
const GutterTestsForm = lazy(() =>
  import('./components/channelManagement/gutterTests/gutterTestsForm').then((m) => ({
    default: m.GutterTestsForm,
  })),
);
const HeaderTestsForm = lazy(() =>
  import('./components/channelManagement/headerTests/headerTestsForm').then((m) => ({
    default: m.HeaderTestsForm,
  })),
);
const OneTimeCheckoutTestsForm = lazy(() =>
  import('./components/channelManagement/oneTimeCheckout/oneTimeCheckout').then((m) => ({
    default: m.OneTimeCheckoutTestsForm,
  })),
);
const StudentLandingPageTestsForm = lazy(() =>
  import('./components/channelManagement/studentLandingPage/studentLandingPage').then((m) => ({
    default: m.StudentLandingPageTestsForm,
  })),
);
const SuperModeDashboard = lazy(() =>
  import('./components/channelManagement/superMode/superModeDashboard').then((m) => ({
    default: m.SuperModeDashboard,
  })),
);
const SupportLandingPageTestsForm = lazy(() =>
  import('./components/channelManagement/supportLandingPage/supportLandingPage').then((m) => ({
    default: m.SupportLandingPageTestsForm,
  })),
);
const DefaultPromos = lazy(() => import('./components/defaultPromos'));
const DefaultChoiceCards = lazy(() => import('./components/defaultChoiceCards'));
const LinkTrackingBuilder = lazy(() =>
  import('./components/linkTracking/LinkTrackingBuilder').then((m) => ({
    default: m.LinkTrackingBuilder,
  })),
);
const PromoEditorPage = lazy(() => import('./components/promoTool/promoEditorPage'));
const PromoTool = lazy(() => import('./components/promoTool/promoTool'));
const Switchboard = lazy(() => import('./components/switchboard'));
const QrCodePage = lazy(() => import('./components/utilities/QrCodePage'));

declare module '@mui/styles' {
  // https://mui.com/material-ui/migration/v5-style-changes/#%E2%9C%85-add-module-augmentation-for-defaulttheme-typescript
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type -- MUI module augmentation
  interface DefaultTheme extends Theme {}
}

interface PagePermission {
  name: string;
  permission: 'Read' | 'Write';
}

type Stage = 'CODE' | 'PROD';
declare global {
  interface Window {
    guardian: {
      stage: Stage;
      sdcUrlOverride: string | undefined;
      permissions: PagePermission[];
    };
  }
}

const useStyles = makeStyles(({ palette, mixins, typography, transitions }: Theme) => ({
  root: {
    display: 'flex',
  },
  appContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '100vw',
    height: '100vh',
  },
  appBar: {
    transition: transitions.create(['margin', 'width'], {
      easing: transitions.easing.sharp,
      duration: transitions.duration.leavingScreen,
    }),
  },
  appContent: {
    display: 'flex',
    flexDirection: 'column',
    overflowX: 'hidden',
    overflowY: 'auto',
    flexGrow: 1,
    backgroundColor: palette.grey[100],
  },
  toolbar: mixins.toolbar,
  heading: {
    fontSize: typography.pxToRem(24),
    fontWeight: typography.fontWeightMedium,
  },
  toolbarContent: {
    width: '100%',
    justifyContent: 'space-between',
  },
  link: {
    fontSize: typography.pxToRem(12),
    fontWeight: typography.fontWeightMedium,
    textDecoration: 'none',
  },
  guideButton: {
    borderColor: palette.grey[100],
    color: palette.grey[100],
  },
}));

export { HELP_GUIDE_URL };

const AppRouter = () => {
  const classes = useStyles();

  const createComponent = (component: JSX.Element, displayName: string): React.ReactElement => (
    <div className={classes.appContainer}>
      <AppBar position="relative" className={classes.appBar}>
        <Toolbar className={classes.toolbarContent}>
          <NavDrawer />
          <Typography className={classes.heading} variant="h1" color="inherit" noWrap>
            {displayName}
          </Typography>
          <a
            href={HELP_GUIDE_URL}
            className={classes.link}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button className={classes.guideButton} variant="outlined" disableElevation>
              User Guide
            </Button>
          </a>
        </Toolbar>
      </AppBar>
      <main className={classes.appContent}>
        <Suspense fallback={<div>Loading…</div>}>{component}</Suspense>
      </main>
    </div>
  );

  return (
    <Router>
      <div className={classes.root}>
        <CssBaseline />
        <Routes>
          <Route path="/" element={createComponent(<IndexPage />, 'Home Page')} />
          <Route path="/switches" element={createComponent(<Switchboard />, 'Switches')} />
          <Route
            path="/header-tests/:testName?"
            element={createComponent(<HeaderTestsForm />, 'Header Tests')}
          />
          <Route
            path="/epic-tests/:testName?"
            element={createComponent(<ArticleEpicTestsForm />, 'Epic Tests')}
          />
          <Route
            path="/support-landing-page-tests/:testName?"
            element={createComponent(<SupportLandingPageTestsForm />, 'Support Landing Page Tests')}
          />
          <Route
            path="/student-landing-page-tests/:testName?"
            element={createComponent(
              <StudentLandingPageTestsForm />,
              'Student Landing Page Offers',
            )}
          />
          <Route
            path="/checkout-nudge-tests/:testName?"
            element={createComponent(<CheckoutNudgeTestsForm />, 'Checkout Nudge Tests')}
          />
          <Route
            path="/liveblog-epic-tests/:testName?"
            element={createComponent(<LiveblogEpicTestsForm />, 'Liveblog Epic Tests')}
          />
          <Route
            path="/apple-news-epic-tests/:testName?"
            element={createComponent(<AppleNewsEpicTestsForm />, 'Apple News Epics')}
          />
          <Route
            path="/banner-tests/:testName?"
            element={createComponent(<BannerTestsForm1 />, 'Banner Tests 1')}
          />
          <Route
            path="/banner-tests2/:testName?"
            element={createComponent(<BannerTestsForm2 />, 'Banner Tests 2')}
          />
          <Route
            path="/banner-deploy"
            element={createComponent(<BannerDeployDashboard />, 'Banner Deploy')}
          />
          <Route
            path="/gutter-liveblog-tests/:testName?"
            element={createComponent(<GutterTestsForm />, 'Gutter Liveblog Tests')}
          />
          <Route
            path="/channel-switches"
            element={createComponent(<ChannelSwitches />, 'Channel Switches')}
          />
          <Route
            path="/campaigns/:campaignName?"
            element={createComponent(<CampaignsForm />, 'Campaigns')}
          />
          <Route path="/qr-code" element={createComponent(<QrCodePage />, 'QR Code Generator')} />
          <Route
            path="/lynx"
            element={createComponent(<LinkTrackingBuilder />, 'Link Tracking Builder')}
          />
          <Route
            path="/apps-metering-switches"
            element={createComponent(<AppsMeteringSwitches />, 'Apps Metering Switches')}
          />
          <Route
            path="/super-mode"
            element={createComponent(<SuperModeDashboard />, 'Epic Super Mode dashboard 🦸')}
          />
          <Route path="/promo-tool" element={createComponent(<PromoTool />, 'Promo Tool')} />
          <Route
            path="/promo-tool/campaign/:campaignCode"
            element={createComponent(<PromoTool />, 'Promo Tool')}
          />
          <Route
            path="/promo-tool/promo/:promoCode"
            element={createComponent(<PromoEditorPage />, 'Edit Promo')}
          />
          <Route
            path="/default-promos"
            element={createComponent(<DefaultPromos />, 'Default Promos')}
          />
          <Route
            path="/default-choice-cards"
            element={createComponent(<DefaultChoiceCards />, 'Default Choice Cards')}
          />
          <Route
            path="/banner-designs/:bannerDesignName?"
            element={createComponent(<BannerDesigns />, 'Banner Designs')}
          />
          <Route
            path="/audit-tests/:channel?/:testName?"
            element={createComponent(<AuditTestsDashboard />, 'Test Audits')}
          />
          <Route
            path="/bookmarklets"
            element={createComponent(<Bookmarklets />, 'Reader Revenue Bookmarklets')}
          />
          <Route
            path="/access-management"
            element={createComponent(<AccessManagement />, 'Access Management')}
          />
          <Route
            path="/one-time-checkout-tests/:testName?"
            element={createComponent(<OneTimeCheckoutTestsForm />, 'One Time Checkout Tests')}
          />
          <Route path="/exclusions" element={createComponent(<ExclusionsBoard />, 'Exclusions')} />
        </Routes>
      </div>
    </Router>
  );
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <ThemeProvider theme={getTheme()}>
      <StyledEngineProvider injectFirst>
        <StylesThemeProvider theme={getTheme()}>
          <AppRouter />
        </StylesThemeProvider>
      </StyledEngineProvider>
    </ThemeProvider>,
  );
} else {
  console.error('No root element found');
}
