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
