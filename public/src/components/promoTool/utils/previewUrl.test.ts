import { getPromoPreviewUrl } from './previewUrl';
import { getStage } from '../../../utils/stage';

jest.mock('../../../utils/stage');

describe('getPromoPreviewUrl', () => {
  it('should return correct URL for PROD stage with default product', () => {
    (getStage as jest.Mock).mockReturnValue('PROD');
    expect(getPromoPreviewUrl('TEST_PROMO')).toBe(
      'https://support.theguardian.com/us/contribute?promoCode=TEST_PROMO',
    );
  });

  it('should return correct URL for CODE stage with default product', () => {
    (getStage as jest.Mock).mockReturnValue('CODE');
    expect(getPromoPreviewUrl('TEST_PROMO')).toBe(
      'https://support.code.dev-theguardian.com/us/contribute?promoCode=TEST_PROMO',
    );
  });

  it('should return correct URL for Weekly product in PROD', () => {
    (getStage as jest.Mock).mockReturnValue('PROD');
    expect(getPromoPreviewUrl('TEST_PROMO', 'Weekly')).toBe(
      'https://support.theguardian.com/subscribe/weekly?promoCode=TEST_PROMO',
    );
  });

  it('should return correct URL for Weekly product in CODE', () => {
    (getStage as jest.Mock).mockReturnValue('CODE');
    expect(getPromoPreviewUrl('TEST_PROMO', 'Weekly')).toBe(
      'https://support.code.dev-theguardian.com/subscribe/weekly?promoCode=TEST_PROMO',
    );
  });

  it('should return correct URL for Newspaper product in PROD', () => {
    (getStage as jest.Mock).mockReturnValue('PROD');
    expect(getPromoPreviewUrl('TEST_PROMO', 'Newspaper')).toBe(
      'https://support.theguardian.com/subscribe/paper?promoCode=TEST_PROMO',
    );
  });

  it('should return correct URL for Newspaper product in CODE', () => {
    (getStage as jest.Mock).mockReturnValue('CODE');
    expect(getPromoPreviewUrl('TEST_PROMO', 'Newspaper')).toBe(
      'https://support.code.dev-theguardian.com/subscribe/paper?promoCode=TEST_PROMO',
    );
  });

  it('should return default URL for null product', () => {
    (getStage as jest.Mock).mockReturnValue('PROD');
    expect(getPromoPreviewUrl('TEST_PROMO', null)).toBe(
      'https://support.theguardian.com/us/contribute?promoCode=TEST_PROMO',
    );
  });

  it('should return default URL for other product types', () => {
    (getStage as jest.Mock).mockReturnValue('PROD');
    expect(getPromoPreviewUrl('TEST_PROMO', 'SupporterPlus')).toBe(
      'https://support.theguardian.com/us/contribute?promoCode=TEST_PROMO',
    );
  });
});
