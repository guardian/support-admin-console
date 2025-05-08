export interface ProductBenefit {
  copy: string;
}

export type Product = {
  supportTier: 'Contribution' | 'SupporterPlus';
  ratePlan: 'Monthly' | 'Annual';
} | {
  supportTier: 'OneOff';
};

export interface ChoiceCard {
  product: Product;
  benefitsLabel?: string;   // e.g. "Unlock All-access digital benefits:"
  benefits: ProductBenefit[];
  pill?: {
    copy: string; // e.g. "Recommended", will be overridden if a promo applies
  };
  isDefault: boolean;
}

export type ChoiceCardsSettings =
  { type: 'NoChoiceCards' } |
  { type: 'DefaultChoiceCards' } |
  {
    type: 'CustomChoiceCards';
    choiceCardsOverride: ChoiceCard[];
    mobleChoiceCardsOverride?: ChoiceCard[];
  }
