import React, { useState } from 'react';
import { makeStyles, Theme } from '@material-ui/core';
import LiveSwitch from '../shared/liveSwitch';
import { ContributionType } from '../../utils/models';

import { AmountsVariantEditorRowAmount } from './AmountsVariantEditorRowAmount';
import { AmountsVariantEditorRowInput } from './AmountsVariantEditorRowInput';

const useStyles = makeStyles(({ spacing, palette }: Theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  amountsLabelContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-start',
    marginBottom: spacing(1),
  },
  otherAmountSwitchContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-start',
    marginTop: spacing(1),
  },
  amountsLabel: {
    width: 80,
    textTransform: 'uppercase',
    fontWeight: 'bold',
    color: palette.grey[800],
  },
  amountsAndInputContainer: {
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',

    '& > * + *': {
      marginLeft: spacing(4),
    },
  },
  amountsContainer: {
    display: 'flex',
    flexDirection: 'row',
    margin: 0,

    '& > * + *': {
      marginLeft: spacing(2),
    },
  },
}));

interface AmountsVariantEditorRowProps {
  label: ContributionType;
  amounts: number[];
  defaultAmount: number;
  hideChooseYourAmount: boolean;
  updateAmounts: (label: ContributionType, val: number[]) => void;
  updateChooseAmount: (label: ContributionType, val: boolean) => void;
  updateDefaultAmount: (label: ContributionType, val: number) => void;
}

export const AmountsVariantEditorRow: React.FC<AmountsVariantEditorRowProps> = ({
  label,
  amounts,
  defaultAmount,
  hideChooseYourAmount,
  updateAmounts,
  updateChooseAmount,
  updateDefaultAmount,
}: AmountsVariantEditorRowProps) => {
  const classes = useStyles();

  const setAmountAsDefault = (val: number) => {
    updateDefaultAmount(label, val);
  };

  const addAmount = (val: number) => {
    const update: number[] = [];
    update.push(...amounts, val);
    update.sort((a, b) => a - b);
    updateAmounts(label, update);
  };

  const deleteAmount = (val: number) => {
    const update = amounts.filter(a => a !== val);
    updateAmounts(label, update);
  };

  const updateChooseSwitch = (val: boolean) => {
    updateChooseAmount(label, val);
  };

  console.log(label, defaultAmount, hideChooseYourAmount);

  return (
    <div className={classes.container}>
      <div className={classes.amountsLabelContainer}>
        <div className={classes.amountsLabel}>{label}</div>
      </div>
      <div className={classes.amountsAndInputContainer}>
        <div className={classes.amountsContainer}>
          {amounts.map(amount => (
           <AmountsVariantEditorRowAmount
             key={amount}
             amount={amount}
             isDefault={amount === defaultAmount}
             setAsDefault={() => setAmountAsDefault(amount)}
             deleteAmount={() => deleteAmount(amount)}
           />
          ))}
        </div>
        <AmountsVariantEditorRowInput amounts={amounts} addAmount={addAmount} />
      </div>
      <div className={classes.otherAmountSwitchContainer}>
        <LiveSwitch
          label="Include CHOOSE button"
          isLive={!hideChooseYourAmount}
          onChange={() => updateChooseSwitch(!hideChooseYourAmount)}
          isDisabled={false}
        />
      </div>
    </div>
  );
};
