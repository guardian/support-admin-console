import React from 'react';

export interface ValidationComponentProps {
  // Call this when the validation status of the component as a whole changes
  onValidationChange: (isValid: boolean) => void
}

export type ValidationStatus = {
  [fieldName: string]: boolean
}

export interface ValidationComponentState {
  validationStatus: ValidationStatus
}

export class ValidationComponent extends React.Component<ValidationComponentProps, ValidationComponentState> {

  // Call this when a single field in the component updates
  onFieldValidationChange = (fieldName: string) => (valid: boolean): void => {
    this.setState((state) => {
      const newValidationStatus: ValidationStatus = Object.assign({}, state.validationStatus);
      newValidationStatus[fieldName] = valid;
      return { validationStatus: newValidationStatus }
    }, () => {
      const hasInvalidField = Object.keys(this.state.validationStatus)
        .some(name => this.state.validationStatus[name] === false);

      this.props.onValidationChange(!hasInvalidField);
    });
  };
}
