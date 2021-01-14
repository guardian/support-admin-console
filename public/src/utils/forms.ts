type Validator = (text: string) => string | boolean;

export const INVALID_CHARACTERS_ERROR_HELPER_TEXT =
  'Only letters, numbers, underscores and hyphens are allowed';

export const VALID_CHARACTERS_REGEX = /^[\w-]+$/;

export const EMPTY_ERROR_HELPER_TEXT = 'Field cannot be empty - please enter some text';

export const DUPLICATE_ERROR_HELPER_TEXT = 'Name already exists - please try another';

export const duplicateValidator = (existingNames: string[]): Validator => (
  name: string,
): string | boolean => {
  if (existingNames.some(n => n.toLowerCase() === name.toLowerCase())) {
    return DUPLICATE_ERROR_HELPER_TEXT;
  }
  return true;
};
