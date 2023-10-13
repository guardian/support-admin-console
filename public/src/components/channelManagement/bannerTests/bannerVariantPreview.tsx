import React, { useState } from 'react';
import { Button, Checkbox, FormControlLabel, makeStyles, Theme } from '@material-ui/core';
import VisibilityIcon from '@material-ui/icons/Visibility';
import Drawer from '@material-ui/core/Drawer';
import {
  BannerContent,
  BannerTemplate,
  BannerVariant,
  isBannerTemplate,
} from '../../../models/banner';
import Typography from '@material-ui/core/Typography';
import { useModule } from '../../../hooks/useModule';
import useTickerData, { TickerSettingsWithData } from '../hooks/useTickerData';
import { mockAmountsCardData, SelectedAmountsVariant } from '../../../utils/models';
import { BannerDesign, BannerDesignProps } from '../../../models/bannerDesign';
import { TickerCountType, TickerEndType, TickerName } from '../helpers/shared';

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
    design,
  };
};

const bannerModules = {
  [BannerTemplate.AusAnniversaryMomentBanner]: {
    path: 'aus10yrAnniversaryMoment/Aus10yrAnniversaryMomentBanner.js',
    name: 'AusAnniversaryMomentBanner',
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
  [BannerTemplate.GlobalNewYearMomentBanner]: {
    path: 'globalNYMoment/GlobalNYMomentBanner.js',
    name: 'GlobalNewYearMomentBanner',
  },
  [BannerTemplate.UkraineMomentBanner]: {
    path: 'ukraineMoment/UkraineMomentBanner.js',
    name: 'UkraineMomentBanner',
  },
  [BannerTemplate.ChoiceCardsMomentBanner]: {
    path: 'choiceCardsMoment/ChoiceCardsMomentBanner.js',
    name: 'ChoiceCardsMomentBanner',
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
  [BannerTemplate.EnvironmentMomentBanner]: {
    path: 'environmentMoment/EnvironmentMomentBanner.js',
    name: 'EnvironmentMomentBanner',
  },
  DesignableBanner: {
    path: 'designableBanner/DesignableBanner.js',
    name: 'DesignableBanner',
  },
};

const useStyles = makeStyles(({ palette, spacing }: Theme) => ({
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
  controlsContainer: {
    position: 'fixed',
    backgroundColor: palette.grey[100],
    borderRadius: '4px',
    top: spacing(3),
    left: spacing(3),
    padding: spacing(3),
  },
}));

interface BannerVariantPreviewProps {
  variant: BannerVariant;
  design?: BannerDesign;
  shouldShowTickerToggle?: boolean;
}

const DEFAULT_TICKER_SETTINGS: TickerSettingsWithData = {
  tickerData: {
    total: 50_000,
    goal: 100_000,
  },
  countType: TickerCountType.money,
  endType: TickerEndType.hardstop,
  currencySymbol: '£',
  copy: {
    countLabel: 'contributions in May',
    goalReachedPrimary: "We've met our goal - thank you!",
    goalReachedSecondary: '',
  },
  name: TickerName.US_2022,
};

interface TickerToggleProps {
  shouldShowTicker: boolean;
  setShouldShowTicker: (shouldShowTicker: boolean) => void;
}
const TickerToggle = ({ shouldShowTicker, setShouldShowTicker }: TickerToggleProps) => {
  return (
    <FormControlLabel
      control={
        <Checkbox
          checked={shouldShowTicker}
          onChange={() => setShouldShowTicker(!shouldShowTicker)}
          color="primary"
        />
      }
      label={'Show ticker?'}
    />
  );
};

const BannerVariantPreview: React.FC<BannerVariantPreviewProps> = ({
  variant,
  design,
  shouldShowTickerToggle = false,
}: BannerVariantPreviewProps) => {
  const [shouldShowTicker, setShouldShowTicker] = useState<boolean>(false);
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

  const tickerSettings =
    tickerSettingsWithData || (shouldShowTicker ? DEFAULT_TICKER_SETTINGS : undefined);

  const props = buildProps(variant, tickerSettings, design);

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
              {shouldShowTickerToggle && (
                <div className={classes.controlsContainer}>
                  <TickerToggle
                    shouldShowTicker={shouldShowTicker}
                    setShouldShowTicker={setShouldShowTicker}
                  />
                </div>
              )}
            </div>
          </Drawer>
        </React.Fragment>
      )}
    </div>
  );
};

export default BannerVariantPreview;
