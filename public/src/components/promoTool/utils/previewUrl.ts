import { getStage } from '../../../utils/stage';

export const getPromoPreviewUrl = (
  promoCode: string,
  product: string,
  ratePlan: string,
): string => {
  const stage = getStage();
  const domain = stage === 'PROD' ? 'support.theguardian.com' : 'support.code.dev-theguardian.com';

  return `https://${domain}/uk/checkout?promoCode=${promoCode}&product=${product}&ratePlan=${ratePlan}`;
};
