import React from 'react';
import { TestPlatform } from './shared';

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
  onValidationChange: (isValid: boolean) => void;
}

export type ValidationStatus = {
  [fieldName: string]: boolean;
};

export const INVALID_CHARACTERS_ERROR_HELPER_TEXT =
  'Only letters, numbers, underscores and hyphens are allowed';
const INVALID_CHARACTERS_REGEX = /[^\w-]/;
export const VALID_CHARACTERS_REGEX = /^[\w-]+$/;

export const getInvalidCharactersError = (text: string): string | null => {
  if (INVALID_CHARACTERS_REGEX.test(text)) {
    return INVALID_CHARACTERS_ERROR_HELPER_TEXT;
  }
  return null;
};

export const EMPTY_ERROR_HELPER_TEXT = 'Field cannot be empty - please enter some text';

export const getEmptyError = (text: string): string | null => {
  if (text.trim() === '') {
    return EMPTY_ERROR_HELPER_TEXT;
  }
  return null;
};

const NOT_NUMBER_ERROR_HELPER_TEXT = 'Must be a number';

export const getNotNumberError = (text: string): string | null =>
  Number.isNaN(Number(text)) ? NOT_NUMBER_ERROR_HELPER_TEXT : null;

export const notNumberValidator = (text: string): string | boolean =>
  Number.isNaN(Number(text)) ? NOT_NUMBER_ERROR_HELPER_TEXT : true;

export const DUPLICATE_ERROR_HELPER_TEXT = 'Name already exists - please try another';

export const createGetDuplicateError = (existing: string[]): ((text: string) => string | null) => {
  const existingLowerCased = existing.map(value => value.toLowerCase());
  const getDuplicateError = (text: string): string | null => {
    if (existingLowerCased.includes(text.toLowerCase())) {
      return DUPLICATE_ERROR_HELPER_TEXT;
    }
    return null;
  };
  return getDuplicateError;
};

export const createDuplicateValidator = (
  existing: string[],
  testNamePrefix?: string,
): ((text: string) => string | boolean) => {
  const existingLowerCased = existing.map(value => value.toLowerCase());
  const duplicateValidator = (text: string): string | boolean => {
    if (existingLowerCased.includes(`${testNamePrefix || ''}${text}`.toLowerCase())) {
      return DUPLICATE_ERROR_HELPER_TEXT;
    }
    return true;
  };
  return duplicateValidator;
};

export const CURRENCY_TEMPLATE = '%%CURRENCY_SYMBOL%%';
export const COUNTRY_NAME_TEMPLATE = '%%COUNTRY_NAME%%';
export const ARTICLE_COUNT_TEMPLATE = '%%ARTICLE_COUNT%%';

const VALID_TEMPLATES = {
  AMP: [CURRENCY_TEMPLATE, COUNTRY_NAME_TEMPLATE],
  APPLE_NEWS: [CURRENCY_TEMPLATE],
  ARTICLE: [CURRENCY_TEMPLATE, COUNTRY_NAME_TEMPLATE, ARTICLE_COUNT_TEMPLATE],
  LIVEBLOG: [CURRENCY_TEMPLATE, COUNTRY_NAME_TEMPLATE, ARTICLE_COUNT_TEMPLATE],
};

export const templateValidatorForPlatform = (platform: TestPlatform) => (
  text: string,
): string | boolean => {
  const templates: string[] | null = text.match(/%\S*%/g);

  if (templates !== null) {
    const invalidTemplate = templates.find(
      template => !VALID_TEMPLATES[platform].includes(template),
    );
    if (invalidTemplate) {
      return `Invalid template: ${invalidTemplate}`;
    }
  }
  return true;
};

export interface ValidationComponentState {
  validationStatus: ValidationStatus;
}

// Call this when a single field in the component updates
export const onFieldValidationChange = <
  P extends ValidationComponentProps,
  S extends ValidationComponentState
>(
  component: React.Component<P, S>,
) => (fieldName: string) => (isValid: boolean): void => {
  component.setState(
    state => {
      const newValidationStatus: ValidationStatus = Object.assign({}, state.validationStatus);
      newValidationStatus[fieldName] = isValid;
      return { validationStatus: newValidationStatus };
    },
    () => {
      const hasInvalidField = Object.keys(component.state.validationStatus).some(
        name => component.state.validationStatus[name] === false,
      );

      component.props.onValidationChange(!hasInvalidField);
    },
  );
};

// const onFieldValidationChangeTemp = (setValidation, )
export const isNumber = (value: string): boolean => !Number.isNaN(Number(value));
