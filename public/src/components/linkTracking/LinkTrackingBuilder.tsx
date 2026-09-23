import { Link as LinkIcon, OpenInNew } from '@mui/icons-material';
import { Button, TextField, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import lzstring from 'lz-string';
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { LinkTrackingFormData } from './linkTrackingFormData';
import { MediumSelector } from './MediumSelector';

const Container = styled('form')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  maxWidth: '800px',
  margin: '20px',
  gap: theme.spacing(2),
}));
const FieldsContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  paddingBottom: theme.spacing(3),
  borderBottom: `3px solid ${theme.palette.grey[500]}`,
}));
const LinkContainer = styled('div')({
  display: 'flex',
});
const StyledLink = styled(TextField)({
  flex: 1,
  '& input': {
    '-webkit-text-fill-color': '#22874D !important',
    fontWeight: 700,
  },
});
const CopyButton = styled(Button)(({ theme }) => ({
  marginLeft: theme.spacing(2),
  padding: '0 8px',
  fontSize: '14px',
  fontWeight: 'normal',
  color: theme.palette.grey[700],
  lineHeight: 1.5,
}));
const Header = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(1),
  fontSize: 16,
  color: theme.palette.grey[900],
  fontWeight: 500,
}));
const QrContainer = styled('a')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginLeft: theme.spacing(2),
  gap: '4px',
}));

const addHttps = (url: string): string => {
  if (url.startsWith('https://')) {
    return url;
  } else {
    return `https://${url}`;
  }
};

const buildLink = (
  url: string,
  campaign: string,
  content: string,
  term: string,
  sourceAndMedium: string,
): string => {
  const urlWithHttps = addHttps(url);
  const [source, medium] = sourceAndMedium.split('__');
  const trackingParams = `utm_medium=${medium}&utm_campaign=${campaign}&utm_content=${content}&utm_term=${term}&utm_source=${source}`;
  return urlWithHttps.includes('?')
    ? `${urlWithHttps}&${trackingParams}`
    : `${urlWithHttps}?${trackingParams}`;
};

const getInitialState = (): { formValues: LinkTrackingFormData; initialLink: string } => {
  const urlParams = new URLSearchParams(window.location.search);
  const urlParam = urlParams.get('url');
  const campaignParam = urlParams.get('campaign');
  const contentParam = urlParams.get('content');
  const termParam = urlParams.get('term');

  const formValues: LinkTrackingFormData = {
    url: urlParam ?? 'https://support.theguardian.com',
    campaign: campaignParam ?? '',
    content: contentParam ?? '',
    term: termParam ?? '',
    sourceAndMedium: 'acquisition__footer',
  };

  const initialLink =
    urlParam && campaignParam && contentParam && termParam
      ? buildLink(urlParam, campaignParam, contentParam, termParam, 'acquisition__footer')
      : '';

  return { formValues, initialLink };
};

export const LinkTrackingBuilder: React.FC = () => {
  const { formValues, initialLink } = React.useMemo(() => getInitialState(), []);

  const [link, setLink] = React.useState<string>(initialLink);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LinkTrackingFormData>({
    defaultValues: formValues,
  });

  const urlContainsTrackingParams = (url: URL): boolean => {
    const params = new URLSearchParams(url.search);

    return (
      params.has('utm_medium') ||
      params.has('utm_campaign') ||
      params.has('utm_content') ||
      params.has('utm_term') ||
      params.has('utm_source')
    );
  };

  const onSubmit: SubmitHandler<LinkTrackingFormData> = ({
    url,
    campaign,
    content,
    term,
    sourceAndMedium,
  }) => {
    setLink(buildLink(url, campaign, content, term, sourceAndMedium));
  };

  // To be called whenever something changes, and the user needs to re-submit
  const resetLink = () => setLink('');

  const linkReady = link.trim() !== '';

  return (
    <Container
      onChange={() => resetLink()}
      onSubmit={(e) => {
        e.preventDefault();
        void handleSubmit(onSubmit)();
      }}
    >
      <FieldsContainer>
        <TextField
          {...register('url', {
            required: true,
            validate: (value) => {
              // Check it's a valid url and has no existing tracking params
              try {
                const url = new URL(addHttps(value));
                if (urlContainsTrackingParams(url)) {
                  return 'URL must not already have tracking';
                }
                return true;
              } catch {
                return 'Invalid URL';
              }
            },
          })}
          label="URL (without tracking)"
          error={!!errors.url}
          helperText={errors.url?.message}
        />

        <Header variant="h4">Campaign</Header>
        <TextField
          {...register('campaign', { required: true })}
          label="Campaign"
          error={!!errors.campaign}
          helperText={errors.campaign?.message}
        />

        <Header variant="h4">Call to action / creative</Header>
        <TextField
          {...register('content', { required: true })}
          label="Creative / utm_content / AB test name"
          error={!!errors.content}
          helperText={errors.content?.message}
        />
        <TextField
          {...register('term', { required: true })}
          label="Audience segment / utm_term / AB test variant name"
          error={!!errors.term}
          helperText={errors.term?.message}
        />

        <Header variant="h4">Placement</Header>
        <MediumSelector onUpdate={resetLink} errors={errors} control={control} />
      </FieldsContainer>

      <Button type="submit" variant="contained" color="primary" disabled={linkReady}>
        Build link
      </Button>

      {linkReady && (
        <LinkContainer>
          <StyledLink value={link} disabled />
          <CopyButton
            variant="outlined"
            startIcon={<LinkIcon />}
            onClick={() => {
              void navigator.clipboard.writeText(link);
            }}
          >
            Copy
          </CopyButton>

          <QrContainer
            target="_blank"
            href={`/qr-code?url=${lzstring.compressToEncodedURIComponent(link)}`}
          >
            <OpenInNew />
            <span>QR code</span>
          </QrContainer>
        </LinkContainer>
      )}
    </Container>
  );
};
