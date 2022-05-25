import React from 'react';
import { Button, Dialog, makeStyles, Theme, Typography } from '@material-ui/core';
import { EpicTest } from './epicTestsForm';
import useOpenable from '../../../hooks/useOpenable';
import EpicVariantPreview from './epicVariantPreview';

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

interface EpicTestPreviewProps {
  test: EpicTest;
}

export const EpicTestPreviewButton: React.FC<EpicTestPreviewProps> = ({
  test,
}: EpicTestPreviewProps) => {
  const classes = useStyles();
  const [isOpen, open, close] = useOpenable();

  return (
    <>
      <Button variant="outlined" onClick={open}>
        Preview all variants
      </Button>

      <Dialog
        open={isOpen}
        onClose={close}
        fullWidth
        maxWidth="xl"
        className={classes.dialog}
      >
        <div className={classes.variantPreviewsContainer}>
          {test.variants.map(variant => (
            <div
              className={classes.variantPreviewContainer}
              key={`variant-preview-${variant.name}`}
            >
              <Typography variant={'h3'} className={classes.variantName}>
                {variant.name}
              </Typography>
              <EpicVariantPreview variant={variant} moduleName="ContributionsEpic" />
            </div>
          ))}
        </div>
      </Dialog>
    </>
  );
};
