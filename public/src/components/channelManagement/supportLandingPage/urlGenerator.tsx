import React, { useEffect, useState } from 'react';
import { SupportLandingPageVariant } from '../../../models/supportLandingPage';
import VariantSummaryURLGeneratorButton from './urlGeneratorButton';
import { getStage } from '../../../utils/stage';
import { Checkbox, FormControlLabel, TextField, Theme, Typography, Box } from '@mui/material';
import { makeStyles } from '@mui/styles';

interface URLGeneratorProps {
  variant: SupportLandingPageVariant;
  testName: string;
}

const useStyles = makeStyles(({ spacing }: Theme) => ({
  container: {
    width: '100%',
    paddingTop: spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  sectionTitle: {
    marginBottom: spacing(2),
    fontWeight: 600,
  },
  urlPreviewBlock: {
    marginTop: spacing(2),
    fontSize: '0.8rem',
    color: '#555',
    display: 'flex',
    gap: spacing(1),
  },
  fields: {
    display: 'flex',
    flexDirection: 'row',
    rowGap: spacing(4),
    columnGap: spacing(2),
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: spacing(4),
  },
  infoText: {
    fontSize: '0.75rem',
    color: '#666',
    fontStyle: 'italic',
    position: 'absolute',
  },
  urlPreviewTitle: {
    fontWeight: 500,
    whiteSpace: 'nowrap',
  },
  urlPreview: {
    wordBreak: 'break-all',
  },
}));

type UrlBuilder = {
  withParams: (newParams: Record<string, string>) => UrlBuilder;
  getUrl: () => string;
  getParams: () => URLSearchParams;
};

const getPreviewUrl = ({
  testName,
  variant,
}: {
  testName: string;
  variant: SupportLandingPageVariant;
}): UrlBuilder => {
  const stage = getStage();
  const channelName = 'landing-page';
  const params = new URLSearchParams();

  params.set(`force-${channelName}`, `${testName}:${variant.name}`);

  const builder: UrlBuilder = {
    withParams: (newParams: Record<string, string>) => {
      Object.entries(newParams).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        }
      });
      return builder;
    },
    getUrl: () => {
      return `https://support.${
        stage !== 'PROD' ? 'code.dev-' : ''
      }theguardian.com/contribute?${params.toString()}`;
    },
    getParams: () => params,
  };

  return builder;
};

const URLGenerator = ({ variant, testName }: URLGeneratorProps) => {
  const classes = useStyles();
  const [url, setUrl] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [enableOneTime, setEnableOneTime] = useState(false);

  useEffect(() => {
    if (variant && testName) {
      const builder = getPreviewUrl({ testName, variant });

      const params: Record<string, string> = {};
      if (variant.defaultProductSelection?.productType) {
        params.product = variant.defaultProductSelection.productType;
      }
      if (variant.defaultProductSelection?.billingPeriod) {
        params.ratePlan = variant.defaultProductSelection.billingPeriod;
      }
      if (promoCode) {
        params.promoCode = promoCode;
      }
      if (enableOneTime) {
        params.enableOneTime = 'true';
      }

      const generatedUrl = builder.withParams(params).getUrl();
      setUrl(generatedUrl);
    }
  }, [variant, testName, promoCode, enableOneTime]);

  const defaultProduct = variant.defaultProductSelection?.productType || 'Product not set';
  const ratePlan = variant.defaultProductSelection?.billingPeriod;

  return (
    <div className={classes.container}>
      <Typography className={classes.sectionTitle} variant="h6">
        Variant URL Generator
      </Typography>
      <div className={classes.fields}>
        <Box position="relative">
          <TextField
            label="Default product"
            value={`${defaultProduct}${ratePlan ? ` - ${ratePlan}` : ''}`}
            disabled
            InputProps={{
              style: { width: 'auto', minWidth: '250px' },
            }}
          />
          <Typography className={classes.infoText}>
            Can be changed in the &quot;Default Product&quot; section above
          </Typography>
        </Box>
        <TextField
          label="Promo Code (optional)"
          value={promoCode}
          onChange={e => setPromoCode(e.target.value)}
        />
        <FormControlLabel
          control={
            <Checkbox checked={enableOneTime} onChange={e => setEnableOneTime(e.target.checked)} />
          }
          label="Enable One Time"
        />
        <VariantSummaryURLGeneratorButton url={url} />
      </div>
      <div className={classes.urlPreviewBlock}>
        <span className={classes.urlPreviewTitle}>URL preview:</span>
        <span className={classes.urlPreview}>{url}</span>
      </div>
    </div>
  );
};

export default URLGenerator;
