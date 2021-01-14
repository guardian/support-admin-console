import React from 'react';
import { makeStyles, Theme } from '@material-ui/core';
import { AmountSelection } from './configuredAmountsEditor';
import AmountInput from './amountInput';
import AmountsEditorRowAmount from './amountsEditorRowAmount';

const useStyles = makeStyles(({ spacing, palette }: Theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',

    '& > * + *': {
      marginLeft: spacing(4),
    },
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

    '& > * + *': {
      marginLeft: spacing(4),
    },
  },
  amountsContainer: {
    display: 'flex',
    flexDirection: 'row',

    '& > * + *': {
      marginLeft: spacing(2),
    },
  },
}));

interface AmountsEditorRowProps {
  label: string;
  amountsSelection: AmountSelection;
  updateSelection: (AmountSelection: AmountSelection) => void;
}

const AmountsEditorRow: React.FC<AmountsEditorRowProps> = ({
  label,
  amountsSelection,
  updateSelection,
}: AmountsEditorRowProps) => {
  const classes = useStyles();

  const addAmount = (amount: number): void => {
    // this is already a sorted list, so we could be cleverer here, but this sure takes less code!
    const updatedAmounts = [...amountsSelection.amounts, amount].sort(
      (a: number, b: number) => a - b,
    );

    updateSelection({ ...amountsSelection, amounts: updatedAmounts });
  };

  const setAsDefault = (amount: number) => (): void =>
    updateSelection({
      ...amountsSelection,
      defaultAmount: amount,
    });

  const deleteAmount = (index: number) => (): void =>
    updateSelection({
      ...amountsSelection,
      amounts: [
        ...amountsSelection.amounts.slice(0, index),
        ...amountsSelection.amounts.slice(index + 1),
      ],
    });

  return (
    <div className={classes.container}>
      <div className={classes.amountsLabel}>{label}</div>
      <div className={classes.amountsAndInputContainer}>
        <div className={classes.amountsContainer}>
          {amountsSelection.amounts.map((amount, index) => (
            <AmountsEditorRowAmount
              key={amount}
              amount={amount}
              isDefault={amount === amountsSelection.defaultAmount}
              setAsDefault={setAsDefault(amount)}
              deleteAmount={deleteAmount(index)}
            />
          ))}
        </div>
        <AmountInput amounts={amountsSelection.amounts} addAmount={addAmount} />
      </div>
    </div>
  );
};

export default AmountsEditorRow;
