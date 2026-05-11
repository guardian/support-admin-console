import { useEffect, useState } from 'react';

const useValidatableField = (
  defaultHelperText: string,
  getError: (value: string) => string | null,
): [string, (value: string) => void, boolean, string, () => boolean] => {
  const [value, setValue] = useState('');
  const [hasError, setHasError] = useState(false);
  const [helperText, setHelperText] = useState(defaultHelperText);

  useEffect(() => {
    requestAnimationFrame(() => {
      setHelperText(defaultHelperText);
      setHasError(false);
    });
  }, [value, defaultHelperText]);

  const check = (): boolean => {
    let isValid = true;
    const error = getError(value);
    if (error) {
      setHelperText(error);
      setHasError(true);

      isValid = false;
    }
    return isValid;
  };

  return [value, setValue, hasError, helperText, check];
};

export default useValidatableField;
