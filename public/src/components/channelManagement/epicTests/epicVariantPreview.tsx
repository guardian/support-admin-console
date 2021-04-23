import React, { useEffect, useState } from 'react';
import { Theme, makeStyles } from '@material-ui/core';
import * as emotion from 'emotion';
import * as emotionCore from '@emotion/core';
import * as emotionTheming from 'emotion-theming';
import { EpicVariant } from './epicTestsForm';
import { withPreviewStyles } from '../previewContainer';

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
  numArticles: number;
}

const buildProps = (variant: EpicVariant): EpicProps => ({
  variant: {
    name: variant.name,
    heading: variant.heading,
    paragraphs: variant.paragraphs,
    highlightedText: variant.highlightedText,
    showTicker: false,
    cta: variant.cta,
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
  numArticles: 13,
  countryCode: 'GB',
});

const useStyles = makeStyles(({}: Theme) => ({
  container: {
    maxWidth: '620px',
  },
}));

interface EpicVariantPreviewProps {
  variant: EpicVariant;
}

const EpicVariantPreview: React.FC<EpicVariantPreviewProps> = ({
  variant,
}: EpicVariantPreviewProps) => {
  const classes = useStyles();

  const [Epic, setEpic] = useState<React.FC<EpicProps>>();

  useEffect(() => {
    window.guardian.automat = {
      react: React,
      preact: React,
      emotionCore,
      emotionTheming,
      emotion,
    };

    window
      .remoteImport('https://contributions.guardianapis.com/modules/v1/epics/ContributionsEpic.js')
      .then(epicModule => {
        setEpic(() => withPreviewStyles(epicModule.ContributionsEpic));
      });
  }, []);

  const props = buildProps(variant);

  return <div className={classes.container}>{Epic && <Epic {...props} />}</div>;
};

export default EpicVariantPreview;
