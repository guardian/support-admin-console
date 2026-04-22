import { Button, Dialog, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import React from 'react';
import useOpenable from '../../../hooks/useOpenable';
import type { EpicTest } from '../../../models/epic';
import type { EpicModuleName } from '../helpers/shared';
import VariantPreview from './variantPreview';

const useStyles = makeStyles({
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
});

interface EpicTestPreviewProps {
  test: EpicTest;
  moduleName: EpicModuleName;
}

export const EpicTestPreviewButton: React.FC<EpicTestPreviewProps> = ({
  test,
  moduleName,
}: EpicTestPreviewProps) => {
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
              <VariantPreview variant={variant} moduleName={moduleName} />
            </div>
          ))}
        </div>
      </Dialog>
    </>
  );
};
