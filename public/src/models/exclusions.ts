export interface DateRange {
  start: string; // ISO date "YYYY-MM-DD", inclusive
  end: string; // ISO date "YYYY-MM-DD", inclusive
}

export interface ExclusionRule {
  name: string;
  sectionIds?: string[];
  tagIds?: string[];
  dateRange?: DateRange;
  contentTypes?: ('Fronts' | 'Articles')[];
}

export interface ChannelExclusions {
  rules: ExclusionRule[];
}

export interface ExclusionSettings {
  epic?: ChannelExclusions;
  banner?: ChannelExclusions;
  gutterAsk?: ChannelExclusions;
  header?: ChannelExclusions;
}
