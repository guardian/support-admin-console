import React from 'react';
import { Button, makeStyles, Theme } from '@material-ui/core';
import { AmountSelection, Amount } from './configuredAmountsEditor';
import AmountInput from './amountInput';

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

  const addAmount = (amount: Amount): void =>
    updateSelection({ ...amountsSelection, amounts: [...amountsSelection.amounts, amount] });

  return (
    <div className={classes.container}>
      <div className={classes.amountsLabel}>{label}</div>
      <div className={classes.amountsAndInputContainer}>
        <div className={classes.amountsContainer}>
          {amountsSelection.amounts.map(amount => (
            <Button key={amount.value} variant="outlined" disableElevation>
              {amount.value}
            </Button>
          ))}
        </div>
        <AmountInput amounts={amountsSelection.amounts} addAmount={addAmount} />
      </div>
    </div>
  );
};

export default AmountsEditorRow;
