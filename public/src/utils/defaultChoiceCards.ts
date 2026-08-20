import { ChoiceCard, ChoiceCardsSettings } from '../models/choiceCards';
import {
  ChoiceCardsDefaultsRegion,
  DefaultChoiceCardsSettings,
} from '../models/defaultChoiceCards';
import { regionIds, regions } from './models';

export type ChannelKey = 'epic' | 'banner';
export type FormData = ChoiceCardsSettings & { hasOneDefault: boolean };

export const REGION_ORDER: ChoiceCardsDefaultsRegion[] = ['Default', ...regionIds];
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
  settings?: Partial<Record<ChoiceCardsDefaultsRegion, ChoiceCardsSettings>>,
): Record<ChoiceCardsDefaultsRegion, ChoiceCardsSettings> =>
  REGION_ORDER.reduce(
    (acc, region) => ({
      ...acc,
      [region]: settings?.[region] ?? EMPTY_SETTINGS,
    }),
    {} as Record<ChoiceCardsDefaultsRegion, ChoiceCardsSettings>,
  );

export const normalizeSettings = (
  data: DefaultChoiceCardsSettings,
): DefaultChoiceCardsSettings => ({
  epic: buildDefaultData(data.epic),
  banner: buildDefaultData(data.banner),
  lastEditedBy: data.lastEditedBy ?? '',
});

export const buildLabel = (region: ChoiceCardsDefaultsRegion): string =>
  region === 'Default' ? 'Default fallback' : regions[region];
