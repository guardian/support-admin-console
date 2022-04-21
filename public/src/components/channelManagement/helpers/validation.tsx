import { TestPlatform } from './shared';

export type ValidationStatus = {
  [fieldName: string]: boolean;
};

export const INVALID_CHARACTERS_ERROR_HELPER_TEXT =
  'Only letters, numbers, underscores and hyphens are allowed';
export const VALID_CHARACTERS_REGEX = /^[\w-]+$/;

export const EMPTY_ERROR_HELPER_TEXT = 'Field cannot be empty - please enter some text';
export const MAXLENGTH_ERROR_HELPER_TEXT =
  'This copy is longer than the recommended length. Please preview across breakpoints before publishing.';

export const getEmptyParagraphsError = (pars: string[]): string | undefined => {
  if (pars.filter(p => p).join('').length <= 0) {
    return EMPTY_ERROR_HELPER_TEXT;
  }
  return undefined;
};

const NOT_NUMBER_ERROR_HELPER_TEXT = 'Must be a number';

export const notNumberValidator = (text: string): string | undefined =>
  Number.isNaN(Number(text)) ? NOT_NUMBER_ERROR_HELPER_TEXT : undefined;

export const DUPLICATE_ERROR_HELPER_TEXT = 'Name already exists - please try another';

export const createDuplicateValidator = (
  existing: string[],
  testNamePrefix?: string,
): ((text: string) => string | undefined) => {
  const existingLowerCased = existing.map(value => value.toLowerCase());
  return (text: string): string | undefined => {
    if (existingLowerCased.includes(`${testNamePrefix || ''}${text}`.toLowerCase())) {
      return DUPLICATE_ERROR_HELPER_TEXT;
    }
    return undefined;
  };
};

export const CURRENCY_TEMPLATE = '%%CURRENCY_SYMBOL%%';
export const COUNTRY_NAME_TEMPLATE = '%%COUNTRY_NAME%%';
export const ARTICLE_COUNT_TEMPLATE = '%%ARTICLE_COUNT%%';

const VALID_TEMPLATES = {
  AMP: [CURRENCY_TEMPLATE, COUNTRY_NAME_TEMPLATE],
  APPLE_NEWS: [CURRENCY_TEMPLATE],
  DOTCOM: [CURRENCY_TEMPLATE, COUNTRY_NAME_TEMPLATE, ARTICLE_COUNT_TEMPLATE],
};

export const templateValidatorForPlatform = (platform: TestPlatform) => (
  text?: string,
): string | undefined => {
  if (text) {
    const templates: string[] | null = text.match(/%\S*%/g);

    if (templates !== null) {
      const invalidTemplate = templates.find(
        template => !VALID_TEMPLATES[platform].includes(template),
      );
      if (invalidTemplate) {
        return `Invalid template: ${invalidTemplate}`;
      }
    }
  }
  return undefined;
};

export const noHtmlValidator = (s: string): string | undefined =>
  /<\/?[a-z][\s\S]*>/i.test(s) ? 'HTML is not allowed' : undefined;
