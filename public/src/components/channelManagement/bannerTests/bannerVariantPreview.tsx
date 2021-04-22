import React, { useEffect, useState } from 'react';
import { Theme, makeStyles, Button } from '@material-ui/core';
import * as emotion from 'emotion';
import * as emotionCore from '@emotion/core';
import * as emotionTheming from 'emotion-theming';
import VisibilityIcon from '@material-ui/icons/Visibility';
import Drawer from '@material-ui/core/Drawer';
import { BannerTemplate, BannerVariant } from '../../../models/banner';
import { Cta } from '../helpers/shared';
import Typography from '@material-ui/core/Typography';

export interface BannerContent {
  heading?: string;
  messageText: string;
  highlightedText?: string;
  cta?: Cta;
  secondaryCta?: Cta;
}

interface BannerProps {
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
  bannerChannel: string;
  countryCode?: string;
  numArticles: number;
  content: BannerContent;
  mobileContent?: BannerContent;
}

const anchor = 'bottom';

const buildProps = (variant: BannerVariant): BannerProps => ({
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
  bannerChannel: 'contributions',
  isSupporter: false,
  content: variant.bannerContent,
  mobileContent: variant.mobileBannerContent,
  countryCode: 'GB',
  numArticles: 13,
});

const bannerModules = {
  [BannerTemplate.GuardianWeeklyBanner]: {
    path: 'guardianWeekly/GuardianWeeklyBanner.js',
    name: 'GuardianWeeklyBanner',
  },
  [BannerTemplate.DigitalSubscriptionsBanner]: {
    path: 'digitalSubscriptions/DigitalSubscriptionsBanner.js',
    name: 'DigitalSubscriptionsBanner',
  },
  [BannerTemplate.ContributionsBanner]: {
    path: 'contributions/ContributionsBanner.js',
    name: 'ContributionsBanner',
  },
};

const useStyles = makeStyles(({ palette }: Theme) => ({
  drawer: {
    height: 'auto',
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
}));

interface BannerVariantLivePreviewProps {
  variant: BannerVariant;
}

const BannerVariantPreview: React.FC<BannerVariantLivePreviewProps> = ({
  variant,
}: BannerVariantLivePreviewProps) => {
  const classes = useStyles();

  const [Banner, setBanner] = useState<React.FC<BannerProps>>();
  const [drawerOpen, setDrawerOpen] = useState<boolean>();

  useEffect(() => {
    window.guardian.automat = {
      react: React,
      preact: React,
      emotionCore,
      emotionTheming,
      emotion,
    };

    window
      .remoteImport(
        `https://contributions.guardianapis.com/modules/v1/banners/${
          bannerModules[variant.template].path
        }`,
      )
      .then(bannerModule => {
        setBanner(() => bannerModule[bannerModules[variant.template].name]);
      });
  }, [variant.template]);

  const toggleDrawer = (open: boolean) => (event: React.MouseEvent): void => {
    event.stopPropagation();
    setDrawerOpen(open);
  };

  const props = buildProps(variant);

  return (
    <div>
      {Banner && (
        <React.Fragment key={anchor}>
          <Button startIcon={<VisibilityIcon />} size="small" onClick={toggleDrawer(true)}>
            Live preview
          </Button>
          <Drawer
            anchor={anchor}
            open={drawerOpen}
            onClose={toggleDrawer(false)}
            classes={{ paper: classes.drawer }}
          >
            <div>
              <div className={classes.hint} onClick={toggleDrawer(false)}>
                <Typography>Click anywhere outside the banner to close</Typography>
              </div>
              <Banner {...props} />
            </div>
          </Drawer>
        </React.Fragment>
      )}
    </div>
  );
};

export default BannerVariantPreview;
