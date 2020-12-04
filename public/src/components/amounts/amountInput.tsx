import React from 'react';
import { useForm } from 'react-hook-form';
import { Button, makeStyles, TextField, Theme } from '@material-ui/core';
import { Amount } from './configuredAmountsEditor';

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

const isIntegerValidator = (value: string): string | undefined => {
  if (isNaN(parseInt(value))) {
    return 'Must be a number';
  }
  return undefined;
};

const getIsUniqueValidator = (amounts: Amount[]) => (value: string): string | undefined => {
  const values = amounts.map(amount => amount.value.toString());

  if (values.includes(value)) {
    return 'Must be unique';
  }

  return undefined;
};

interface FormData {
  value: string;
}

interface AmountInputProps {
  amounts: Amount[];
  addAmount: (amount: Amount) => void;
}

const AmountInput: React.FC<AmountInputProps> = ({ amounts, addAmount }: AmountInputProps) => {
  const { register, handleSubmit, errors, reset } = useForm<FormData>();

  const isUniqueValidator = getIsUniqueValidator(amounts);

  const validator = (value: string): string | undefined =>
    isIntegerValidator(value) || isUniqueValidator(value);

  const onSubmit = ({ value }: FormData): void => {
    addAmount({ value: parseInt(value) });
    reset({ value: '' });
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === 'Enter') {
      handleSubmit(onSubmit)();
    }
  };

  const classes = useStyles();
  return (
    <div className={classes.container}>
      <TextField
        className={classes.textField}
        inputRef={register({ validate: validator })}
        error={!!errors.value}
        helperText={errors.value?.message}
        name="value"
        onKeyPress={handleKeyPress}
        fullWidth={false}
        type="number"
      />
      <Button className={classes.button} onClick={handleSubmit(onSubmit)} variant="outlined">
        +
      </Button>
    </div>
  );
};

export default AmountInput;
