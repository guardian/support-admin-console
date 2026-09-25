import { BannerStepMode } from '../../../../models/banner';

export const getBannerStepMode = (
  bannerStepMode: BannerStepMode | undefined,
  isCollapsible: boolean | undefined,
): BannerStepMode =>
  bannerStepMode ?? (isCollapsible ? BannerStepMode.TwoStep : BannerStepMode.OneStep);
