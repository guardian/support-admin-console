import VisibilityIcon from '@mui/icons-material/Visibility';
import { Alert, Box, Button } from '@mui/material';
import Drawer from '@mui/material/Drawer';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import React, { useState } from 'react';
import { BannerContent, BannerVariant } from '../../../models/banner';
import { BannerDesign, BannerDesignProps } from '../../../models/bannerDesign';
import { SeparateArticleCount } from '../../../models/epic';
import { mockAmountsCardData, SelectedAmountsVariant } from '../../../utils/models';
import { ArticleCounts } from '../epicTests/variantPreview';
import { buildStorybookUrl } from '../helpers/dcrStorybook';
import useTickerData, { TickerSettingsWithData } from '../hooks/useTickerData';

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
type Prices = Record<string, CountryGroupPriceData>;
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

const StyledDrawer = styled(Drawer)({
  '& .MuiDrawer-paper': {
    height: '400px',
    bottom: 0,
    top: 'auto',
    width: '100%',
  },
});

const Hint = styled(Box)({
  textAlign: 'center',
  fontStyle: 'italic',
  fontSize: '20px',
});

const ControlsContainer = styled(Box)(({ theme }) => ({
  position: 'fixed',
  backgroundColor: theme.palette.grey[100],
  borderRadius: '4px',
  top: theme.spacing(3),
  left: theme.spacing(3),
  padding: theme.spacing(3),
}));

const StyledIframe = styled('iframe')({
  width: '100vw',
  height: '100vh',
});

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
  const [drawerOpen, setDrawerOpen] = useState<boolean>();
  const tickerSettingsWithData = useTickerData(variant.tickerSettings);

  const toggleDrawer =
    (open: boolean) =>
    (event: React.MouseEvent): void => {
      event.stopPropagation();
      setDrawerOpen(open);
    };

  const props = buildProps(variant, tickerSettingsWithData, design);
  const storyName = 'components-marketing-designablebanner--default';
  const storybookUrl = buildStorybookUrl(storyName, props);

  return (
    <div>
      <React.Fragment key={anchor}>
        <Button startIcon={<VisibilityIcon />} size="small" onClick={toggleDrawer(true)}>
          Live preview
        </Button>
        <StyledDrawer anchor={anchor} open={drawerOpen} onClose={toggleDrawer(false)}>
          <div>
            <Hint onClick={toggleDrawer(false)}>
              <Typography>Click anywhere outside the banner to close</Typography>
              <Alert severity="info">
                The Live Preview does not support choice cards. Please use the Web Preview to view
                choice cards.
              </Alert>
            </Hint>
            <div>
              <StyledIframe src={storybookUrl}></StyledIframe>
            </div>
            {controls && <ControlsContainer>{controls}</ControlsContainer>}
          </div>
        </StyledDrawer>
      </React.Fragment>
    </div>
  );
};

export default BannerVariantPreview;
