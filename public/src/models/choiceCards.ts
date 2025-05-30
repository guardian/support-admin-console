export interface ProductBenefit {
  copy: string;
}

export type Product =
  | {
      supportTier: 'Contribution' | 'SupporterPlus';
      ratePlan: 'Monthly' | 'Annual';
    }
  | {
      supportTier: 'OneOff';
    };

export interface ChoiceCard {
  product: Product;
  label: string;
  benefitsLabel?: string; // e.g. "Unlock All-access digital benefits:"
  benefits: ProductBenefit[];
  pill?: {
    copy: string; // e.g. "Recommended", will be overridden if a promo applies
  } | null;
  isDefault: boolean;
}

export interface ChoiceCardsSettings {
  choiceCards: ChoiceCard[];
}
