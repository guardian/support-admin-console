import React, { useState } from 'react';
import { Theme, makeStyles, Button } from '@material-ui/core';
import VisibilityIcon from '@material-ui/icons/Visibility';
import Drawer from '@material-ui/core/Drawer';
import { BannerTemplate, BannerVariant, BannerContent } from '../../../models/banner';
import Typography from '@material-ui/core/Typography';
import { useModule } from '../../../hooks/useModule';
import useTickerData, { TickerSettingsWithData } from '../hooks/useTickerData';

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
export type Prices = {
  [index: string]: CountryGroupPriceData;
};

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
  prices?: Prices;
  numArticles: number;
  content: BannerContent;
  mobileContent?: BannerContent;
  tickerSettings?: TickerSettingsWithData;
  separateArticleCount?: boolean;
}

const anchor = 'bottom';

const buildProps = (
  variant: BannerVariant,
  tickerSettingsWithData?: TickerSettingsWithData,
): BannerProps => ({
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
  prices: {
    GBPCountries: {
      GuardianWeekly: {
        Monthly: {
          price: '0.00',
        },
        Annual: {
          price: '0.00',
        },
      },
      Digisub: {
        Monthly: {
          price: '0.00',
        },
        Annual: {
          price: '0.00',
        },
      },
    },
  },
  numArticles: 13,
  tickerSettings: tickerSettingsWithData,
  separateArticleCount: variant.separateArticleCount,
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
  [BannerTemplate.PrintSubscriptionsBanner]: {
    path: 'printSubscriptions/PrintSubscriptionsBanner.js',
    name: 'PrintSubscriptionsBanner',
  },
  [BannerTemplate.ContributionsBanner]: {
    path: 'contributions/ContributionsBanner.js',
    name: 'ContributionsBanner',
  },
  [BannerTemplate.ContributionsBannerWithSignIn]: {
    path: 'contributions/ContributionsBannerWithSignIn.js',
    name: 'ContributionsBannerWithSignIn',
  },
  [BannerTemplate.CharityAppealBanner]: {
    path: 'charityAppeal/CharityAppealBanner.js',
    name: 'CharityAppealBanner',
  },
  [BannerTemplate.InvestigationsMomentBanner]: {
    path: 'investigationsMoment/InvestigationsMomentBanner.js',
    name: 'InvestigationsMomentBanner',
  },
  [BannerTemplate.EnvironmentMomentBanner]: {
    path: 'environmentMoment/EnvironmentMomentBanner.js',
    name: 'EnvironmentMomentBanner',
  },
  [BannerTemplate.GlobalNewYearBanner]: {
    path: 'globalNYMoment/GlobalNYMomentBanner.js',
    name: 'GlobalNewYearBanner',
  },
  [BannerTemplate.UkraineMomentBanner]: {
    path: 'ukraineMoment/UkraineMomentBanner.js',
    name: 'UkraineMomentBanner',
  },
  [BannerTemplate.ChoiceCardsButtonsBannerBlue]: {
    path: 'choiceCardsButtonsBanner/ChoiceCardsButtonsBannerBlue.js',
    name: 'ChoiceCardsButtonsBannerBlue',
  },
  [BannerTemplate.ChoiceCardsButtonsBannerYellow]: {
    path: 'choiceCardsButtonsBanner/ChoiceCardsButtonsBannerYellow.js',
    name: 'ChoiceCardsButtonsBannerYellow',
  },
  [BannerTemplate.ChoiceCardsTabsBannerBlue]: {
    path: 'choiceCardsTabsBanner/ChoiceCardsTabsBannerBlue.js',
    name: 'ChoiceCardsTabsBannerBlue',
  },
  [BannerTemplate.ChoiceCardsTabsBannerYellow]: {
    path: 'choiceCardsTabsBanner/ChoiceCardsTabsBannerYellow.js',
    name: 'ChoiceCardsTabsBannerYellow',
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

interface BannerVariantPreviewProps {
  variant: BannerVariant;
}

const BannerVariantPreview: React.FC<BannerVariantPreviewProps> = ({
  variant,
}: BannerVariantPreviewProps) => {
  const classes = useStyles();

  const [drawerOpen, setDrawerOpen] = useState<boolean>();
  const tickerSettingsWithData = useTickerData(variant.tickerSettings);

  const Banner = useModule<BannerProps>(
    `banners/${bannerModules[variant.template].path}`,
    bannerModules[variant.template].name,
  );

  const toggleDrawer = (open: boolean) => (event: React.MouseEvent): void => {
    event.stopPropagation();
    setDrawerOpen(open);
  };

  const props = buildProps(variant, tickerSettingsWithData);

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
