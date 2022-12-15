import React from 'react';
import { Theme, makeStyles } from '@material-ui/core';

import { EpicModuleName } from '../helpers/shared';
import { useModule } from '../../../hooks/useModule';
import { EpicVariant } from '../../../models/epic';
import useTickerData, { TickerSettingsWithData } from '../hooks/useTickerData';

// Article count TS defs
export interface ArticleCounts {
  // The user's total article view count, which currently goes back as far as 52 weeks
  for52Weeks: number;
  // The user's article view count for the configured periodInWeeks
  forTargetedWeeks: number;
}

// Choice card TS defs and object generation
// - Matches the TS set out in SDC file `/packages/shared/src/types/abTests/epic.ts`
interface AmountSelection {
  amounts: number[];
  defaultAmount: number;
}

type ContributionAmounts = {
  [index: string]: AmountSelection;
};

interface AmountsTestVariant {
  name: string;
  amounts: ContributionAmounts;
}

interface AmountsTest {
  name: string;
  isLive: boolean;
  variants: AmountsTestVariant[];
  seed: number;
}

type ConfiguredRegionAmounts = {
  control: ContributionAmounts;
  test?: AmountsTest;
};

type ChoiceCardAmounts = {
  [index: string]: ConfiguredRegionAmounts;
};

const generateChoiceCardObject = (): AmountSelection => {
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

const generateRegionalChoiceCard = (name: string): ConfiguredRegionAmounts => {
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

// Secondary CTA TS defs
interface ShowReminderFields {
  reminderCta: string;
  reminderPeriod: string;
  reminderLabel: string;
}

// Extend EpicVariant to include choice cards and tickers
interface EpicVariantWithAdditionalData extends EpicVariant {
  choiceCardAmounts: ChoiceCardAmounts;
  tickerSettings?: TickerSettingsWithData;
  showReminderFields?: ShowReminderFields;
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

const buildProps = (
  variant: EpicVariant,
  tickerSettingsWithData?: TickerSettingsWithData,
): EpicProps => ({
  variant: {
    name: variant.name,
    heading: variant.heading,
    paragraphs: variant.paragraphs,
    highlightedText: variant.highlightedText,
    cta: variant.cta,

    secondaryCta: variant.secondaryCta,
    showReminderFields: {
      reminderCta: 'Remind me in October',
      reminderPeriod: '2021-10-01',
      reminderLabel: 'October',
    },

    separateArticleCount: variant.separateArticleCount,

    showSignInLink: variant.showSignInLink,

    image: variant.image,
    bylineWithImage: variant.bylineWithImage,

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
    tickerSettings: tickerSettingsWithData,
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
    width: '620px',
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

  const tickerSettingsWithData = useTickerData(variant.tickerSettings);

  const Epic = useModule<EpicProps>(`epics/${moduleName}.js`, moduleName);

  const props = buildProps(variant, tickerSettingsWithData);

  return <div className={classes.container}>{Epic && <Epic {...props} />}</div>;
};

export default EpicVariantPreview;
