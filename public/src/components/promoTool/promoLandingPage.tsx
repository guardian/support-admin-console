import { TextField } from '@mui/material';
import React from 'react';
import { useStyles } from './promoEditor';
import type { LandingPage } from './utils/promoModels';

type PromoLandingPageProps = {
  landingPage?: LandingPage;
  updateLandingPage: (landingPage: LandingPage | undefined) => void;
  isEditing: boolean;
};

export const PromoLandingPage = ({
  landingPage,
  updateLandingPage,
  isEditing,
}: PromoLandingPageProps) => {
  const classes = useStyles();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updated = { ...landingPage, [name]: value || undefined };
    Object.keys(updated).forEach(
      (key) =>
        updated[key as keyof LandingPage] === undefined && delete updated[key as keyof LandingPage],
    );
    updateLandingPage(Object.keys(updated).length === 0 ? undefined : updated);
  };

  return (
    <div>
      <TextField
        className={classes.formField}
        fullWidth
        label="Label"
        value={landingPage?.roundelHtml || ''}
        onChange={handleChange}
        disabled={!isEditing}
        name="roundelHtml"
      />
      <TextField
        className={classes.formField}
        fullWidth
        label="Title"
        value={landingPage?.title || ''}
        onChange={handleChange}
        disabled={!isEditing}
        name="title"
      />
      <TextField
        className={classes.formField}
        fullWidth
        label="Description (supports Markdown)"
        multiline
        rows={3}
        value={landingPage?.description || ''}
        onChange={handleChange}
        disabled={!isEditing}
        name="description"
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
