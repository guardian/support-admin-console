import React, { useState, useEffect } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import {
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from '@material-ui/core';
import { AmountsVariantEditorRow } from './AmountsVariantEditorRow';
import { DeleteVariantButton } from './DeleteVariantButton';

import {
  AmountsVariant,
  ContributionType,
  ContributionTypes,
  AmountValuesObject,
} from '../../utils/models';

const useStyles = makeStyles(({ spacing, palette }: Theme) => ({
  container: {
    padding: `${spacing(3)}px ${spacing(4)}px`,
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
  defaultContribution: {},
}));

interface AmountsVariantEditorProps {
  variant: AmountsVariant;
  testIsCountryTier: boolean;
  updateVariant: (variant: AmountsVariant) => void;
  deleteVariant: (variant: AmountsVariant) => void;
}

export const AmountsVariantEditor: React.FC<AmountsVariantEditorProps> = ({
  variant,
  testIsCountryTier,
  updateVariant,
  deleteVariant,
}: AmountsVariantEditorProps) => {
  const classes = useStyles();

  const { amountsCardData, defaultContributionType, variantName } = variant;

  const [currentContributionType, setCurrentContributionType] = useState(
    defaultContributionType || 'MONTHLY',
  );

  useEffect(() => {
    setCurrentContributionType(defaultContributionType || 'MONTHLY');
  }, [variant]);

  useEffect(() => {
    const updatedAmounts: AmountsVariant = {
      variantName,
      defaultContributionType: currentContributionType,
      amountsCardData,
    };
    updateVariant(updatedAmounts);
  }, [currentContributionType]);

  const updateAmounts = (label: ContributionType, val: number[]) => {
    const contributionsToUpdate = amountsCardData[label];
    if (contributionsToUpdate != null) {
      const updatedAmounts: AmountsVariant = {
        variantName,
        defaultContributionType,
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

  const updateDefaultContributionType = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentContributionType((event.target as HTMLInputElement).value as ContributionType);
  };

  const confirmDeletion = () => deleteVariant(variant);

  const buildAmountsCardRows = () => {
    return (
      <div>
        {Object.keys(ContributionTypes).map(k => {
          const cardData: AmountValuesObject = amountsCardData[k as ContributionType];
          if (cardData != null) {
            return (
              <div key={`${variantName}_${k}_row`}>
                <Divider />
                <AmountsVariantEditorRow
                  label={k as ContributionType}
                  amounts={cardData.amounts}
                  defaultAmount={cardData.defaultAmount}
                  hideChooseYourAmount={cardData.hideChooseYourAmount || false}
                  updateAmounts={updateAmounts}
                  updateChooseAmount={updateChooseAmount}
                  updateDefaultAmount={updateDefaultAmount}
                />
              </div>
            );
          } else {
            return <></>;
          }
        })}
      </div>
    );
  };

  const buildContributionTypeControl = () => {
    return (
      <FormControl>
        <FormLabel id={`${variantName}_default_contribution_selector`}>
          Default contributions type
        </FormLabel>
        <RadioGroup
          aria-labelledby={`${variantName}_default_contribution_selector`}
          name={`${variantName}_default_contribution_selector`}
          value={currentContributionType}
          onChange={e => updateDefaultContributionType(e)}
          row
        >
          {Object.keys(ContributionTypes).map(k => {
            return (
              <FormControlLabel
                key={`${variantName}_${k}`}
                value={k}
                control={<Radio />}
                label={k}
                disabled={!testIsCountryTier}
              />
            );
          })}
        </RadioGroup>
      </FormControl>
    );
  };

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
      {buildContributionTypeControl()}
      {buildAmountsCardRows()}
    </div>
  );
};
