import { BannerStepMode } from '../../../../models/banner';
import { getBannerStepMode } from './bannerStepMode';

describe('getBannerStepMode', () => {
  it('uses an explicit mode in preference to the legacy field', () => {
    expect(getBannerStepMode(BannerStepMode.TwoStepIfAllowed, false)).toBe(
      BannerStepMode.TwoStepIfAllowed,
    );
  });

  it('maps a legacy collapsible banner to two-step only', () => {
    expect(getBannerStepMode(undefined, true)).toBe(BannerStepMode.TwoStep);
  });

  it('maps a legacy non-collapsible banner to one-step only', () => {
    expect(getBannerStepMode(undefined, false)).toBe(BannerStepMode.OneStep);
  });

  it('maps a missing legacy field to one-step only', () => {
    expect(getBannerStepMode(undefined, undefined)).toBe(BannerStepMode.OneStep);
  });
});
