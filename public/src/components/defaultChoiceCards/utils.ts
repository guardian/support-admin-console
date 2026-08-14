import { ChoiceCard, ChoiceCardsSettings } from '../../models/choiceCards';
import {
  ChoiceCardsDefaultsProfile,
  DefaultChoiceCardsSettings,
} from '../../models/defaultChoiceCards';
import { regionIds, regions } from '../../utils/models';

export type ChannelKey = 'epic' | 'banner';
export type FormData = ChoiceCardsSettings & { hasOneDefault: boolean };

export const PROFILE_ORDER: ChoiceCardsDefaultsProfile[] = ['Default', ...regionIds];
const EMPTY_SETTINGS: ChoiceCardsSettings = { choiceCards: [] };

export const countDefaultCards = (choiceCards: ChoiceCard[]): number =>
  choiceCards.filter((card) => card.isDefault).length;

export const sanitizeChoiceCardsSettings = (
  updatedSettings: ChoiceCardsSettings,
): ChoiceCardsSettings => ({
  choiceCards: updatedSettings.choiceCards.map((card) => ({
    ...card,
    pill: card.pill?.copy ? card.pill : undefined,
  })),
});

const buildDefaultData = (
  settings?: Partial<Record<ChoiceCardsDefaultsProfile, ChoiceCardsSettings>>,
): Record<ChoiceCardsDefaultsProfile, ChoiceCardsSettings> =>
  PROFILE_ORDER.reduce(
    (acc, profile) => ({
      ...acc,
      [profile]: settings?.[profile] ?? EMPTY_SETTINGS,
    }),
    {} as Record<ChoiceCardsDefaultsProfile, ChoiceCardsSettings>,
  );

export const normalizeSettings = (
  data: DefaultChoiceCardsSettings,
): DefaultChoiceCardsSettings => ({
  epic: buildDefaultData(data.epic),
  banner: buildDefaultData(data.banner),
});

export const buildLabel = (profile: ChoiceCardsDefaultsProfile): string =>
  profile === 'Default' ? 'Default fallback' : regions[profile];
