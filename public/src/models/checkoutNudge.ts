import { Methodology, Status, Test, Variant } from '../components/channelManagement/helpers/shared';

export type ProductType =
  | 'OneTimeContribution'
  | 'Contribution'
  | 'SupporterPlus'
  | 'DigitalSubscription';

export type RatePlan = 'OneTime' | 'Monthly' | 'Annual';

export interface Product {
  product: ProductType;
  ratePlan?: RatePlan;
}

export interface Copy {
  heading: string;
  body: string;
}

export interface ThanYouCopy {
  heading: string;
  body: string;
}

export interface Benefits {
  label: string;
}

export interface Nudge {
  nudgeToProduct: Product;
  nudgeCopy: Copy;
  thankyouCopy: ThanYouCopy;
  benefits?: Benefits;
}

export interface CheckoutNudgeVariant extends Variant {
  nudge?: Nudge;
  promoCodes?: string[];
}

export interface CheckoutNudgeTest extends Test {
  name: string;
  nickname?: string;
  status: Status;
  nudgeFromProduct: Product;
  variants: CheckoutNudgeVariant[];
  methodologies: Methodology[];
}
