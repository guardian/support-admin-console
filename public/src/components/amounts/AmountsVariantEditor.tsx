import React, { useState, useEffect } from 'react';
import { Theme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import { DeleteVariantButton } from './DeleteVariantButton';
import { DisplayContributionControl } from './DisplayContributionControl';
import { DefaultContributionControl } from './DefaultContributionControl';
import { AmountsCardRows } from './AmountsCardRows';

import { AmountsVariant, ContributionType } from '../../utils/models';

const useStyles = makeStyles(({ spacing, palette }: Theme) => ({
  container: {
    padding: `${spacing(3)} ${spacing(4)}`,
    border: `1px solid ${palette.grey[700]}`,
    borderRadius: 4,
    backgroundColor: 'white',
    marginTop: spacing(2),

    '& > * + *': {
      marginTop: spacing(2),
    },
  },
  topBar: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
  },
  variantName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  contributionControls: {
    display: 'block',
  },
}));

interface AmountsVariantEditorProps {
  variant: AmountsVariant;
  updateVariant: (variant: AmountsVariant) => void;
  deleteVariant: (variant: AmountsVariant) => void;
  isCountryTest: boolean;
}

export const AmountsVariantEditor: React.FC<AmountsVariantEditorProps> = ({
  variant,
  updateVariant,
  deleteVariant,
  isCountryTest,
}: AmountsVariantEditorProps) => {
  const classes = useStyles();

  const { amountsCardData, defaultContributionType, displayContributionType, variantName } =
    variant;

  const [currentContributionDefault, setCurrentContributionDefault] =
    useState(defaultContributionType);

  const [currentContributionDisplay, setCurrentContributionDisplay] =
    useState(displayContributionType);

  useEffect(() => {
    setCurrentContributionDefault(defaultContributionType);
    setCurrentContributionDisplay(displayContributionType);
  }, [variant]);

  useEffect(() => {
    const updatedAmounts: AmountsVariant = {
      variantName,
      defaultContributionType: currentContributionDefault,
      displayContributionType: currentContributionDisplay,
      amountsCardData,
    };
    updateVariant(updatedAmounts);
  }, [currentContributionDefault, currentContributionDisplay]);

  const updateAmounts = (label: ContributionType, val: number[]) => {
    const contributionsToUpdate = amountsCardData[label];
    if (contributionsToUpdate != null) {
      const updatedAmounts: AmountsVariant = {
        variantName,
        defaultContributionType,
        displayContributionType,
        amountsCardData: {
          ...amountsCardData,
          [label]: {
            ...contributionsToUpdate,
            amounts: val,
          },
        },
      };
      updateVariant(updatedAmounts);
    }
  };

  const updateChooseAmount = (label: ContributionType, val: boolean) => {
    const contributionsToUpdate = amountsCardData[label];
    if (contributionsToUpdate != null) {
      const updatedAmounts: AmountsVariant = {
        variantName,
        defaultContributionType,
        displayContributionType,
        amountsCardData: {
          ...amountsCardData,
          [label]: {
            ...contributionsToUpdate,
            hideChooseYourAmount: val,
          },
        },
      };
      updateVariant(updatedAmounts);
    }
  };

  const updateDefaultAmount = (label: ContributionType, val: number) => {
    const contributionsToUpdate = amountsCardData[label];
    if (contributionsToUpdate != null) {
      const updatedAmounts: AmountsVariant = {
        variantName,
        defaultContributionType,
        displayContributionType,
        amountsCardData: {
          ...amountsCardData,
          [label]: {
            ...contributionsToUpdate,
            defaultAmount: val,
          },
        },
      };
      updateVariant(updatedAmounts);
    }
  };

  const updateDefaultContribution = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedDefault = (event.target as HTMLInputElement).value as ContributionType;
    setCurrentContributionDefault(updatedDefault);
  };

  const updateDisplayContribution = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedContribution = event.target.name as ContributionType;
    const includeContribution = event.target.checked;
    const updatedDisplayContribution: ContributionType[] = [];

    if (includeContribution) {
      if (!currentContributionDisplay.includes(updatedContribution)) {
        updatedDisplayContribution.push(...currentContributionDisplay, updatedContribution);
      }
    } else {
      const filteredContributions = currentContributionDisplay.filter((c) => {
        return c !== updatedContribution;
      });
      updatedDisplayContribution.push(...filteredContributions);
    }
    setCurrentContributionDisplay(updatedDisplayContribution);
  };

  const confirmDeletion = () => deleteVariant(variant);

  const checkIfVariantIsControl = () => {
    return 'CONTROL' === variantName.toUpperCase();
  };

  return (
    <div className={classes.container}>
      <div className={classes.topBar}>
        <div className={classes.variantName}>{variantName}</div>
        {!checkIfVariantIsControl() && (
          <DeleteVariantButton variantName={variantName} confirmDeletion={confirmDeletion} />
        )}
      </div>
      <DisplayContributionControl
        variantName={variantName}
        currentContributionDisplay={currentContributionDisplay}
        updateDisplayContribution={updateDisplayContribution}
        isCountryTest={isCountryTest}
      />
      <DefaultContributionControl
        variantName={variantName}
        currentContributionDefault={currentContributionDefault}
        currentContributionDisplay={currentContributionDisplay}
        updateDefaultContribution={updateDefaultContribution}
      />
      <AmountsCardRows
        variantName={variantName}
        amountsCardData={amountsCardData}
        updateAmounts={updateAmounts}
        updateChooseAmount={updateChooseAmount}
        updateDefaultAmount={updateDefaultAmount}
      />
    </div>
  );
};
