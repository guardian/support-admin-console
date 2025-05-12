import {
  CountDownSettings,
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
  TierThree: LandingPageProductDescription;
}

export interface SupportLandingPageVariant extends Variant {
  name: string;
  copy: SupportLandingPageCopy;
  products: Products;
  tickerSettings?: TickerSettings;
  countDownSettings?: CountDownSettings;
}

export interface SupportLandingPageTest extends Test {
  name: string;
  nickname?: string;
  status: Status;
  variants: SupportLandingPageVariant[];
  methodologies: Methodology[];
}
