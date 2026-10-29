export const getChoiceCardsValidationError = (
  choiceCardCount: number,
  defaultCardCount: number,
): string | undefined => {
  if (choiceCardCount === 0) {
    return 'At least one choice card must be configured';
  }

  return defaultCardCount > 1 ? 'Only one card can be set as the default' : undefined;
};

export const getNoDefaultChoiceCardWarning = (
  choiceCardCount: number,
  defaultCardCount: number,
): string | undefined =>
  choiceCardCount > 0 && defaultCardCount === 0
    ? 'No choice card will be selected by default for users.'
    : undefined;
