import { getStage } from '../../../utils/stage';
import { getPreviewUrl } from './variantSummaryWebPreviewButton';

jest.mock('../../../utils/stage');

describe('getPreviewUrl', () => {
  it.each([
    ['PROD', 'theguardian.com'],
    ['CODE', 'm.code.dev-theguardian.com'],
    ['DEV', 'm.code.dev-theguardian.com'],
  ])('uses the Inline1 article preview in %s', (stage, host) => {
    (getStage as jest.Mock).mockReturnValue(stage);

    expect(getPreviewUrl('TEST', 'VARIANT', 'INLINE1', 'Standard')).toBe(
      `https://${host}/business/2026/oct/30/poundland-peril-rampant-inflation-price-wars?simulate-inline1=true&preview-inline1=TEST:VARIANT&ab-commercial-next-best-action=enable`,
    );
  });

  it('preserves the gutter liveblog article preview', () => {
    (getStage as jest.Mock).mockReturnValue('CODE');

    expect(getPreviewUrl('TEST', 'VARIANT', 'GUTTER', 'Liveblog')).toBe(
      'https://m.code.dev-theguardian.com/world/live/2022/oct/07/nobel-peace-prize-2022-live-winners?preview-gutter-liveblog=TEST:VARIANT',
    );
  });
});
