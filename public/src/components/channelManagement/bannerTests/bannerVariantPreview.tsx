import React, { useState } from 'react';
import { Theme, makeStyles, Button } from '@material-ui/core';
import VisibilityIcon from '@material-ui/icons/Visibility';
import Drawer from '@material-ui/core/Drawer';
import {
  BannerTemplate,
  BannerVariant,
  BannerContent,
  isBannerTemplate,
} from '../../../models/banner';
import Typography from '@material-ui/core/Typography';
import { useModule } from '../../../hooks/useModule';
import useTickerData, { TickerSettingsWithData } from '../hooks/useTickerData';
import { SelectedAmountsVariant, mockAmountsCardData } from '../../../utils/models';
import { BannerDesign, BannerDesignProps } from '../../../models/bannerDesign';

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
const mockPricesData = {
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
  choiceCardAmounts?: SelectedAmountsVariant;
  design?: BannerDesignProps;
}

const anchor = 'bottom';

const buildProps = (
  variant: BannerVariant,
  tickerSettingsWithData?: TickerSettingsWithData,
  design?: BannerDesign,
): BannerProps => {
  const designProps = design && {
    image: design.image,
  };

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
    bannerChannel: 'contributions',
    isSupporter: false,
    content: variant.bannerContent,
    mobileContent: variant.mobileBannerContent,
    countryCode: 'GB',
    numArticles: 13,
    tickerSettings: tickerSettingsWithData,
    separateArticleCount: variant.separateArticleCount,
    prices: mockPricesData,
    choiceCardAmounts: mockAmountsCardData,
    design: designProps,
  };
};

const bannerModules = {
  [BannerTemplate.AusAnniversaryBanner]: {
    path: 'aus10yrAnniversaryMoment/Aus10yrAnniversaryMomentBanner.js',
    name: 'AusAnniversaryBanner',
  },
  [BannerTemplate.GuardianWeeklyBanner]: {
    path: 'guardianWeekly/GuardianWeeklyBanner.js',
    name: 'GuardianWeeklyBanner',
  },
  [BannerTemplate.ContributionsBanner]: {
    path: 'contributions/ContributionsBanner.js',
    name: 'ContributionsBanner',
  },
  [BannerTemplate.ContributionsBannerWithSignIn]: {
    path: 'contributions/ContributionsBannerWithSignIn.js',
    name: 'ContributionsBannerWithSignIn',
  },
  [BannerTemplate.InvestigationsMomentBanner]: {
    path: 'investigationsMoment/InvestigationsMomentBanner.js',
    name: 'InvestigationsMomentBanner',
  },
  [BannerTemplate.EnvironmentBanner]: {
    path: 'environment/EnvironmentBanner.js',
    name: 'EnvironmentBanner',
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
  [BannerTemplate.WorldPressFreedomDayBanner]: {
    path: 'worldPressFreedomDay/WorldPressFreedomDayBanner.js',
    name: 'WorldPressFreedomDayBanner',
  },
  [BannerTemplate.Scotus2023MomentBanner]: {
    path: 'usSupremeCourt2023/Scotus2023MomentBanner.js',
    name: 'Scotus2023MomentBanner',
  },
  [BannerTemplate.EuropeMomentLocalLanguageBanner]: {
    path: 'europeMomentLocalLanguage/EuropeMomentLocalLanguageBanner.js',
    name: 'EuropeMomentLocalLanguageBanner',
  },
  [BannerTemplate.SupporterMomentBanner]: {
    path: 'supporterMoment/SupporterMomentBanner.js',
    name: 'SupporterMomentBanner',
  },
  DesignableBanner: {
    path: 'designableBanner/DesignableBanner.js',
    name: 'DesignableBanner',
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
  design?: BannerDesign;
}

const BannerVariantPreview: React.FC<BannerVariantPreviewProps> = ({
  variant,
  design,
}: BannerVariantPreviewProps) => {
  const classes = useStyles();

  const [drawerOpen, setDrawerOpen] = useState<boolean>();
  const tickerSettingsWithData = useTickerData(variant.tickerSettings);

  const moduleConfig = isBannerTemplate(variant.template)
    ? {
        path: `banners/${bannerModules[variant.template].path}`,
        name: bannerModules[variant.template].name,
      }
    : {
        path: `banners/${bannerModules['DesignableBanner'].path}`,
        name: bannerModules['DesignableBanner'].name,
      };

  const Banner = useModule<BannerProps>(moduleConfig.path, moduleConfig.name);

  const toggleDrawer = (open: boolean) => (event: React.MouseEvent): void => {
    event.stopPropagation();
    setDrawerOpen(open);
  };

  const props = buildProps(variant, tickerSettingsWithData, design);

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
