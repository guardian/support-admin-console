import React, { useState } from 'react';
import { Button, Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Drawer from '@mui/material/Drawer';
import { BannerContent, BannerVariant } from '../../../models/banner';
import Typography from '@mui/material/Typography';
import { useModule } from '../../../hooks/useModule';
import useTickerData, { TickerSettingsWithData } from '../hooks/useTickerData';
import { mockAmountsCardData, SelectedAmountsVariant } from '../../../utils/models';
import { BannerDesign, BannerDesignProps } from '../../../models/bannerDesign';
import { ArticleCounts } from '../epicTests/variantPreview';
import { SeparateArticleCount } from '../../../models/epic';

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
  articleCounts: ArticleCounts;
  content: BannerContent;
  mobileContent?: BannerContent;
  tickerSettings?: TickerSettingsWithData;
  separateArticleCount?: boolean;
  separateArticleCountSettings?: SeparateArticleCount;
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
    articleCounts: {
      for52Weeks: 13,
      forTargetedWeeks: 13,
    },
    tickerSettings: tickerSettingsWithData,
    separateArticleCount: variant.separateArticleCount,
    separateArticleCountSettings: variant.separateArticleCountSettings,
    prices: mockPricesData,
    choiceCardAmounts: mockAmountsCardData,
    design,
  };
};

const bannerModules = {
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
  controls?: React.ReactElement;
}

const BannerVariantPreview: React.FC<BannerVariantPreviewProps> = ({
  variant,
  design,
  controls,
}: BannerVariantPreviewProps) => {
  const classes = useStyles();

  const [drawerOpen, setDrawerOpen] = useState<boolean>();
  const tickerSettingsWithData = useTickerData(variant.tickerSettings);

  const moduleConfig = {
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
              {controls && <div className={classes.controlsContainer}>{controls}</div>}
            </div>
          </Drawer>
        </React.Fragment>
      )}
    </div>
  );
};

export default BannerVariantPreview;
