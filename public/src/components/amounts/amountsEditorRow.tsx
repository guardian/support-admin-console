import React from 'react';
import { Button, makeStyles, Theme } from '@material-ui/core';
import { AmountSelection, Amount } from './configuredAmountsEditor';
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

  const addAmount = (amount: Amount): void => {
    // this is already a sorted list, so we could be cleverer here, but this sure takes less code!
    const updatedAmounts = [...amountsSelection.amounts, amount].sort((a, b) => a.value - b.value);

    updateSelection({ ...amountsSelection, amounts: updatedAmounts });
  };

  const deleteAmount = (amount: Amount) => (): void =>
    updateSelection({
      ...amountsSelection,
      amounts: amountsSelection.amounts.filter(a => a.value !== amount.value),
    });

  return (
    <div className={classes.container}>
      <div className={classes.amountsLabel}>{label}</div>
      <div className={classes.amountsAndInputContainer}>
        <div className={classes.amountsContainer}>
          {amountsSelection.amounts.map(amount => (
            <AmountsEditorRowAmount
              key={amount.value}
              amount={amount}
              deleteAmount={deleteAmount(amount)}
            />
          ))}
        </div>
        <AmountInput amounts={amountsSelection.amounts} addAmount={addAmount} />
      </div>
    </div>
  );
};

export default AmountsEditorRow;
