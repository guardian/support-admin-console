import React, {useEffect, useState} from "react";
import { Theme, makeStyles } from '@material-ui/core';
import * as emotion from 'emotion';
import * as emotionCore from '@emotion/core';
import * as emotionTheming from 'emotion-theming';
import IconButton from '@material-ui/core/IconButton';
import Drawer from '@material-ui/core/Drawer';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import {BannerTemplate, BannerVariant} from "../../../models/banner";
import {Cta} from "../helpers/shared";


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
  content: {
    messageText: string;
    heading?: string;
    highlightedText?: string;
    cta?: Cta;
  }
}

const anchor = 'right';

const buildProps = (variant: BannerVariant): BannerProps => ({
  tracking: {
    ophanPageId: "ophanPageId",
    platformId: "GUARDIAN_WEB",
    clientName: "frontend",
    referrerUrl: "https://www.theguardian.com/",
    abTestName: "abTestName",
    abTestVariant: variant.name,
    campaignCode: "campaignCode",
    campaignId: "",
    componentType: "ACQUISITIONS_ENGAGEMENT_BANNER",
    products: []
  },
  bannerChannel: "contributions",
  isSupporter: false,
  content: {
    messageText: variant.body,
    heading: variant.heading,
    highlightedText: variant.highlightedText,
    cta: variant.cta
  },
  countryCode: "GB",
  numArticles: 13
});

const bannerModules = {
  [BannerTemplate.GuardianWeeklyBanner]: {
    path: 'guardian-weekly-banner.js',
    name: 'GuardianWeeklyBanner'
  },
  [BannerTemplate.DigitalSubscriptionsBanner]: {
    path: 'digital-subscriptions-banner.js',
    name: 'DigitalSubscriptionsBanner'
  },
  [BannerTemplate.ContributionsBanner]: {
    path: 'contributions-banner.js',
    name: 'ContributionsBanner'
  }
};

const useStyles = makeStyles(({ palette, spacing }: Theme) => ({
  container: {
    position: "fixed",
    top: "50vh",
    right: "10px",
  },
  drawer: {
    height: 'auto',
    bottom: 0,
    top: 'auto',
    width: '100%'
  },
  icon: {
    width: '40px',
    height: '40px',
    background: palette.grey[900],
    borderRadius: '50%',
    color: 'white',
    cursor: 'pointer',
  }
}));

interface BannerVariantLivePreviewProps {
  variant: BannerVariant;
}

const BannerVariantLivePreview: React.FC<BannerVariantLivePreviewProps> = ({
  variant
}: BannerVariantLivePreviewProps) => {
  const classes = useStyles();

  const [Banner, setBanner] = useState<React.FC<BannerProps>>();
  const [drawerOpen, setDrawerOpen] = useState<boolean>();

  useEffect(() => {
    // @ts-ignore
    window.guardian.automat = {
      react: React,
      preact: React,
      emotionCore,
      emotionTheming,
      emotion,
    };

    // @ts-ignore
    window.remoteImport(`https://contributions.guardianapis.com/${bannerModules[variant.template].path}`).then(bannerModule => {
      setBanner(() => bannerModule[bannerModules[variant.template].name]);
    })
  }, [variant.template]);

  const toggleDrawer = (open: boolean) => (
    event: React.KeyboardEvent | React.MouseEvent,
  ): void => {
    setDrawerOpen(open);
  };


  const props = buildProps(variant);

  return (
    <div className={classes.container}>
      {
        Banner && (
          <React.Fragment key={anchor}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer(true)}
              edge="start"
            >
              <ChevronLeft className={classes.icon}/>
            </IconButton>
            <Drawer anchor={anchor} open={drawerOpen} onClose={toggleDrawer(false)} classes={{paper: classes.drawer}}>
              <div>
                <Banner {...props}/>
              </div>
            </Drawer>
          </React.Fragment>
        )
      }
    </div>
  )
};

export default BannerVariantLivePreview;
