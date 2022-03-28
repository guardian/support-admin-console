import React from 'react';
import { Button, createStyles, Theme, Typography, WithStyles, withStyles } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import useOpenable from '../../hooks/useOpenable';
import CreateVariantDialog from './createVariantDialog';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const styles = ({ spacing, palette }: Theme) =>
  createStyles({
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
  });

interface BannerTestNewVariantButtonProps extends WithStyles<typeof styles> {
  existingNames: string[];
  createVariant: (name: string) => void;
  isDisabled: boolean;
}

const BannerTestNewVariantButton: React.FC<BannerTestNewVariantButtonProps> = ({
  classes,
  existingNames,
  createVariant,
  isDisabled,
}: BannerTestNewVariantButtonProps) => {
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

export default withStyles(styles)(BannerTestNewVariantButton);
