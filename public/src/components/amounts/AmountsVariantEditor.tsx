import React, { useState, useEffect } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Divider } from '@material-ui/core';
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
};

export const AmountsVariantEditor: React.FC<AmountsVariantEditorProps> = ({
  variant,
  testIsCountryTier,
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
            )
          }
          else {
            return (<></>);
          } 
        })}
      </div>
    );
  };

  const checkIfVariantIsControl = () => {
    return 'CONTROL' === variantName.toUpperCase();
  }

  return (
    <div className={classes.container} >
      <div className={classes.topBar}>
        <div className={classes.variantName} >{variantName}</div>
        {!checkIfVariantIsControl() && (
            <DeleteVariantButton
              variantName={variantName}
              confirmDeletion={confirmDeletion}
            />
        )}
      </div>
      {testIsCountryTier && (
        <div className={classes.defaultContribution} >Default contributions type selector will go here</div>
      )}
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
