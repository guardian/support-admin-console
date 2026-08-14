import { EpicTest } from '../../../../models/epic';
import { UserCohort } from '../../helpers/shared';
import { findMParticleTemplates } from './findMParticleTemplates';

const baseTest: EpicTest = {
  name: 'test',
  status: 'Live',
  locations: [],
  regionTargeting: { targetedCountryGroups: [] },
  tagIds: [],
  sections: [],
  excludedTagIds: [],
  excludedSections: [],
  alwaysAsk: false,
  userCohort: UserCohort.Everyone,
  hasCountryName: false,
  variants: [],
  highPriority: false,
  useLocalViewLog: false,
  methodologies: [],
};

describe('findMParticleTemplates', () => {
  it('returns an empty array when there are no variants', () => {
    const result = findMParticleTemplates({ ...baseTest, variants: [] });
    expect(result).toEqual([]);
  });

  it('returns an empty array when variants have no mParticle templates', () => {
    const result = findMParticleTemplates({
      ...baseTest,
      variants: [
        {
          name: 'control',
          heading: 'Hello world',
          paragraphs: ['No templates here.'],
          showTicker: false,
        },
      ],
    });
    expect(result).toEqual([]);
  });

  it('finds a template in a variant heading', () => {
    const result = findMParticleTemplates({
      ...baseTest,
      variants: [
        { name: 'control', heading: '%%mParticle_firstName%%', paragraphs: [], showTicker: false },
      ],
    });
    expect(result).toEqual(['firstName']);
  });

  it('finds a template in a variant paragraph', () => {
    const result = findMParticleTemplates({
      ...baseTest,
      variants: [{ name: 'control', paragraphs: ['Hello %%mParticle_city%%!'], showTicker: false }],
    });
    expect(result).toEqual(['city']);
  });

  it('finds multiple distinct templates across heading and paragraphs', () => {
    const result = findMParticleTemplates({
      ...baseTest,
      variants: [
        {
          name: 'control',
          heading: '%%mParticle_firstName%%',
          paragraphs: ['You live in %%mParticle_city%%.', 'Your tier is %%mParticle_tier%%.'],
          showTicker: false,
        },
      ],
    });
    expect(result).toEqual(['firstName', 'city', 'tier']);
  });

  it('deduplicates templates that appear more than once', () => {
    const result = findMParticleTemplates({
      ...baseTest,
      variants: [
        {
          name: 'control',
          heading: '%%mParticle_firstName%%',
          paragraphs: ['Hi %%mParticle_firstName%%, welcome to %%mParticle_city%%.'],
          showTicker: false,
        },
      ],
    });
    expect(result).toEqual(['firstName', 'city']);
  });

  it('collects templates across multiple variants', () => {
    const result = findMParticleTemplates({
      ...baseTest,
      variants: [
        { name: 'control', paragraphs: ['%%mParticle_firstName%%'], showTicker: false },
        { name: 'variant', paragraphs: ['%%mParticle_city%%'], showTicker: false },
      ],
    });
    expect(result).toEqual(['firstName', 'city']);
  });

  it('does not match patterns that are not mParticle templates', () => {
    const result = findMParticleTemplates({
      ...baseTest,
      variants: [
        { name: 'control', paragraphs: ['%%ARTICLE_COUNT%% articles'], showTicker: false },
      ],
    });
    expect(result).toEqual([]);
  });

  it('handles a variant with no heading', () => {
    const result = findMParticleTemplates({
      ...baseTest,
      variants: [{ name: 'control', paragraphs: ['%%mParticle_country%%'], showTicker: false }],
    });
    expect(result).toEqual(['country']);
  });
});
