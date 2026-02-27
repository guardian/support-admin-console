import {
  CountdownSettings,
  Methodology,
  Status,
  Test,
  TickerSettings,
  Variant,
} from '../components/channelManagement/helpers/shared';

export interface SupportLandingPageCopy {
  heading: string;
  subheading: string;
}

export interface ProductBenefit {
  copy: string;
  tooltip?: string;
  label?: {
    copy: string;
  };
}

export interface LandingPageProductDescription {
  title: string;
  titlePill?: string;
  billingPeriodsCopy?: string;
  label?: {
    copy: string;
  };
  benefits: ProductBenefit[];
  cta: {
    copy: string;
  };
}

export interface Products {
  Contribution: LandingPageProductDescription;
  SupporterPlus: LandingPageProductDescription;
  DigitalSubscription: LandingPageProductDescription;
}

export interface DefaultProductSelection {
  productType: 'Contribution' | 'SupporterPlus' | 'DigitalSubscription';
  billingPeriod: 'Monthly' | 'Annual' | 'OneTime';
}

export interface SupportLandingPageVariant extends Variant {
  name: string;
  copy: SupportLandingPageCopy;
  products: Products;
  tickerSettings?: TickerSettings;
  countdownSettings?: CountdownSettings;
  defaultProductSelection?: DefaultProductSelection;
}

export interface SupportLandingPageTest extends Test {
  name: string;
  nickname?: string;
  status: Status;
  variants: SupportLandingPageVariant[];
  methodologies: Methodology[];
  mParticleAudience?: number;
}
