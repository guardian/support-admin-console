import { convertStringToHexColour } from './bannerDesigns';

describe('convertStringToHexColour', () => {
  it('returns a HexColour object for a valid hex colour string', () => {
    const hexColourString = 'FF00EF';

    const result = convertStringToHexColour(hexColourString);

    expect(result).toEqual({
      r: 'FF',
      g: '00',
      b: 'EF',
      kind: 'hex',
    });
  });

  it('throws an error for an invalid hex colour string', () => {
    const hexColourString = 'xxx';

    expect(() => convertStringToHexColour(hexColourString)).toThrow('Invalid hex colour string!');
  });
});
