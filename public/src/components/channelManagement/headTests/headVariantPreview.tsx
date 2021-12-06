import React, { useState } from 'react';
import { Theme, makeStyles, Button } from '@material-ui/core';
import VisibilityIcon from '@material-ui/icons/Visibility';
import Drawer from '@material-ui/core/Drawer';
import { HeadTemplate, HeadVariant } from '../../../models/head';


// import { Cta, SecondaryCta, TickerCountType, TickerEndType } from '../helpers/shared';
import { Cta, SecondaryCta } from '../helpers/shared';


import Typography from '@material-ui/core/Typography';


// import { TickerSettings } from '../epicTests/epicTestsForm';


import { useModule } from '../../../hooks/useModule';

export interface HeadContent {
  heading?: string;
  messageText: string;
  highlightedText?: string;
  cta?: Cta;
  secondaryCta?: SecondaryCta;
}

interface HeadProps {
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
  headChannel: string;
  countryCode?: string;
  // numArticles: number;
  content: HeadContent;
  mobileContent?: HeadContent;
  // tickerSettings?: TickerSettings;
}

const anchor = 'bottom';

// const tickerSettings = {
//   countType: TickerCountType.people,
//   endType: TickerEndType.unlimited,
//   currencySymbol: '$',
//   copy: {
//     countLabel: 'supporters in Australia',
//     goalReachedPrimary: "We've hit our goal!",
//     goalReachedSecondary: 'but you can still support us',
//   },
//   tickerData: {
//     total: 120_000,
//     goal: 150_000,
//   },
// };

const buildProps = (variant: HeadVariant): HeadProps => ({
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
  headChannel: 'contributions',
  isSupporter: false,
  content: variant.headContent,
  mobileContent: variant.mobileHeadContent,
  countryCode: 'GB',
  // numArticles: 13,
  // tickerSettings,
});

// const headModules = {
//   [HeadTemplate.GuardianWeeklyHead]: {
//     path: 'guardianWeekly/GuardianWeeklyHead.js',
//     name: 'GuardianWeeklyHead',
//   },
//   [HeadTemplate.DigitalSubscriptionsHead]: {
//     path: 'digitalSubscriptions/DigitalSubscriptionsHead.js',
//     name: 'DigitalSubscriptionsHead',
//   },
//   [HeadTemplate.ContributionsHead]: {
//     path: 'contributions/ContributionsHead.js',
//     name: 'ContributionsHead',
//   },
//   [HeadTemplate.ContributionsHeadWithSignIn]: {
//     path: 'contributions/ContributionsHeadWithSignIn.js',
//     name: 'ContributionsHeadWithSignIn',
//   },
//   [HeadTemplate.InvestigationsMomentHead]: {
//     path: 'investigationsMoment/InvestigationsMomentHead.js',
//     name: 'InvestigationsMomentHead',
//   },
//   [HeadTemplate.EnvironmentMomentHead]: {
//     path: 'environmentMoment/EnvironmentMomentHead.js',
//     name: 'EnvironmentMomentHead',
//   },
//   [HeadTemplate.UsEoyMomentHead]: {
//     path: 'usEoyMoment/UsEoyMomentHead.js',
//     name: 'UsEoyMomentHead',
//   },
//   [HeadTemplate.UsEoyMomentGivingTuesdayHead]: {
//     path: 'usEoyMoment/UsEoyMomentGivingTuesdayHead.js',
//     name: 'UsEoyMomentGivingTuesdayHead',
//   },
// };

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

interface HeadVariantPreviewProps {
  variant: HeadVariant;
}

const HeadVariantPreview: React.FC<HeadVariantPreviewProps> = ({
  variant,
}: HeadVariantPreviewProps) => {
  const classes = useStyles();

  const [drawerOpen, setDrawerOpen] = useState<boolean>();

  // const Head = useModule<HeadProps>(
  //   `heads/${headModules[variant.template].path}`,
  //   headModules[variant.template].name,
  // );

  const toggleDrawer = (open: boolean) => (event: React.MouseEvent): void => {
    event.stopPropagation();
    setDrawerOpen(open);
  };

  const props = buildProps(variant);

  return (
    <div>

      Preview should go here

{/*
      {Head && (
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
                <Typography>Click anywhere outside the head to close</Typography>
              </div>
              <Head {...props} />
            </div>
          </Drawer>
        </React.Fragment>
      )}
*/}      
    </div>
  );
};

export default HeadVariantPreview;
