import React from 'react';
import { Theme, makeStyles } from '@material-ui/core';

import { EpicModuleName } from '../helpers/shared';
import { useModule } from '../../../hooks/useModule';
import { EpicVariant } from '../../../models/epic';
import useTickerData, { TickerSettingsWithData } from '../hooks/useTickerData';
import { ContributionAmounts } from '../../amounts/configuredAmountsEditor';

// Article count TS defs
export interface ArticleCounts {
  // The user's total article view count, which currently goes back as far as 52 weeks
  for52Weeks: number;
  // The user's article view count for the configured periodInWeeks
  forTargetedWeeks: number;
}

// Secondary CTA TS defs
interface ShowReminderFields {
  reminderCta: string;
  reminderPeriod: string;
  reminderLabel: string;
}

export type SelectedAmountsVariant = {
  testName: string;
  variantName?: string;
  amounts?: ContributionAmounts;
};

// Extend EpicVariant to include choice cards and tickers
interface EpicVariantWithAdditionalData extends EpicVariant {
  choiceCardAmounts: SelectedAmountsVariant;
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
      testName: 'amounts_test',
      variantName: 'control',
      amounts: {
        ONE_OFF: {
          amounts: [5, 10, 15, 20],
          defaultAmount: 5,
        },
        MONTHLY: {
          amounts: [3, 6, 10],
          defaultAmount: 10,
        },
        ANNUAL: {
          amounts: [100],
          defaultAmount: 100,
        },
      },
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
