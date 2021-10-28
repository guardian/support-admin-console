import React from 'react';
import { Theme, makeStyles } from '@material-ui/core';
import { EpicVariant } from './epicTestsForm';

import { EpicModuleName } from '../helpers/shared';
import { useModule } from '../../../hooks/useModule';

export interface ArticleCounts {
  for52Weeks: number; // The user's total article view count, which currently goes back as far as 52 weeks
  forTargetedWeeks: number; // The user's article view count for the configured periodInWeeks
}

interface EpicProps {
  variant: EpicVariant;
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
    showTicker: false,
    cta: variant.cta,
    separateArticleCount: variant.separateArticleCount,
    showSignInLink: variant.showSignInLink,
    backgroundImageUrl: variant.backgroundImageUrl,
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
