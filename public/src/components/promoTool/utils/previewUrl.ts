import { getStage } from '../../../utils/stage';

export const getPromoPreviewUrl = (promoCode: string): string => {
  const stage = getStage();
  const domain = stage === 'PROD' ? 'support.theguardian.com' : 'support.code.dev-theguardian.com';

  return `https://${domain}/p/${promoCode}/terms`;
};
