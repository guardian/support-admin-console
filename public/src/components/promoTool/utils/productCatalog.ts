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

export function billingPeriodToMonths(billingPeriod: string): number {
  switch (billingPeriod) {
    case 'Month':
    case 'OneTime':
      return 1;
    case 'Quarter':
      return 3;
    case 'Annual':
      return 12;
    default:
      console.warn(`Unknown billing period: ${billingPeriod}, defaulting to 1 month`);
      return 1;
  }
}

export function calculateProportionalDiscount(
  discountPercentage: number,
  discountDurationMonths: number,
  ratePlanTermMonths: number,
): number {
  // If discount duration is not specified or term length is invalid, apply full discount
  if (!discountDurationMonths || !ratePlanTermMonths || ratePlanTermMonths <= 0) {
    return discountPercentage;
  }

  // Calculate the ratio of discount period to billing period
  const periodRatio = discountDurationMonths / ratePlanTermMonths;

  // Number of billing periods covered by the discount
  const numberOfNewPeriods = Math.ceil(periodRatio);

  // Avoid division by zero
  if (numberOfNewPeriods === 0) {
    return discountPercentage;
  }

  // Proportional discount percentage
  const proportionalDiscount = (discountPercentage * periodRatio) / numberOfNewPeriods;

  return proportionalDiscount;
}

export function calculateDiscountedPrice(
  originalPrice: number,
  discountPercentage: number,
): number {
  return Number((originalPrice * (1 - discountPercentage / 100)).toFixed(2));
}

export function applyDiscountToPricing(
  pricing: Pricing,
  discountPercentage: number,
  discountDurationMonths: number | undefined,
  billingPeriod: string,
): Pricing {
  const ratePlanTermMonths = billingPeriodToMonths(billingPeriod);

  // Calculate proportional discount based on term length
  const effectiveDiscount = discountDurationMonths
    ? calculateProportionalDiscount(discountPercentage, discountDurationMonths, ratePlanTermMonths)
    : discountPercentage;

  const discountedPricing: Pricing = {};
  Object.entries(pricing).forEach(([currency, price]) => {
    discountedPricing[currency] = calculateDiscountedPrice(price, effectiveDiscount);
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
  return Object.entries(product.ratePlans).map(([ratePlanName, ratePlan]) => {
    return {
      ...ratePlan,
      productName,
      productDisplayName: product.customerFacingName,
      ratePlanName,
    };
  });
}

export function getProductByType(
  catalog: ProductCatalog,
  productType: string,
): Product | undefined {
  return catalog[productType];
}

export const sortByCustomOrder = (a: string, b: string, customOrder: string[]): number => {
  const aIndex = customOrder.indexOf(a);
  const bIndex = customOrder.indexOf(b);

  if (aIndex !== -1 && bIndex !== -1) {
    return aIndex - bIndex;
  }
  if (aIndex !== -1) {
    return -1;
  }
  if (bIndex !== -1) {
    return 1;
  }

  return 0;
};

export const orderRatePlans =
  (product: string) =>
  (a: RatePlanWithProduct, b: RatePlanWithProduct): number => {
    const customOrders: Partial<Record<string, string[]>> = {
      Newspaper: ['SixdayPlus', 'SaturdayPlus', 'EverydayPlus', 'WeekendPlus', 'Sunday'],
      Weekly: ['Monthly', 'Quarterly', 'Annual', 'OneYearGift', 'ThreeMonthGift'],
    };

    const customOrder = customOrders[product];

    if (customOrder) {
      const productNameComparison = a.productName.localeCompare(b.productName);
      if (productNameComparison !== 0) {
        return productNameComparison;
      }
      return sortByCustomOrder(a.ratePlanName, b.ratePlanName, customOrder);
    }
    return 0;
  };
