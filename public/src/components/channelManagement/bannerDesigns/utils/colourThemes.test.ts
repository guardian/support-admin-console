import { colourThemes } from './colourThemes';

const choiceCardThemes = colourThemes.styles.flatMap((style) =>
  style.themes.filter((theme) => theme.kind === 'ChoiceCards'),
);

describe('ChoiceCards colour themes', () => {
  it.each(choiceCardThemes)('$label uses the shared card states', (theme) => {
    expect(theme.colours.choiceCards).toMatchObject({
      buttonColour: '#FFFFFF',
      buttonOpacity: 0.8,
      buttonTextColour: '#000000',
      buttonBorderColour: '#121212',
      buttonSelectColour: '#FFFFFF',
      buttonSelectOpacity: 0.95,
      buttonSelectTextColour: '#606060',
      buttonSelectBorderColour: '#121212',
    });
  });

  it('keeps opacity settings off Image-only themes', () => {
    const imageOnlyThemes = colourThemes.styles.flatMap((style) =>
      style.themes.filter((theme) => theme.kind === 'Image'),
    );

    expect(imageOnlyThemes.length).toBeGreaterThan(0);
    imageOnlyThemes.forEach((theme) => {
      expect(theme.colours.choiceCards).not.toHaveProperty('buttonOpacity');
      expect(theme.colours.choiceCards).not.toHaveProperty('buttonSelectOpacity');
    });
  });
});
