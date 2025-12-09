import { getPromoPreviewUrl } from './previewUrl';
import { getStage } from '../../../utils/stage';

jest.mock('../../../utils/stage');

describe('getPromoPreviewUrl', () => {
  it('should return correct URL for PROD stage', () => {
    (getStage as jest.Mock).mockReturnValue('PROD');
    expect(getPromoPreviewUrl('TEST_PROMO', 'DigitalPack', 'DigitalPackMonthly')).toBe(
      'https://support.theguardian.com/uk/checkout?promoCode=TEST_PROMO&product=DigitalPack&ratePlan=DigitalPackMonthly',
    );
  });

  it('should return correct URL for CODE stage', () => {
    (getStage as jest.Mock).mockReturnValue('CODE');
    expect(getPromoPreviewUrl('TEST_PROMO', 'DigitalPack', 'DigitalPackMonthly')).toBe(
      'https://support.code.dev-theguardian.com/uk/checkout?promoCode=TEST_PROMO&product=DigitalPack&ratePlan=DigitalPackMonthly',
    );
  });
});
