import { Box, Checkbox, FormControlLabel, TextField, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useState } from 'react';
import { SupportLandingPageVariant } from '../../../models/supportLandingPage';
import { getStage } from '../../../utils/stage';
import URLGeneratorCopyButton from '../../shared/urlGeneratorCopyButton';

interface URLGeneratorProps {
  variant: SupportLandingPageVariant;
  testName: string;
}

const Container = styled('div')(({ theme }) => ({
  width: '100%',
  paddingTop: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
}));
const SectionTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  fontWeight: 600,
}));
const UrlPreviewBlock = styled('div')(({ theme }) => ({
  marginTop: theme.spacing(2),
  fontSize: '0.8rem',
  color: '#555',
  display: 'flex',
  gap: theme.spacing(1),
}));
const Fields = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  rowGap: theme.spacing(4),
  columnGap: theme.spacing(2),
  alignItems: 'center',
  flexWrap: 'wrap',
  marginBottom: theme.spacing(4),
}));
const InfoText = styled(Typography)({
  fontSize: '0.75rem',
  color: '#666',
  fontStyle: 'italic',
  position: 'absolute',
});
const UrlPreviewTitle = styled('span')({
  fontWeight: 500,
  whiteSpace: 'nowrap',
});
const UrlPreview = styled('span')({
  wordBreak: 'break-all',
});

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

  params.set(`preview-${channelName}`, `${testName}:${variant.name}`);

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
  const [promoCode, setPromoCode] = useState('');
  const [enableOneTime, setEnableOneTime] = useState(false);

  const url = React.useMemo(() => {
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

    return builder.withParams(params).getUrl();
  }, [variant, testName, promoCode, enableOneTime]);

  const defaultProduct = variant.defaultProductSelection?.productType ?? 'Product not set';
  const ratePlan = variant.defaultProductSelection?.billingPeriod;

  return (
    <Container>
      <SectionTitle variant="h6">Variant URL Generator</SectionTitle>
      <Fields>
        <Box position="relative">
          <TextField
            label="Default product"
            value={`${defaultProduct}${ratePlan ? ` - ${ratePlan}` : ''}`}
            disabled
            InputProps={{
              style: { width: 'auto', minWidth: '250px' },
            }}
          />
          <InfoText>Can be changed in the &quot;Default Product&quot; section above</InfoText>
        </Box>
        <TextField
          label="Promo Code (optional)"
          value={promoCode}
          onChange={(e) => setPromoCode(e.target.value)}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={enableOneTime}
              onChange={(e) => setEnableOneTime(e.target.checked)}
            />
          }
          label="Enable One Time"
        />
        <URLGeneratorCopyButton url={url} />
      </Fields>
      <UrlPreviewBlock>
        <UrlPreviewTitle>URL preview:</UrlPreviewTitle>
        <UrlPreview>{url}</UrlPreview>
      </UrlPreviewBlock>
    </Container>
  );
};

export default URLGenerator;
