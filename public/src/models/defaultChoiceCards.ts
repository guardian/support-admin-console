import { Region } from '../utils/models';
import { ChoiceCardsSettings } from './choiceCards';

export type ChoiceCardsDefaultsProfile = Region | 'Default';

export interface DefaultChoiceCardsSettings {
  epic: Partial<Record<ChoiceCardsDefaultsProfile, ChoiceCardsSettings>>;
  banner: Partial<Record<ChoiceCardsDefaultsProfile, ChoiceCardsSettings>>;
  lastEditedBy?: string;
}
