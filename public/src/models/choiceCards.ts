export interface ProductBenefit {
  copy: string;
}

export type Product =
  | {
      supportTier: 'Contribution' | 'SupporterPlus' | 'DigitalSubscription';
      ratePlan: 'Monthly' | 'Annual';
    }
  | {
      supportTier: 'OneOff';
    };

type Destination = 'LandingPage' | 'Checkout';

export interface ChoiceCard {
  product: Product;
  label: string;
  benefitsLabel?: string; // e.g. "Unlock All-access digital benefits:"
  benefits: ProductBenefit[];
  pill?: {
    copy: string; // e.g. "Recommended", will be overridden if a promo applies
  };
  isDefault: boolean;
  destination?: Destination;
}

export interface ChoiceCardsSettings {
  choiceCards: ChoiceCard[];
}
