import {
  getChoiceCardsValidationError,
  getNoDefaultChoiceCardWarning,
  reportChoiceCardsValidation,
} from './choiceCardsValidation';

describe('getChoiceCardsValidationError', () => {
  it('allows custom choice cards with no default', () => {
    expect(getChoiceCardsValidationError(2, 0)).toBeUndefined();
  });

  it('reports a no-default configuration as valid to its parent', () => {
    const onValidationChange = jest.fn();

    expect(reportChoiceCardsValidation(2, 0, onValidationChange)).toBeUndefined();
    expect(onValidationChange).toHaveBeenCalledWith(true);
  });

  it('allows one custom choice card default', () => {
    expect(getChoiceCardsValidationError(2, 1)).toBeUndefined();
  });

  it('reports a one-default configuration as valid to its parent', () => {
    const onValidationChange = jest.fn();

    expect(reportChoiceCardsValidation(2, 1, onValidationChange)).toBeUndefined();
    expect(onValidationChange).toHaveBeenCalledWith(true);
  });

  it('rejects multiple custom choice card defaults with the existing error', () => {
    expect(getChoiceCardsValidationError(2, 2)).toBe('Only one card can be set as the default');
  });

  it('rejects an empty custom choice card configuration', () => {
    expect(getChoiceCardsValidationError(0, 0)).toBe('At least one choice card must be configured');
  });

  it('warns when custom choice cards have no default', () => {
    expect(getNoDefaultChoiceCardWarning(2, 0)).toBe(
      'No choice card will be selected by default for users.',
    );
  });

  it('does not warn for an empty or defaulted choice card configuration', () => {
    expect(getNoDefaultChoiceCardWarning(0, 0)).toBeUndefined();
    expect(getNoDefaultChoiceCardWarning(2, 1)).toBeUndefined();
  });
});
