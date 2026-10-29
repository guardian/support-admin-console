export const getChoiceCardsValidationError = (
  choiceCardCount: number,
  defaultCardCount: number,
): string | undefined => {
  if (choiceCardCount === 0) {
    return 'At least one choice card must be configured';
  }

  return defaultCardCount > 1 ? 'Only one card can be set as the default' : undefined;
};
