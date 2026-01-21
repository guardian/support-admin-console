import React from 'react';
import { Button, Dialog, Theme, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import useOpenable from '../../../hooks/useOpenable';
import { GutterTest } from '../../../models/gutter';
import GutterVariantPreview from './gutterVariantPreview';

const useStyles = makeStyles(({}: Theme) => ({
  dialog: {
    padding: '10px',
  },
  variantPreviewsContainer: {
    display: 'flex',
    margin: '5px',
  },
  variantPreviewContainer: {
    margin: '5px',
  },
  variantName: {
    marginBottom: '10px',
    fontSize: 26,
    fontWeight: 500,
  },
}));

interface GutterTestPreviewProps {
  test: GutterTest;
}
// PREVIEW ALL VARIANTS

export const GutterTestPreviewButton: React.FC<GutterTestPreviewProps> = ({
  test,
}: GutterTestPreviewProps) => {
  const classes = useStyles();
  const [isOpen, open, close] = useOpenable();

  return (
    <>
      <Button variant="outlined" onClick={open}>
        Preview all variants
      </Button>

      <Dialog open={isOpen} onClose={close} fullWidth maxWidth="xl" className={classes.dialog}>
        <div className={classes.variantPreviewsContainer}>
          {test.variants.map((variant) => (
            <div
              className={classes.variantPreviewContainer}
              key={`variant-preview-${variant.name}`}
            >
              <Typography variant={'h3'} className={classes.variantName}>
                {variant.name}
              </Typography>
              <GutterVariantPreview variant={variant} />
            </div>
          ))}
        </div>
      </Dialog>
    </>
  );
};
