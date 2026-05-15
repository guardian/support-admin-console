import { useCallback, useEffect, useRef, useState } from 'react';
import { ValidationStatus } from '../helpers/validation';

const allValid = (validationStatus: ValidationStatus): boolean => {
  return Object.values(validationStatus).every((status) => status);
};

type FieldValidationChange = (fieldName: string, isValid: boolean) => void;

const useValidation = (onValidationChanged: (isValid: boolean) => void): FieldValidationChange => {
  const [validationStatus, setValidationStatus] = useState<ValidationStatus>({});

  const onValidationChangedRef = useRef(onValidationChanged);
  const wasValidRef = useRef(true);

  useEffect(() => {
    onValidationChangedRef.current = onValidationChanged;
  });

  useEffect(() => {
    const isValid = allValid(validationStatus);
    if (isValid !== wasValidRef.current) {
      wasValidRef.current = isValid;
      onValidationChangedRef.current(isValid);
    }
  }, [validationStatus]);

  const setValidationStatusForField = useCallback((field: string, isValid: boolean): void => {
    setValidationStatus((current) => {
      if (current[field] === isValid) {
        return current;
      }
      return { ...current, [field]: isValid };
    });
  }, []);

  return setValidationStatusForField;
};

export default useValidation;
