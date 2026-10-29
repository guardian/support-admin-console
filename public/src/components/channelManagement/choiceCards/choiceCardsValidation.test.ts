import { getChoiceCardsValidationError } from './choiceCardsValidation';

describe('getChoiceCardsValidationError', () => {
  it('allows custom choice cards with no default', () => {
    expect(getChoiceCardsValidationError(2, 0)).toBeUndefined();
  });

  it('allows one custom choice card default', () => {
    expect(getChoiceCardsValidationError(2, 1)).toBeUndefined();
  });

  it('rejects multiple custom choice card defaults with the existing error', () => {
    expect(getChoiceCardsValidationError(2, 2)).toBe('Only one card can be set as the default');
  });

  it('rejects an empty custom choice card configuration', () => {
    expect(getChoiceCardsValidationError(0, 0)).toBe('At least one choice card must be configured');
  });
});
