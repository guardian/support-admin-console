import React from 'react';
import { Button, TextField, Theme, Typography } from '@mui/material';
import { useForm, SubmitHandler } from 'react-hook-form';
import { makeStyles } from '@mui/styles';
import { Link } from '@mui/icons-material';
import { MediumSelector } from './MediumSelector';

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
}));

interface FormData {
  url: string;
  campaign: string;
  content: string;
  term: string;
  medium: string;
}

export const LinkTrackingBuilder: React.FC = () => {
  const classes = useStyles();
  const [link, setLink] = React.useState<string>('');

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = ({ url, campaign, content, term, medium }) => {
    const link = `${url}?utm_medium=${medium}&utm_campaign=${campaign}&utm_content=${content}&utm_term=${term}`;
    setLink(link);
  };

  return (
    <form className={classes.container} onSubmit={handleSubmit(onSubmit)}>
      <div className={classes.fieldsContainer}>
        <TextField
          name="url"
          label="URL (without tracking)"
          inputRef={register({
            required: true,
            validate: value => {
              try {
                new URL(value);
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
        <MediumSelector control={control} />
      </div>

      <Button type="submit" variant="contained" color="primary">
        Build link
      </Button>

      <div className={classes.linkContainer}>
        <TextField className={classes.link} label="Link with tracking" value={link} disabled />
        <Button
          className={classes.copyButton}
          variant="outlined"
          startIcon={<Link />}
          onClick={() => {
            navigator.clipboard.writeText(link);
          }}
        >
          Copy
        </Button>
      </div>
    </form>
  );
};
