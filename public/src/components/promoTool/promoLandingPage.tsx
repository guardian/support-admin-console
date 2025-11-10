import React from 'react';
import { LandingPage, PromoProduct } from './utils/promoModels';
import { Checkbox, FormControlLabel, FormGroup, TextField } from '@mui/material';
import { useStyles } from './promoEditor';

type PromoLandingPageProps = {
  landingPage?: LandingPage;
  product?: PromoProduct;
  updateLandingPage: (landingPage: LandingPage) => void;
  isEditing: boolean;
};

export const PromoLandingPage = ({
  landingPage,
  updateLandingPage,
  product,
  isEditing,
}: PromoLandingPageProps) => {
  const classes = useStyles();
  return (
    <div>
      {product === 'Newspaper' && (
        <fieldset className={classes.formField} disabled={!isEditing}>
          <legend id="default-product-group">Default product</legend>
          <FormGroup row>
            <FormControlLabel
              control={
                <Checkbox
                  checked={landingPage?.defaultProduct === 'voucher'}
                  onChange={() =>
                    updateLandingPage({
                      ...landingPage,
                      defaultProduct: 'voucher',
                    })
                  }
                  name="voucher"
                />
              }
              label="Voucher"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={
                    landingPage?.defaultProduct === 'delivery' || !landingPage?.defaultProduct
                  }
                  onChange={() =>
                    updateLandingPage({
                      ...landingPage,
                      defaultProduct: 'delivery',
                    })
                  }
                  name="delivery"
                />
              }
              label="Home Delivery"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={landingPage?.defaultProduct === 'nationalDelivery'}
                  onChange={() =>
                    updateLandingPage({
                      ...landingPage,
                      defaultProduct: 'nationalDelivery',
                    })
                  }
                  name="nationalDelivery"
                />
              }
              label="National Delivery"
            />
          </FormGroup>
        </fieldset>
      )}
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
