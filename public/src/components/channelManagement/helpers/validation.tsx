import React from "react";

/**
 * Helper for tracking validation of multiple child components.
 * Calls onValidationChange with 'true' only when all child components are valid.
 *
 * E.g.
 *
 * type Props = ValidationComponentProps & {}
 * type State = ValidationComponentState & {}
 *
 * class MyComponent extends React.Component<Props,State> {
 *   state: State = {
 *     validationStatus: {}
 *   };
 *
 *   <Input
 *     label="email"
 *     onChange={value => {
 *       const isValid = value !== '';
 *       onFieldValidationChange(this)('email')(isValid)
*      }}
 *   />
 * }
 *
 */

export interface ValidationComponentProps {
  onValidationChange: (isValid: boolean) => void
}

export type ValidationStatus = {
  [fieldName: string]: boolean
}

export interface ValidationComponentState {
  validationStatus: ValidationStatus
}

// Call this when a single field in the component updates
export const onFieldValidationChange = <
  P extends ValidationComponentProps,
  S extends ValidationComponentState
>(component: React.Component<P,S>) => (fieldName: string) => (isValid: boolean): void => {

  component.setState((state) => {
    const newValidationStatus: ValidationStatus = Object.assign({}, state.validationStatus);
    newValidationStatus[fieldName] = isValid;
    return { validationStatus: newValidationStatus }
  }, () => {
    const hasInvalidField = Object.keys(component.state.validationStatus)
      .some(name => component.state.validationStatus[name] === false);

    component.props.onValidationChange(!hasInvalidField);
  });
};

export const isNumber = (value: string): boolean => !Number.isNaN(Number(value));
