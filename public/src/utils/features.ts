import { getStage } from './stage';

export const shouldShowBannerDesignsFeature = (): boolean => {
  const stage = getStage();
  return stage !== 'PROD' && stage !== 'CODE';
};
