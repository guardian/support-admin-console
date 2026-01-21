export const parsePromoInput = (inputValue: string): string[] =>
  inputValue
    .split(',')
    .map((promo) => promo.trim())
    .filter((promo) => promo !== '');
