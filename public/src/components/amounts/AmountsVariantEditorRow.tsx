import React from 'react';
import { Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';
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
    marginTop: spacing(1),
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
  disabled?: boolean;
}

export const AmountsVariantEditorRow: React.FC<AmountsVariantEditorRowProps> = ({
  label,
  amounts,
  defaultAmount,
  hideChooseYourAmount,
  updateAmounts,
  updateChooseAmount,
  updateDefaultAmount,
  disabled = false,
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
    const update = amounts.filter((a) => a !== val);
    updateAmounts(label, update);
  };

  const updateChooseSwitch = (val: boolean) => {
    updateChooseAmount(label, val);
  };

  return (
    <div className={classes.container}>
      <div className={classes.amountsLabelContainer}>
        <div className={classes.amountsLabel}>{label}</div>
      </div>
      <div className={classes.amountsAndInputContainer}>
        <div className={classes.amountsContainer}>
          {amounts.map((amount) => (
            <AmountsVariantEditorRowAmount
              key={`${label}_${amount}`}
              amount={amount}
              isDefault={amount === defaultAmount}
              setAsDefault={() => setAmountAsDefault(amount)}
              deleteAmount={() => deleteAmount(amount)}
              disabled={disabled}
            />
          ))}
        </div>
        <AmountsVariantEditorRowInput amounts={amounts} addAmount={addAmount} disabled={disabled} />
      </div>
      <div className={classes.otherAmountSwitchContainer}>
        <LiveSwitch
          label="Include CHOOSE button"
          isLive={!hideChooseYourAmount}
          onChange={() => updateChooseSwitch(!hideChooseYourAmount)}
          isDisabled={disabled}
        />
      </div>
    </div>
  );
};
