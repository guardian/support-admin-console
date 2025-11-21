import { Methodology, Status, Test, Variant } from '../components/channelManagement/helpers/shared';

export interface Product {
  product: string;
  ratePlan?: string;
}

export interface Copy {
  heading: string;
  body?: string;
}

export interface Benefits {
  label: string;
}

export interface CheckoutNudge {
  nudgeCopy: Copy;
  thankyouCopy: Copy;
  benefits?: Benefits;
  nudgeToProduct: Product;
}

export interface CheckoutNudgeVariant extends Variant {
  name: string;
  nudge?: CheckoutNudge;
}

export interface CheckoutNudgeTest extends Test {
  name: string;
  nickname?: string;
  status: Status;
  nudgeFromProduct: Product;
  variants: CheckoutNudgeVariant[];
  methodologies: Methodology[];
}
