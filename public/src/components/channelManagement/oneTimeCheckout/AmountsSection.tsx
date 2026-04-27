import { Typography } from '@mui/material';
import React from 'react';
import { OneTimeCheckoutVariant } from '../../../models/oneTimeCheckout';
import { ContributionType, contributionTypes } from '../../../utils/models';
import { AmountsVariantEditorRow } from '../../amounts/AmountsVariantEditorRow';
import { useStyles } from '../helpers/testEditorStyles';

interface AmountsSectionProps {
  variant: OneTimeCheckoutVariant;
  onVariantChange: (update: (current: OneTimeCheckoutVariant) => OneTimeCheckoutVariant) => void;
  editMode: boolean;
}

export const AmountsSection: React.FC<AmountsSectionProps> = ({
  variant,
  onVariantChange,
  editMode,
}) => {
  const classes = useStyles();

  const updateAmounts = (label: ContributionType, val: number[]): void => {
    if (variant.amounts != null) {
      onVariantChange((current) => ({
        ...current,
        amounts: {
          ...current.amounts,
          amounts: val,
        },
      }));
    }
  };

  const updateChooseAmount = (label: ContributionType, val: boolean): void => {
    if (variant.amounts != null) {
      onVariantChange((current) => ({
        ...current,
        amounts: {
          ...current.amounts,
          hideChooseYourAmount: val,
        },
      }));
    }
  };

  const updateDefaultAmount = (label: ContributionType, val: number): void => {
    if (variant.amounts != null) {
      onVariantChange((current) => ({
        ...current,
        amounts: {
          ...current.amounts,
          defaultAmount: val,
        },
      }));
    }
  };

  return (
    <div className={classes.sectionContainer}>
      <Typography variant="h4" className={classes.sectionHeader}>
        Amounts
      </Typography>
      <AmountsVariantEditorRow
        label={contributionTypes.OneOff}
        amounts={variant.amounts.amounts || []}
        defaultAmount={variant.amounts.defaultAmount || 0}
        hideChooseYourAmount={variant.amounts.hideChooseYourAmount || false}
        updateAmounts={updateAmounts}
        updateChooseAmount={updateChooseAmount}
        updateDefaultAmount={updateDefaultAmount}
        disabled={!editMode}
      />
    </div>
  );
};
