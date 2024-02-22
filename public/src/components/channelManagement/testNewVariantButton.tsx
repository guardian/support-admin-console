import React from 'react';
import { Button, Theme, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';

import AddIcon from '@mui/icons-material/Add';
import useOpenable from '../../hooks/useOpenable';
import CreateVariantDialog from './createVariantDialog';

const useStyles = makeStyles(({ spacing, palette }: Theme) => ({
  button: {
    width: '100%',
    display: 'flex',
    justifyContent: 'start',
    border: `1px dashed ${palette.grey[700]}`,
    borderRadius: '4px',
    padding: '12px 16px',
  },
  container: {
    display: 'flex',
    alignItems: 'center',
    '& > * + *': {
      marginLeft: spacing(1),
    },
  },
  text: {
    fontSize: 14,
    fontWeight: 500,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
}));

interface BannerTestNewVariantButtonProps {
  existingNames: string[];
  createVariant: (name: string) => void;
  isDisabled: boolean;
}

const BannerTestNewVariantButton: React.FC<BannerTestNewVariantButtonProps> = ({
  existingNames,
  createVariant,
  isDisabled,
}: BannerTestNewVariantButtonProps) => {
  const classes = useStyles();
  const [isOpen, open, close] = useOpenable();

  return (
    <>
      <Button className={classes.button} onClick={open} disabled={isDisabled}>
        <div className={classes.container}>
          <AddIcon />
          <Typography className={classes.text}>New variant</Typography>
        </div>
      </Button>
      <CreateVariantDialog
        isOpen={isOpen}
        close={close}
        existingNames={existingNames}
        createVariant={createVariant}
        mode={'NEW'}
      />
    </>
  );
};

export default BannerTestNewVariantButton;
