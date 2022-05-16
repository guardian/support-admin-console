import React from 'react';
import { Theme, makeStyles } from '@material-ui/core';
import { EpicVariant } from './epicTestsForm';

import { EpicModuleName, TickerSettings } from '../helpers/shared';
import { useModule } from '../../../hooks/useModule';

// Article count TS defs
export interface ArticleCounts {
  // The user's total article view count, which currently goes back as far as 52 weeks
  for52Weeks: number;
  // The user's article view count for the configured periodInWeeks
  forTargetedWeeks: number;
}

// Choice card TS defs and object generation
interface ChoiceCardAmounts {
  amounts: number[];
  defaultAmount: number;
}

interface ChoiceCardVariant {
  name: string;
  amounts: {
    [index: string]: ChoiceCardAmounts;
  };
}

interface RegionalChoiceCard {
  control: {
    [index: string]: ChoiceCardAmounts;
  };
  test: {
    name: string;
    isLive: boolean;
    variants: ChoiceCardVariant[];
    seed: number;
  };
}

const generateChoiceCardObject = (): ChoiceCardAmounts => {
  return {
    amounts: [30, 60, 120, 240],
    defaultAmount: 60,
  };
};

const generateChoiceCardAmounts = () => {
  return {
    ONE_OFF: generateChoiceCardObject(),
    MONTHLY: generateChoiceCardObject(),
    ANNUAL: generateChoiceCardObject(),
  };
};

const generateRegionalChoiceCard = (name: string): RegionalChoiceCard => {
  return {
    control: generateChoiceCardAmounts(),
    test: {
      name,
      isLive: false,
      variants: [
        {
          name: 'V2_LOWER',
          amounts: generateChoiceCardAmounts(),
        },
      ],
      seed: 917618,
    },
  };
};

// Ticker additional TS defs
interface TickerData {
  total: number;
  goal: number;
}

interface TickerSettingsWithData extends TickerSettings {
  tickerData?: TickerData;
}

// Extend EpicVariant to include choice cards and tickers
interface EpicVariantWithAdditionalData extends EpicVariant {
  choiceCardAmounts: {
    [index: string]: RegionalChoiceCard;
  };
  tickerSettings?: TickerSettingsWithData;
}

interface EpicProps {
  variant: EpicVariantWithAdditionalData;
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
  countryCode?: string;
  articleCounts: ArticleCounts;
  hasConsentForArticleCount?: boolean;
}

const buildProps = (variant: EpicVariant): EpicProps => ({
  variant: {
    name: variant.name,
    heading: variant.heading,
    paragraphs: variant.paragraphs,
    highlightedText: variant.highlightedText,
    cta: variant.cta,

    // Secondary CTA needs to have additional data added to it - like done for ticker
    secondaryCta: variant.secondaryCta,

    separateArticleCount: variant.separateArticleCount,

    // There's some weird stuff going on around the sign-in link
    // - we have an 'enable sign-in link' checkbox in RRCP
    // - but no indication that the checkbox setting gets set in variant data
    // - for now, always show the link for the purposes of LIVE preview
    showSignInLink: true,

    image: variant.image,
    showChoiceCards: variant.showChoiceCards,
    choiceCardAmounts: {
      GBPCountries: generateRegionalChoiceCard('2021-09-02_AMOUNTS_R5__UK'),
      UnitedStates: generateRegionalChoiceCard('2021-03-11_AMOUNTS_R2__US'),
      EURCountries: generateRegionalChoiceCard('2021-03-11_AMOUNTS_R2__EU'),
      AUDCountries: generateRegionalChoiceCard('2021-03-11_AMOUNTS_R2__AU'),
      International: generateRegionalChoiceCard('2021-03-11_AMOUNTS_R2__INT'),
      NZDCountries: generateRegionalChoiceCard('2021-03-11_AMOUNTS_R2__NZ'),
      Canada: generateRegionalChoiceCard('2021-03-11_AMOUNTS_R2__CA'),
    },
    showTicker: variant.showTicker,
    tickerSettings: variant.tickerSettings
      ? {
          countType: variant.tickerSettings.countType,
          endType: variant.tickerSettings.endType,
          currencySymbol: variant.tickerSettings.currencySymbol,
          copy: variant.tickerSettings.copy,
          tickerData: {
            total: 50000,
            goal: 100000,
          },
        }
      : undefined,
  },
  tracking: {
    ophanPageId: 'ophanPageId',
    platformId: 'GUARDIAN_WEB',
    clientName: 'frontend',
    referrerUrl: 'https://www.theguardian.com/',
    abTestName: 'abTestName',
    abTestVariant: variant.name,
    campaignCode: 'campaignCode',
    campaignId: '',
    componentType: 'ACQUISITIONS_EPIC',
    products: [],
  },
  articleCounts: {
    for52Weeks: 13,
    forTargetedWeeks: 13,
  },
  countryCode: 'GB',
  hasConsentForArticleCount: true,
});

const useStyles = makeStyles(({}: Theme) => ({
  container: {
    maxWidth: '620px',
  },
}));

interface EpicVariantPreviewProps {
  variant: EpicVariant;
  moduleName: EpicModuleName;
}

const EpicVariantPreview: React.FC<EpicVariantPreviewProps> = ({
  variant,
  moduleName,
}: EpicVariantPreviewProps) => {
  const classes = useStyles();

  const Epic = useModule<EpicProps>(`epics/${moduleName}.js`, moduleName);

  const props = buildProps(variant);

  return <div className={classes.container}>{Epic && <Epic {...props} />}</div>;
};

export default EpicVariantPreview;
