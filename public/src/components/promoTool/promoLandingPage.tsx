import React from 'react';
import { LandingPage } from './utils/promoModels';
import { TextField } from '@mui/material';
import { useStyles } from './promoEditor';

type PromoLandingPageProps = {
  landingPage?: LandingPage;
  updateLandingPage: (landingPage: LandingPage) => void;
  isEditing: boolean;
};

export const PromoLandingPage = ({
  landingPage,
  updateLandingPage,
  isEditing,
}: PromoLandingPageProps) => {
  const classes = useStyles();
  return (
    <div>
      <TextField
        className={classes.formField}
        fullWidth
        label="Title"
        value={landingPage?.title || ''}
        onChange={e => updateLandingPage({ ...landingPage, title: e.target.value || undefined })}
        disabled={!isEditing}
        name="landingPageTitle"
      />
      <TextField
        className={classes.formField}
        fullWidth
        label="Description for product page (supports Markdown)"
        multiline
        rows={3}
        value={landingPage?.description || ''}
        onChange={e =>
          updateLandingPage({ ...landingPage, description: e.target.value || undefined })
        }
        disabled={!isEditing}
        name="landingPageDescription"
      />
      <TextField
        className={classes.formField}
        fullWidth
        label="Product page price card"
        value={landingPage?.roundelHtml || ''}
        onChange={e =>
          updateLandingPage({ ...landingPage, roundelHtml: e.target.value || undefined })
        }
        disabled={!isEditing}
        name="landingPageRoundelHtml"
      />
      <span>
        For examples of how to format text using Markdown see{' '}
        <a
          href="https://guides.github.com/features/mastering-markdown/#examples"
          target="_blank"
          rel="noopener noreferrer"
        >
          here
        </a>
      </span>
    </div>
  );
};
