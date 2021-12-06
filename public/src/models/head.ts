import {
  ArticlesViewedSettings,
  Cta,
  Test,
  Variant,
  UserCohort,
  SecondaryCta,
} from '../components/channelManagement/helpers/shared';
import { Region } from '../utils/models';
import { ControlProportionSettings } from '../components/channelManagement/helpers/controlProportionSettings';

export enum HeadTemplate {
  ContributionsHead = 'ContributionsHead',
  ContributionsHeadWithSignIn = 'ContributionsHeadWithSignIn',
  DigitalSubscriptionsHead = 'DigitalSubscriptionsHead',
  GuardianWeeklyHead = 'GuardianWeeklyHead',
  InvestigationsMomentHead = 'InvestigationsMomentHead',
  EnvironmentMomentHead = 'EnvironmentMomentHead',
  UsEoyMomentHead = 'UsEoyMomentHead',
  UsEoyMomentGivingTuesdayHead = 'UsEoyMomentGivingTuesdayHead',
}

export interface HeadContent {
  heading?: string;
  messageText: string;
  highlightedText?: string;
  cta?: Cta;
  secondaryCta?: SecondaryCta;
}
export interface HeadVariant extends Variant {
  template: HeadTemplate;
  headContent: HeadContent;
  mobileHeadContent?: HeadContent;

  // Deprecated - use headContent / mobileHeadContent
  heading?: string;
  body?: string;
  highlightedText?: string;
  cta?: Cta;
  secondaryCta?: Cta;
}

export interface HeadTest extends Test {
  name: string;
  nickname?: string;
  isOn: boolean;
  minArticlesBeforeShowingHead: number;
  userCohort: UserCohort;
  locations: Region[];
  variants: HeadVariant[];
  articlesViewedSettings?: ArticlesViewedSettings;
  controlProportionSettings?: ControlProportionSettings;
}
