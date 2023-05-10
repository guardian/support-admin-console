import React, { useState } from 'react';
import { Button, makeStyles, TextField, Theme } from '@material-ui/core';

const useStyles = makeStyles(({ spacing }: Theme) => ({
  container: {},
  textField: {
    width: '120px',
  },
  button: {
    minWidth: '20px',
    marginLeft: spacing(2),
  },
}));

interface AmountsVariantEditorRowInputProps {
  amounts: number[];
  addAmount: (amount: number) => void;
}

export const AmountsVariantEditorRowInput: React.FC<AmountsVariantEditorRowInputProps> = ({
  amounts,
  addAmount,
}: AmountsVariantEditorRowInputProps) => {
  const [currentValue, setCurrentValue] = useState<number | undefined>();
  const [currentError, setCurrentError] = useState('');

  const onSubmit = () => {
    if (!currentError && currentValue != null && currentValue) {
      addAmount(currentValue);
      setCurrentValue(undefined);
    }
  };

  const checkKey = (event: React.KeyboardEvent<HTMLInputElement>): void => {
    if (event && event.key === 'Enter') {
      onSubmit();
    }
  };

  const checkInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event && event.target) {
      const update = parseInt(event.target.value, 10);
      if (isNaN(update)) {
        setCurrentError('Invalid value');
      } else if (amounts.includes(update)) {
        setCurrentError('Duplicate value');
      } else {
        setCurrentValue(update);
        setCurrentError('');
      }
    }
  };

  const classes = useStyles();
  return (
    <div className={classes.container}>
      <TextField
        className={classes.textField}
        error={!!currentError}
        helperText={currentError}
        onKeyPress={checkKey}
        onChange={checkInput}
        fullWidth={false}
        type="number"
      />
      <Button className={classes.button} onClick={onSubmit} variant="outlined">
        +
      </Button>
    </div>
  );
};
