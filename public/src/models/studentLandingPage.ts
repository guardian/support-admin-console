import { Status, Test, Variant } from '../components/channelManagement/helpers/shared';
import { ResponsiveImage } from './shared';

export interface StudentLandingPageTest extends Test {
  name: string;
  nickname?: string;
  status: Status;
  country: string;
  variants: StudentLandingPageVariant[];
}

export interface Institution {
  acronym: string;
  name: string;
  logoUrl: string;
}
export interface StudentLandingPageVariant extends Variant {
  heading: string;
  subheading: string;
  institution: Institution;
  promoCodes: string[];
  image: ResponsiveImage;
}
