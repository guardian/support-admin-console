import React from 'react';
import { Typography } from '@mui/material';
import { useStyles } from '../helpers/testEditorStyles';
import { DisplayContributionControl } from '../../amounts/DisplayContributionControl';
import { DefaultContributionControl } from '../../amounts/DefaultContributionControl';
import { AmountsCardRows } from '../../amounts/AmountsCardRows';
import { ContributionType } from '../../../utils/models';
import { SingleCheckoutVariant } from '../../../models/singleCheckout';

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

  const updateDisplayContribution = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const updatedContribution = event.target.name as ContributionType;
    const includeContribution = event.target.checked;
    const currentDisplay = variant.amounts.displayContributionType;

    let updatedDisplayContribution: ContributionType[];

    if (includeContribution) {
      if (!currentDisplay.includes(updatedContribution)) {
        updatedDisplayContribution = [...currentDisplay, updatedContribution];
      } else {
        updatedDisplayContribution = currentDisplay;
      }
    } else {
      updatedDisplayContribution = currentDisplay.filter((c) => c !== updatedContribution);
    }

    onVariantChange((current) => ({
      ...current,
      amounts: {
        ...current.amounts,
        displayContributionType: updatedDisplayContribution,
      },
    }));
  };

  const updateDefaultContribution = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const updatedDefault = event.target.value as ContributionType;

    onVariantChange((current) => ({
      ...current,
      amounts: {
        ...current.amounts,
        defaultContributionType: updatedDefault,
      },
    }));
  };

  const updateAmounts = (label: ContributionType, val: number[]): void => {
    const contributionsToUpdate = variant.amounts.amountsCardData[label];
    if (contributionsToUpdate != null) {
      onVariantChange((current) => ({
        ...current,
        amounts: {
          ...current.amounts,
          amountsCardData: {
            ...current.amounts.amountsCardData,
            [label]: {
              ...contributionsToUpdate,
              amounts: val,
            },
          },
        },
      }));
    }
  };

  const updateChooseAmount = (label: ContributionType, val: boolean): void => {
    const contributionsToUpdate = variant.amounts.amountsCardData[label];
    if (contributionsToUpdate != null) {
      onVariantChange((current) => ({
        ...current,
        amounts: {
          ...current.amounts,
          amountsCardData: {
            ...current.amounts.amountsCardData,
            [label]: {
              ...contributionsToUpdate,
              hideChooseYourAmount: val,
            },
          },
        },
      }));
    }
  };

  const updateDefaultAmount = (label: ContributionType, val: number): void => {
    const contributionsToUpdate = variant.amounts.amountsCardData[label];
    if (contributionsToUpdate != null) {
      onVariantChange((current) => ({
        ...current,
        amounts: {
          ...current.amounts,
          amountsCardData: {
            ...current.amounts.amountsCardData,
            [label]: {
              ...contributionsToUpdate,
              defaultAmount: val,
            },
          },
        },
      }));
    }
  };

  return (
    <div className={classes.sectionContainer}>
      <Typography variant="h4" className={classes.sectionHeader}>
        Amounts
      </Typography>
      <DisplayContributionControl
        variantName={variant.name}
        isCountryTest={false}
        currentContributionDisplay={variant.amounts.displayContributionType}
        updateDisplayContribution={updateDisplayContribution}
      />
      <DefaultContributionControl
        variantName={variant.name}
        currentContributionDefault={variant.amounts.defaultContributionType}
        currentContributionDisplay={variant.amounts.displayContributionType}
        updateDefaultContribution={updateDefaultContribution}
        disabled={!editMode}
      />
      <AmountsCardRows
        variantName={variant.name}
        amountsCardData={variant.amounts.amountsCardData}
        updateAmounts={updateAmounts}
        updateChooseAmount={updateChooseAmount}
        updateDefaultAmount={updateDefaultAmount}
        disabled={!editMode}
      />
    </div>
  );
};
