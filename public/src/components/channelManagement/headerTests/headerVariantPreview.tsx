import React from 'react';
import { Theme, makeStyles } from '@material-ui/core';
import { HeaderVariant } from './headerTestsForm';

import { HeaderModuleName } from '../helpers/shared';
import { useModule } from '../../../hooks/useModule';

export interface ArticleCounts {
  for52Weeks: number; // The user's total article view count, which currently goes back as far as 52 weeks
  forTargetedWeeks: number; // The user's article view count for the configured periodInWeeks
}

interface HeaderProps {
  variant: HeaderVariant;
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

const buildProps = (variant: HeaderVariant): HeaderProps => ({
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
    componentType: 'ACQUISITIONS_HEADER',
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

interface HeaderVariantPreviewProps {
  variant: HeaderVariant;
  moduleName: HeaderModuleName;
}

const HeaderVariantPreview: React.FC<HeaderVariantPreviewProps> = ({
  variant,
  moduleName,
}: HeaderVariantPreviewProps) => {
  const classes = useStyles();

  const Header = useModule<HeaderProps>(`headers/${moduleName}.js`, moduleName);

  const props = buildProps(variant);

  return <div className={classes.container}>{Header && <Header {...props} />}</div>;
};

export default HeaderVariantPreview;
