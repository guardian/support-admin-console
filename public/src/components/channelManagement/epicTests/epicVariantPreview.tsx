import React, { useEffect, useState } from 'react';
import { Theme, makeStyles } from '@material-ui/core';
import * as emotionReact from '@emotion/react';
import * as emotionReactJsxRuntime from '@emotion/react/jsx-runtime';
import { EpicVariant } from './epicTestsForm';
import { withPreviewStyles } from '../previewContainer';
import { getStage } from '../../../utils/stage';

import { EpicModuleName } from '../helpers/shared';

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

  const [Epic, setEpic] = useState<React.FC<EpicProps>>();

  useEffect(() => {
    window.guardian.automat = {
      react: React,
      preact: React,
      emotionReact,
      emotionReactJsxRuntime,
    };

    const stage = getStage();

    const url =
      stage === 'PROD'
        ? `https://contributions.guardianapis.com/modules/v2/epics/${moduleName}.js`
        : `https://contributions.code.dev-guardianapis.com/modules/v2/epics/${moduleName}.js`;

    window.remoteImport(url).then(epicModule => {
      setEpic(() => withPreviewStyles(epicModule[moduleName]));
    });
  }, []);

  const props = buildProps(variant);

  return <div className={classes.container}>{Epic && <Epic {...props} />}</div>;
};

export default EpicVariantPreview;
