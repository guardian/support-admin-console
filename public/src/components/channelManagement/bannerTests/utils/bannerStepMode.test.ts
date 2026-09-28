import { BannerStepMode } from '../../../../models/banner';
import { getBannerStepMode } from './bannerStepMode';
import { getDefaultVariant } from './defaults';

describe('getBannerStepMode', () => {
  it('defaults new variants to two-step if allowed', () => {
    const originalWindow = Reflect.get(globalThis, 'window') as Window | undefined;
    Object.defineProperty(globalThis, 'window', {
      configurable: true,
      value: { guardian: { stage: 'CODE' } },
    });

    try {
      const defaultVariant = getDefaultVariant();
      expect(defaultVariant.bannerStepMode).toBe(BannerStepMode.TwoStepIfAllowed);
      expect(defaultVariant.isCollapsible).toBe(true);
    } finally {
      if (originalWindow) {
        Object.defineProperty(globalThis, 'window', { configurable: true, value: originalWindow });
      } else {
        Reflect.deleteProperty(globalThis, 'window');
      }
    }
  });

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
