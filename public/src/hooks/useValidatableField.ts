import { useState } from 'react';

const useValidatableField = (
  defaultHelperText: string,
  getError: (value: string) => string | null,
): [string, (value: string) => void, boolean, string, () => boolean] => {
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);

  const check = (): boolean => {
    const validationError = getError(value);
    setError(validationError);
    return validationError === null;
  };

  const hasError = error !== null;
  const helperText = error ?? defaultHelperText;

  return [value, setValue, hasError, helperText, check];
};

export default useValidatableField;
