import { Button, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useState } from 'react';

const StyledTextField = styled(TextField)({
  width: '120px',
});

const StyledButton = styled(Button)(({ theme }) => ({
  minWidth: '20px',
  marginLeft: theme.spacing(2),
}));

interface AmountsVariantEditorRowInputProps {
  amounts: number[];
  addAmount: (amount: number) => void;
  disabled?: boolean;
}

export const AmountsVariantEditorRowInput: React.FC<AmountsVariantEditorRowInputProps> = ({
  amounts,
  addAmount,
  disabled = false,
}: AmountsVariantEditorRowInputProps) => {
  const [currentValue, setCurrentValue] = useState<number | undefined>();
  const [currentError, setCurrentError] = useState('');

  const onSubmit = () => {
    if (!currentError && currentValue) {
      addAmount(currentValue);
      setCurrentValue(undefined);
    }
  };

  const checkKey = (event: React.KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === 'Enter') {
      onSubmit();
    }
  };

  const checkInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const update = parseInt(event.target.value, 10);
    if (isNaN(update)) {
      setCurrentError('Invalid value');
    } else if (amounts.includes(update)) {
      setCurrentError('Duplicate value');
    } else {
      setCurrentValue(update);
      setCurrentError('');
    }
  };

  return (
    <div>
      <StyledTextField
        variant={'standard'}
        error={!!currentError}
        helperText={currentError}
        onKeyPress={checkKey}
        onChange={checkInput}
        fullWidth={false}
        type="number"
        disabled={disabled}
      />
      <StyledButton onClick={onSubmit} variant="outlined" disabled={disabled}>
        +
      </StyledButton>
    </div>
  );
};
