// Product Catalog API types
// Matches the structure from https://product-catalog.guardianapis.com/product-catalog.json

export interface Charge {
  id: string;
}

export interface Charges {
  [key: string]: Charge;
}

export interface Pricing {
  [currencyCode: string]: number;
}

export interface RatePlan {
  id: string;
  pricing: Pricing;
  charges: Charges;
  billingPeriod: string;
  termType: string;
  termLengthInMonths: number;
}

export interface RatePlans {
  [ratePlanName: string]: RatePlan;
}

export interface Product {
  billingSystem: string;
  active: boolean;
  customerFacingName: string;
  isDeliveryProduct: boolean;
  ratePlans: RatePlans;
}

export interface ProductCatalog {
  [productName: string]: Product;
}

export interface RatePlanWithDiscount extends RatePlan {
  ratePlanName: string;
  productName: string;
  discountedPricing?: Pricing;
}

export interface RatePlanWithProduct extends RatePlan {
  productName: string;
  productDisplayName: string;
  ratePlanName: string;
}

export function calculateDiscountedPrice(
  originalPrice: number,
  discountPercentage: number,
): number {
  return Number((originalPrice * (1 - discountPercentage / 100)).toFixed(2));
}

export function applyDiscountToPricing(pricing: Pricing, discountPercentage: number): Pricing {
  const discountedPricing: Pricing = {};
  Object.entries(pricing).forEach(([currency, price]) => {
    discountedPricing[currency] = calculateDiscountedPrice(price, discountPercentage);
  });
  return discountedPricing;
}

export function filterRatePlansByBillingPeriod(
  product: Product,
  billingPeriod: 'Annual' | 'Month',
): Array<{ ratePlanName: string; ratePlan: RatePlan }> {
  return Object.entries(product.ratePlans)
    .filter(([, ratePlan]) => ratePlan.billingPeriod === billingPeriod)
    .map(([ratePlanName, ratePlan]) => ({ ratePlanName, ratePlan }));
}

export function getAllRatePlansWithProduct(
  product: Product,
  productName: string,
): RatePlanWithProduct[] {
  return Object.entries(product.ratePlans).map(([ratePlanName, ratePlan]) => ({
    ...ratePlan,
    productName,
    productDisplayName: product.customerFacingName,
    ratePlanName,
  }));
}

export function getProductByType(
  catalog: ProductCatalog,
  productType: string,
): Product | undefined {
  return catalog[productType];
}
