import React from 'react';
import { Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';

import { EpicModuleName } from '../helpers/shared';
import { EpicVariant } from '../../../models/epic';
import useTickerData, { TickerSettingsWithData } from '../hooks/useTickerData';
import { SelectedAmountsVariant, mockAmountsCardData } from '../../../utils/models';
import { buildStorybookUrl } from '../helpers/dcrStorybook';
import Alert from '@mui/lab/Alert';

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
    choiceCardAmounts: mockAmountsCardData,

    showTicker: variant.showTicker,
    tickerSettings: tickerSettingsWithData,

    newsletterSignup: variant.newsletterSignup,
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

const StorybookNames: Record<EpicModuleName, string> = {
  ContributionsLiveblogEpic: 'components-marketing-contributionsliveblogepic--default',
  ContributionsEpic: 'components-marketing-contributionsepic--default',
};

const useStyles = makeStyles(({}: Theme) => ({
  container: {
    width: '620px',
  },
  iframe: {
    width: '620px',
    height: '800px',
  },
}));

interface EpicVariantPreviewProps {
  variant: EpicVariant;
  moduleName: EpicModuleName;
}

/**
 * Uses the DCR storybook to render the component, iframed.
 * Props are passed in the args parameter in the url.
 */
const VariantPreview: React.FC<EpicVariantPreviewProps> = ({
  variant,
  moduleName,
}: EpicVariantPreviewProps) => {
  const classes = useStyles();

  const tickerSettingsWithData = useTickerData(variant.tickerSettings);
  const props = buildProps(variant, tickerSettingsWithData);

  const storyName = StorybookNames[moduleName];
  const storybookUrl = buildStorybookUrl(storyName, props);

  return (
    <div>
      <Alert severity="info">
        The Live Preview does not support choice cards. Please use the Web Preview to view choice
        cards.
      </Alert>
      <iframe className={classes.iframe} src={storybookUrl}></iframe>
    </div>
  );
};

export default VariantPreview;
