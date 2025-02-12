import React, { useState } from 'react';
import { Button, Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Drawer from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';
import { buildStorybookUrl } from '../helpers/dcrStorybook';
import {
  SupportLandingPageCopy,
  SupportLandingPageVariant,
} from '../../../models/supportLandingPage';

// Mock prices data
interface ProductPriceData {
  Monthly: {
    price: string;
  };
  Annual: {
    price: string;
  };
}
interface CountryGroupPriceData {
  GuardianWeekly: ProductPriceData;
  Digisub: ProductPriceData;
}
type Prices = {
  [index: string]: CountryGroupPriceData;
};

interface SupportLandingPageProps {
  tracking: {
    ophanPageId: string;
    platformId: string;
    referrerUrl: string;
    clientName: string;
    abTestName: string;
    abTestVariant: string;
    campaignCode: string;
    campaignId: string;
    componentType: string;
    products: string[];
  };
  isSupporter: boolean;
  countryCode?: string;
  prices?: Prices;
  copy: SupportLandingPageCopy;
}

const anchor = 'bottom';

const buildProps = (variant: SupportLandingPageVariant): SupportLandingPageProps => {
  return {
    tracking: {
      ophanPageId: 'ophanPageId',
      platformId: 'GUARDIAN_WEB',
      clientName: 'frontend',
      referrerUrl: 'https://www.theguardian.com/',
      abTestName: 'abTestName',
      abTestVariant: variant.name,
      campaignCode: 'campaignCode',
      campaignId: '',
      componentType: 'ACQUISITIONS_ENGAGEMENT_BANNER',
      products: [],
    },
    isSupporter: false,
    copy: {
      heading: 'Support the Guardian',
      subheading: 'Available for everyone, funded by readers',
    },
    countryCode: 'GB',
  };
};

const useStyles = makeStyles(({ palette, spacing }: Theme) => ({
  drawer: {
    height: '400px',
    bottom: 0,
    top: 'auto',
    width: '100%',
  },
  icon: {
    width: '40px',
    height: '40px',
    background: palette.grey[900],
    borderRadius: '50%',
    color: 'white',
    cursor: 'pointer',
  },
  hint: {
    textAlign: 'center',
    fontStyle: 'italic',
    fontSize: '20px',
  },
  controlsContainer: {
    position: 'fixed',
    backgroundColor: palette.grey[100],
    borderRadius: '4px',
    top: spacing(3),
    left: spacing(3),
    padding: spacing(3),
  },
  iframe: {
    width: '100vw',
    height: '100vh',
  },
}));

interface VariantLandingPagePreviewProps {
  variant: SupportLandingPageVariant;
  controls?: React.ReactElement;
}

const VariantLandingPagePreview: React.FC<VariantLandingPagePreviewProps> = ({
  variant,
  controls,
}: VariantLandingPagePreviewProps) => {
  const classes = useStyles();
  const showPreview = false;

  const [drawerOpen, setDrawerOpen] = useState<boolean>();

  const toggleDrawer = (open: boolean) => (event: React.MouseEvent): void => {
    event.stopPropagation();
    setDrawerOpen(open);
  };

  const props = buildProps(variant);
  const storyName = 'components-marketing-landingPage--default';
  const storybookUrl = buildStorybookUrl(storyName, props);

  return (
    <div>
      <React.Fragment key={anchor}>
        {showPreview && (
          <Button startIcon={<VisibilityIcon />} size="small" onClick={toggleDrawer(true)}>
            Live preview
          </Button>
        )}
        <Drawer
          anchor={anchor}
          open={drawerOpen}
          onClose={toggleDrawer(false)}
          classes={{ paper: classes.drawer }}
        >
          <div>
            <div className={classes.hint} onClick={toggleDrawer(false)}>
              <Typography>Click anywhere outside the support landing page to close</Typography>
            </div>
            <div>
              <iframe className={classes.iframe} src={storybookUrl}></iframe>
            </div>
            {controls && <div className={classes.controlsContainer}>{controls}</div>}
          </div>
        </Drawer>
      </React.Fragment>
    </div>
  );
};

export default VariantLandingPagePreview;
