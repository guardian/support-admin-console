import { Methodology, Status, Test, Variant } from '../components/channelManagement/helpers/shared';
import { AmountsCardData, ContributionType } from '../utils/models';

export interface SingleCheckoutVariant extends Variant {
  heading: string;
  subheading: string;
  amounts: {
    defaultContributionType: ContributionType;
    displayContributionType: ContributionType[];
    amountsCardData: AmountsCardData;
  };
}

export interface SingleCheckoutTest extends Test {
  name: string;
  nickname?: string;
  status: Status;
  variants: SingleCheckoutVariant[];
  methodologies: Methodology[];
}
