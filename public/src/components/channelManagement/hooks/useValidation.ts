import { useState, useEffect } from "react";
import { ValidationStatus } from "../helpers/validation";

const allValid = (validationStatus: ValidationStatus) => {
  return Object.values(validationStatus).every((status) => status);
};

const useValidation = (onValidationChanged: (isValid: boolean) => void) => {
  const [validationStatus, setValidationStatus] = useState<ValidationStatus>(
    {}
  );

  const [wasValid, setWasValid] = useState(true);

  useEffect(() => {
    const isValid = allValid(validationStatus);
    if (isValid !== wasValid) {
      setWasValid(isValid);
      onValidationChanged(allValid(validationStatus));
    }
  }, [validationStatus]);

  const setValidationStatusForField = (field: string, isValid: boolean) => {
    setValidationStatus({ ...validationStatus, [field]: isValid });
  };

  return setValidationStatusForField;
};

export default useValidation;
