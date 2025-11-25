import React from 'react';
import { TextField } from '@mui/material';

export const MParticleAudienceEditor: React.FC<{
  mParticleAudience?: number;
  disabled: boolean;
  onChange: (mParticleAudience?: number) => void;
}> = ({ mParticleAudience, disabled, onChange }) => {
  const [inputValue, setInputValue] = React.useState<string>(mParticleAudience?.toString() ?? '');
  const [error, setError] = React.useState<string>('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value.trim();
    setInputValue(newValue);

    if (newValue === '') {
      setError('');
      onChange(undefined);
      return;
    }

    const numValue = Number(newValue);
    if (isNaN(numValue)) {
      setError('Audience ID should be a number');
      return;
    }

    setError('');
    onChange(numValue);
  };

  return (
    <TextField
      disabled={disabled}
      value={inputValue}
      onChange={handleChange}
      error={!!error}
      helperText={error}
      type="text"
      placeholder="Enter audience ID"
    />
  );
};
