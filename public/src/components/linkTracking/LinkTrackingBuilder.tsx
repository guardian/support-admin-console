import React from 'react';
import { Button, TextField, Theme, Typography, Link } from '@mui/material';
import { useForm, SubmitHandler } from 'react-hook-form';
import { makeStyles } from '@mui/styles';
import { MediumSelector } from './MediumSelector';
import lzstring from 'lz-string';
import { Link as LinkIcon, OpenInNew } from '@mui/icons-material';

const useStyles = makeStyles(({ palette, spacing }: Theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '800px',
    margin: '20px',
    '& > * + *': {
      marginTop: spacing(2),
    },
  },
  fieldsContainer: {
    display: 'flex',
    flexDirection: 'column',
    '& > * + *': {
      marginTop: spacing(2),
    },
    paddingBottom: spacing(3),
    borderBottom: `3px solid ${palette.grey[500]}`,
  },
  linkContainer: {
    display: 'flex',
  },
  link: {
    flex: 1,
    '& input': {
      '-webkit-text-fill-color': '#22874D !important',
      fontWeight: 700,
    },
  },
  copyButton: {
    marginLeft: spacing(2),
    padding: '0 8px',
    fontSize: '14px',
    fontWeight: 'normal',
    color: palette.grey[700],
    lineHeight: 1.5,
  },
  header: {
    marginTop: spacing(3),
    fontSize: 16,
    color: palette.grey[900],
    fontWeight: 500,
  },
  qrContainer: {
    display: 'flex',
    alignItems: 'center',
    marginLeft: spacing(2),
    '& > * + *': {
      marginLeft: '4px',
    },
  },
}));

const addHttps = (url: string): string => {
  if (url.startsWith('https://')) {
    return url;
  } else {
    return `https://${url}`;
  }
};

interface FormData {
  url: string;
  campaign: string;
  content: string;
  term: string;
  sourceAndMedium: string; // This is the source and medium separated by a double underscore
}

export const LinkTrackingBuilder: React.FC = () => {
  const classes = useStyles();
  const [link, setLink] = React.useState<string>('');

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      url: 'https://support.theguardian.com',
    },
  });

  const onSubmit: SubmitHandler<FormData> = ({ url, campaign, content, term, sourceAndMedium }) => {
    const urlWithHttps = addHttps(url);
    const [source, medium] = sourceAndMedium.split('__');

    const link = `${urlWithHttps}?utm_medium=${medium}&utm_campaign=${campaign}&utm_content=${content}&utm_term=${term}&utm_source=${source}`;
    setLink(link);
  };

  // To be called whenever something changes, and the user needs to re-submit
  const resetLink = () => setLink('');

  const linkReady = link.trim() !== '';

  return (
    <form
      className={classes.container}
      onChange={() => resetLink()}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className={classes.fieldsContainer}>
        <TextField
          name="url"
          label="URL (without tracking)"
          inputRef={register({
            required: true,
            validate: value => {
              // Check it's a valid url and has no querystring
              try {
                const url = new URL(addHttps(value));
                if (value.endsWith('?') || url.search !== '') {
                  return 'URL must not already have tracking';
                }
                return true;
              } catch {
                return 'Invalid URL';
              }
            },
          })}
          error={!!errors.url}
          helperText={errors?.url?.message}
        />

        <Typography className={classes.header} variant="h4">
          Campaign
        </Typography>
        <TextField
          name="campaign"
          label="Campaign"
          inputRef={register({ required: true })}
          error={!!errors.campaign}
          helperText={errors?.campaign?.message}
        />

        <Typography className={classes.header} variant="h4">
          Call to action / creative
        </Typography>
        <TextField
          name="content"
          label="Creative / utm_content / AB test name"
          inputRef={register({ required: true })}
          error={!!errors.content}
          helperText={errors?.content?.message}
        />
        <TextField
          name="term"
          label="Audience segment / utm_term / AB test variant name"
          inputRef={register({ required: true })}
          error={!!errors.term}
          helperText={errors?.term?.message}
        />

        <Typography className={classes.header} variant="h4">
          Placement
        </Typography>
        <MediumSelector onUpdate={resetLink} control={control} />
      </div>

      <Button type="submit" variant="contained" color="primary" disabled={linkReady}>
        Build link
      </Button>

      {linkReady && (
        <div className={classes.linkContainer}>
          <TextField className={classes.link} value={link} disabled />
          <Button
            className={classes.copyButton}
            variant="outlined"
            startIcon={<LinkIcon />}
            onClick={() => {
              navigator.clipboard.writeText(link);
            }}
          >
            Copy
          </Button>

          <Link
            className={classes.qrContainer}
            target="_blank"
            href={`/qr-code?url=${lzstring.compressToEncodedURIComponent(link)}`}
          >
            <OpenInNew />
            <span>QR code</span>
          </Link>
        </div>
      )}
    </form>
  );
};
