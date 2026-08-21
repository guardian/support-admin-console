import { ChoiceCard } from '../models/choiceCards';
import {
  buildLabel,
  countDefaultCards,
  normalizeSettings,
  REGION_ORDER,
  sanitizeChoiceCardsSettings,
} from './defaultChoiceCards';

const makeChoiceCard = (isDefault: boolean, pillCopy?: string): ChoiceCard => ({
  product: {
    supportTier: 'Contribution',
    ratePlan: 'Monthly',
  },
  label: '',
  benefits: [],
  isDefault,
  ...(pillCopy === undefined ? {} : { pill: { copy: pillCopy } }),
});

describe('default choice cards utils', () => {
  describe('countDefaultCards', () => {
    it('counts cards marked as default', () => {
      expect(
        countDefaultCards([makeChoiceCard(true), makeChoiceCard(false), makeChoiceCard(true)]),
      ).toBe(2);
    });

    it('returns zero when no cards are marked as default', () => {
      expect(countDefaultCards([makeChoiceCard(false)])).toBe(0);
    });
  });

  describe('sanitizeChoiceCardsSettings', () => {
    it('removes empty pill values', () => {
      const settings = {
        choiceCards: [makeChoiceCard(false, ''), makeChoiceCard(true, 'Recommended')],
      };

      expect(sanitizeChoiceCardsSettings(settings)).toEqual({
        choiceCards: [makeChoiceCard(false), makeChoiceCard(true, 'Recommended')],
      });
    });

    it('preserves the original settings object', () => {
      const settings = { choiceCards: [makeChoiceCard(true, 'Recommended')] };

      sanitizeChoiceCardsSettings(settings);

      expect(settings.choiceCards[0].pill?.copy).toBe('Recommended');
    });
  });

  describe('normalizeSettings', () => {
    it('adds empty settings for missing profiles and normalizes editor metadata', () => {
      const result = normalizeSettings({
        epic: {
          Default: { choiceCards: [makeChoiceCard(true)] },
        },
        banner: {},
      });

      expect(result.lastEditedBy).toBe('');
      expect(Object.keys(result.epic)).toEqual(REGION_ORDER);
      expect(Object.keys(result.banner)).toEqual(REGION_ORDER);
      expect(result.epic.Default?.choiceCards).toHaveLength(1);
      expect(result.banner.EURCountries?.choiceCards).toEqual([]);
    });

    it('preserves the last editor when present', () => {
      expect(
        normalizeSettings({ epic: {}, banner: {}, lastEditedBy: 'editor@example.com' })
          .lastEditedBy,
      ).toBe('editor@example.com');
    });
  });

  describe('buildLabel', () => {
    it('uses the fallback label for the Default profile', () => {
      expect(buildLabel('Default')).toBe('Default fallback');
    });

    it('uses the region label for a regional profile', () => {
      expect(buildLabel('UnitedStates')).toBe('United States');
    });
  });
});
