import { Region } from '../utils/models';
import { ChoiceCardsSettings } from './choiceCards';

export type ChoiceCardsDefaultsRegion = Region | 'Default';

export interface DefaultChoiceCardsSettings {
  epic: Partial<Record<ChoiceCardsDefaultsRegion, ChoiceCardsSettings>>;
  banner: Partial<Record<ChoiceCardsDefaultsRegion, ChoiceCardsSettings>>;
  lastEditedBy?: string;
}

export interface DefaultChoiceCardsVersionHistoryItem {
  version: string;
  lastModified: string;
  isLatest: boolean;
  lastEditedBy?: string;
}

export interface VersionedDefaultChoiceCardsSettings {
  value: DefaultChoiceCardsSettings;
  version: string;
}
