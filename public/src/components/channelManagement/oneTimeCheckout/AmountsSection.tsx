import { Typography } from '@mui/material';
import React from 'react';
import { OneTimeCheckoutVariant } from '../../../models/oneTimeCheckout';
import {
  ContributionType,
  contributionTypes,
  MParticleAmountAttribute,
} from '../../../utils/models';
import { useStyles } from '../helpers/testEditorStyles';
import { AmountsVariantEditorRow } from './AmountsVariantEditorRow';

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
    onVariantChange((current) => ({
      ...current,
      amounts: {
        ...current.amounts,
        amounts: val,
      },
    }));
  };

  const updateChooseAmount = (label: ContributionType, val: boolean): void => {
    onVariantChange((current) => ({
      ...current,
      amounts: {
        ...current.amounts,
        hideChooseYourAmount: val,
      },
    }));
  };

  const updateDefaultAmount = (label: ContributionType, val: number): void => {
    onVariantChange((current) => ({
      ...current,
      amounts: {
        ...current.amounts,
        defaultAmount: val,
      },
    }));
  };

  const updateMParticleAmountAttribute = (
    label: ContributionType,
    val?: MParticleAmountAttribute,
  ): void => {
    onVariantChange((current) => ({
      ...current,
      amounts: {
        ...current.amounts,
        mParticleAmountAttribute: val,
      },
    }));
  };

  return (
    <div className={classes.sectionContainer}>
      <Typography variant="h4" className={classes.sectionHeader}>
        Amounts
      </Typography>
      <AmountsVariantEditorRow
        label={contributionTypes.OneOff}
        amounts={variant.amounts.amounts}
        defaultAmount={variant.amounts.defaultAmount}
        hideChooseYourAmount={variant.amounts.hideChooseYourAmount}
        mParticleAmountAttribute={variant.amounts.mParticleAmountAttribute}
        updateAmounts={updateAmounts}
        updateChooseAmount={updateChooseAmount}
        updateDefaultAmount={updateDefaultAmount}
        updateMParticleAmountAttribute={updateMParticleAmountAttribute}
        disabled={!editMode}
      />
    </div>
  );
};
