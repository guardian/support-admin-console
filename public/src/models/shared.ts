export interface ResponsiveImage {
  mobileUrl: string;
  tabletUrl: string;
  desktopUrl: string;
  altText: string;
}

export interface MaxViews {
  maxViewsCount: number;
  maxViewsDays: number;
  minDaysBetweenViews: number;
}
