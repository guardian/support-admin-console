import React from 'react';
import { FormField } from './promoEditorStyles';
import { LandingPage } from './utils/promoModels';

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
      <FormField
        fullWidth
        label="Label"
        value={landingPage?.roundelHtml ?? ''}
        onChange={handleChange}
        disabled={!isEditing}
        name="roundelHtml"
      />
      <FormField
        fullWidth
        label="Title"
        value={landingPage?.title ?? ''}
        onChange={handleChange}
        disabled={!isEditing}
        name="title"
      />
      <FormField
        fullWidth
        label="Description (supports Markdown)"
        multiline
        rows={3}
        value={landingPage?.description ?? ''}
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
