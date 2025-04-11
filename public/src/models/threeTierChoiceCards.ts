import {Methodology, Status, Test, Variant} from "../components/channelManagement/helpers/shared";

export interface ThreeTierBenefit {
  copy: string;
}

export interface ThreeTierDescription {
  title:  string;
  benefits: {
    subheadingCopy: string;
    benefitsCopy?: ThreeTierBenefit[];
  }
  label?: {
    copy: string;
  };
}

export interface ThreeTierChoiceCardTiers {
  lowerTier: ThreeTierDescription;
  higherTier: ThreeTierDescription;
  otherTier: ThreeTierDescription;
}

export interface ThreeTierChoiceCardVariant extends Variant {
  name: string;
  tiers: ThreeTierChoiceCardTiers;
}

export interface ThreeTierChoiceCards extends Test {
  name: string,
  nickname?: string,
  status: Status,
  variants: ThreeTierChoiceCardVariant[];
  methodologies: Methodology[];
}
