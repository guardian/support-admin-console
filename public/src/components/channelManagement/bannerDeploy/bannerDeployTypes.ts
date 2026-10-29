export type BannerChannel = 'CHANNEL1' | 'CHANNEL2';

export interface BannerDeployRegion {
  timestamp: number;
  email: string;
}

export interface BannerDeploys {
  Australia: BannerDeployRegion;
  EuropeanUnion: BannerDeployRegion;
  RestOfWorld: BannerDeployRegion;
  UnitedStates: BannerDeployRegion;
  UnitedKingdom: BannerDeployRegion;
}

export type BannerDeployRegionName = keyof BannerDeploys;

export const bannerDeployRegionNames: BannerDeployRegionName[] = [
  'Australia',
  'EuropeanUnion',
  'RestOfWorld',
  'UnitedKingdom',
  'UnitedStates',
];

export interface BannersToRedeploy {
  Australia: boolean;
  EuropeanUnion: boolean;
  RestOfWorld: boolean;
  UnitedStates: boolean;
  UnitedKingdom: boolean;
}

export interface DataFromServer {
  value: BannerDeploys;
  version: string;
  email: string;
}

export interface VariantBannerDeploySchedule {
  daysOfWeek: number[];
  lastManualRedeployTimestamp?: number;
  manualRedeploysByRegion?: Partial<Record<BannerDeployRegionName, BannerDeployRegion>>;
}

export interface VariantBannerDeployScheduleFromServer {
  value: VariantBannerDeploySchedule;
  version: string;
  email: string;
}
