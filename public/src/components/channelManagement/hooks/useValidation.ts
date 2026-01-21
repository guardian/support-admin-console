import { useState, useEffect } from 'react';
import { ValidationStatus } from '../helpers/validation';

const allValid = (validationStatus: ValidationStatus): boolean => {
  return Object.values(validationStatus).every((status) => status);
};

type FieldValidationChange = (fieldName: string, isValid: boolean) => void;

const useValidation = (onValidationChanged: (isValid: boolean) => void): FieldValidationChange => {
  const [validationStatus, setValidationStatus] = useState<ValidationStatus>({});

  const [wasValid, setWasValid] = useState(true);

  useEffect(() => {
    const isValid = allValid(validationStatus);
    if (isValid !== wasValid) {
      setWasValid(isValid);
      onValidationChanged(allValid(validationStatus));
    }
  }, [validationStatus]);

  const setValidationStatusForField = (field: string, isValid: boolean): void => {
    setValidationStatus((current) => ({ ...current, [field]: isValid }));
  };

  return setValidationStatusForField;
};

export default useValidation;
