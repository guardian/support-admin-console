import React from 'react';

export interface ValidationComponentProps {
  onValidationChange: (isValid: boolean) => void
}

export type ValidationStatus = {
  [fieldName: string]: boolean
}

export interface ValidationComponentState {
  validationStatus: ValidationStatus
}

export class ValidationComponent<
  P extends ValidationComponentProps,
  S extends ValidationComponentState> extends React.Component<P, S> {

  reportValidationStatus = (validationStatus: ValidationStatus): void => {
    const hasInvalidField = Object.keys(validationStatus)
      .some(name => validationStatus[name] === false);

    this.props.onValidationChange(!hasInvalidField);
  };

  onFieldValidationChange = (fieldName: string) => (valid: boolean): void => {
    const newValidationStatus = {
      ...this.state.validationStatus,
      [fieldName]: valid
    };

    this.reportValidationStatus(newValidationStatus);

    this.setState({
      validationStatus: newValidationStatus
    });
  };
}
