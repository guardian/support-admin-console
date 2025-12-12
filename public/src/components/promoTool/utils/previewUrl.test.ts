import { getPromoPreviewUrl } from './previewUrl';
import { getStage } from '../../../utils/stage';

jest.mock('../../../utils/stage');

describe('getPromoPreviewUrl', () => {
  it('should return correct URL for PROD stage', () => {
    (getStage as jest.Mock).mockReturnValue('PROD');
    expect(getPromoPreviewUrl('TEST_PROMO')).toBe(
      'https://support.theguardian.com/p/TEST_PROMO/terms',
    );
  });

  it('should return correct URL for CODE stage', () => {
    (getStage as jest.Mock).mockReturnValue('CODE');
    expect(getPromoPreviewUrl('TEST_PROMO')).toBe(
      'https://support.code.dev-theguardian.com/p/TEST_PROMO/terms',
    );
  });
});
