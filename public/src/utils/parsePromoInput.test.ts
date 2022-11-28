import { parsePromoInput } from './parsePromoInput';

describe('parsePromoInput', () => {
  it('returns a list of promo codes', () => {
    const promosText = 'Promo1, promo2, promo3';

    const promosList = parsePromoInput(promosText);

    expect(promosList).toEqual(['Promo1', 'promo2', 'promo3']);
  });

  it('discards an empty final item', () => {
    const promosText = 'Promo1, promo2, promo3,';

    const promosList = parsePromoInput(promosText);

    expect(promosList).toEqual(['Promo1', 'promo2', 'promo3']);
  });

  it('discards an empty item in the middle', () => {
    const promosText = 'Promo1, promo2, , promo3';

    const promosList = parsePromoInput(promosText);

    expect(promosList).toEqual(['Promo1', 'promo2', 'promo3']);
  });

  it('discards an empty item in the beginning', () => {
    const promosText = ', Promo1, promo2, promo3';

    const promosList = parsePromoInput(promosText);

    expect(promosList).toEqual(['Promo1', 'promo2', 'promo3']);
  });

  it('discards extra spaces', () => {
    const promosText = 'Promo1,   promo2,  promo3';

    const promosList = parsePromoInput(promosText);

    expect(promosList).toEqual(['Promo1', 'promo2', 'promo3']);
  });
});
