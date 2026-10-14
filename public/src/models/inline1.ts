import { ControlProportionSettings } from '../components/channelManagement/helpers/controlProportionSettings';
import { Status, Test, Variant } from '../components/channelManagement/helpers/shared';

export type Inline1Variant = Variant;

export interface Inline1Test extends Test {
  name: string;
  nickname?: string;
  status: Status;
  variants: Inline1Variant[];
  controlProportionSettings?: ControlProportionSettings;
}
