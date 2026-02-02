import React from 'react';
import { Typography } from '@mui/material';
import { useStyles } from '../helpers/testEditorStyles';
import { ContributionType, contributionTypes } from '../../../utils/models';
import { SingleCheckoutVariant } from '../../../models/singleCheckout';
import { AmountsVariantEditorRow } from '../../amounts/AmountsVariantEditorRow';

interface AmountsSectionProps {
  variant: SingleCheckoutVariant;
  onVariantChange: (update: (current: SingleCheckoutVariant) => SingleCheckoutVariant) => void;
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
