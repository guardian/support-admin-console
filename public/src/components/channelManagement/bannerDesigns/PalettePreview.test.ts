import { getChoiceCardPreviewStyle } from './PalettePreview';
import type { PreviewColours } from './PalettePreview';

const colours: NonNullable<PreviewColours['choiceCards']> = {
  buttonColour: '#FFFFFF',
  buttonOpacity: 0.8,
  buttonTextColour: '#000000',
  buttonBorderColour: '#121212',
  buttonSelectColour: '#FFFFFF',
  buttonSelectOpacity: 0.95,
  buttonSelectTextColour: '#606060',
  buttonSelectBorderColour: '#121212',
  buttonSelectMarkerColour: '#121212',
  pillBackgroundColour: '#0077B6',
  pillTextColour: '#FFFFFF',
};

describe('getChoiceCardPreviewStyle', () => {
  it('returns selected fill, text, and 2px stroke', () => {
    expect(getChoiceCardPreviewStyle(colours, true)).toMatchObject({
      '--choice-card-background': 'rgba(255, 255, 255, 0.95)',
      border: '2px solid #121212',
      color: '#606060',
    });
  });

  it('returns unselected fill, text, 1px stroke, and 95% hover fill', () => {
    expect(getChoiceCardPreviewStyle(colours, false)).toMatchObject({
      '--choice-card-background': 'rgba(255, 255, 255, 0.8)',
      '--choice-card-hover-background': 'rgba(255, 255, 255, 0.95)',
      border: '1px solid #121212',
      color: '#000000',
    });
  });

  it('keeps legacy preview fills opaque and omits hover when opacity is missing', () => {
    const legacyColours = {
      ...colours,
      buttonOpacity: undefined,
      buttonSelectOpacity: undefined,
    };

    expect(getChoiceCardPreviewStyle(legacyColours, false)).toMatchObject({
      '--choice-card-background': '#FFFFFF',
      border: '1px solid #121212',
    });
    expect(getChoiceCardPreviewStyle(legacyColours, false)).not.toHaveProperty(
      '--choice-card-hover-background',
    );
  });
});
