import { getStage } from '../../../utils/stage';
import { PromoProduct } from './promoModels';

export const getPromoPreviewUrl = (promoCode: string, product?: PromoProduct | null): string => {
  const stage = getStage();
  const domain = stage === 'PROD' ? 'support.theguardian.com' : 'support.code.dev-theguardian.com';
  if (product === 'Weekly') {
    return `https://${domain}/subscribe/weekly?promoCode=${promoCode}`;
  }
  if (product === 'Newspaper') {
    return `https://${domain}/subscribe/paper?promoCode=${promoCode}`;
  }
  return `https://${domain}/us/contribute?promoCode=${promoCode}`;
};
