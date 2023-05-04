import React, { useState, useEffect } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import {AmountsVariantEditorRow} from './AmountsVariantEditorRow';

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

    '& > * + *': {
      marginTop: spacing(2),
    },
  },
}));

interface AmountsVariantEditorProps {
	variant: AmountsVariant;
  updateVariant: (variant: AmountsVariant) => void;
  deleteVariant: (variant: AmountsVariant) => void;
};

export const AmountsVariantEditor: React.FC<AmountsVariantEditorProps> = ({
  variant,
  updateVariant,
  deleteVariant,
}: AmountsVariantEditorProps) => {
  const classes = useStyles();

  const {
    amountsCardData,
    defaultContributionType,
    variantName,
  } = variant;

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

  const updateDefaultContributionType = (val: ContributionType) => {
    const updatedAmounts: AmountsVariant = {
      variantName,
      defaultContributionType: val,
      amountsCardData,
    };
    updateVariant(updatedAmounts);
  };

  const buildAmountsCardRows = () => {
    return (
      <div>
        {Object.keys(ContributionTypes).map(k => {
          const cardData: AmountValuesObject = amountsCardData[k as ContributionType];
          if (cardData != null) {
            return (
              <AmountsVariantEditorRow 
                key={`${variantName}_${k}_row`}
                label={k as ContributionType}
                amounts={cardData.amounts}
                defaultAmount={cardData.defaultAmount}
                hideChooseYourAmount={cardData.hideChooseYourAmount || false}
                updateAmounts={updateAmounts}
                updateChooseAmount={updateChooseAmount}
                updateDefaultAmount={updateDefaultAmount}
              />
            )
          }
          else {
            return (<></>);
          } 
        })}
      </div>
    );
  };

  return (
    <div className={classes.container}>
      <div>Variant {variantName} goes here</div>
      <div>Default contributions type selector will go here</div>
      {buildAmountsCardRows()}
    </div>
  );
};

// const useStyles = makeStyles(({ spacing, palette }: Theme) => ({
//   container: {
//     padding: `${spacing(3)}px ${spacing(4)}px`,
//     border: `1px solid ${palette.grey[700]}`,
//     borderRadius: 4,
//     backgroundColor: 'white',

//     '& > * + *': {
//       marginTop: spacing(2),
//     },
//   },
//   header: {
//     display: 'flex',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     color: palette.grey[800],
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   rowsContainer: {
//     '& > * + *': {
//       marginTop: spacing(2),
//     },
//   },
// }));
