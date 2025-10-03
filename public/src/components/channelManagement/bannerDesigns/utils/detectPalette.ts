import { BannerDesign } from '../../../../models/bannerDesign';
import themes from './colourThemes.json';

type ThemeColours = {
  background: string;
  heading: string;
  bodyText: string;
  articleCountText?: string;
  highlightText: string;
  highlightBackground: string;
  primaryCta: { text: string; background: string; border?: string | null };
  secondaryCta: { text: string; background: string; border?: string | null };
  closeButton?: { text: string; background: string; border?: string | null };
  ticker?: {
    filledProgress: string;
    progressBarBackground: string;
    headlineColour: string;
    totalColour: string;
    goalColour: string;
  };
  choiceCards?: {
    buttonColour: string;
    buttonTextColour: string;
    buttonBorderColour: string;
    buttonSelectColour: string;
    buttonSelectTextColour: string;
    buttonSelectBorderColour: string;
  };
  logo?: string;
};

type ThemeJson = { id: string; label: string; colours: ThemeColours };
type StyleJson = { id: string; label: string; themes: ThemeJson[] | string };

const hexFromDesign = (r?: string, g?: string, b?: string): string | undefined =>
  r && g && b ? `#${r}${g}${b}`.toUpperCase() : undefined;

const normalize = (s?: string | null): string | undefined => (s ? s.toUpperCase() : undefined);

const coloursFromDesign = (design: BannerDesign) => {
  const basic = design.colours.basic;
  const hl = design.colours.highlightedText;
  const p = design.colours.primaryCta.default;
  const s = design.colours.secondaryCta.default;
  const cb = design.colours.closeButton.default;
  return {
    background: hexFromDesign(basic.background.r, basic.background.g, basic.background.b),
    heading: hexFromDesign(basic.headerText.r, basic.headerText.g, basic.headerText.b),
    bodyText: hexFromDesign(basic.bodyText.r, basic.bodyText.g, basic.bodyText.b),
    articleCountText: hexFromDesign(
      basic.articleCountText.r,
      basic.articleCountText.g,
      basic.articleCountText.b,
    ),
    highlightText: hexFromDesign(hl.text.r, hl.text.g, hl.text.b),
    highlightBackground: hexFromDesign(hl.highlight.r, hl.highlight.g, hl.highlight.b),
    primaryCta: {
      text: hexFromDesign(p.text.r, p.text.g, p.text.b),
      background: hexFromDesign(p.background.r, p.background.g, p.background.b),
      border: p.border ? hexFromDesign(p.border.r, p.border.g, p.border.b) : undefined,
    },
    secondaryCta: {
      text: hexFromDesign(s.text.r, s.text.g, s.text.b),
      background: hexFromDesign(s.background.r, s.background.g, s.background.b),
      border: s.border ? hexFromDesign(s.border.r, s.border.g, s.border.b) : undefined,
    },
    closeButton: {
      text: hexFromDesign(cb.text.r, cb.text.g, cb.text.b),
      background: hexFromDesign(cb.background.r, cb.background.g, cb.background.b),
      border: cb.border ? hexFromDesign(cb.border.r, cb.border.g, cb.border.b) : undefined,
    },
  } as ThemeColours;
};

const resolveRefThemes = (styles: StyleJson[]): StyleJson[] => {
  const map = new Map(styles.map(s => [s.id, s]));
  return styles.map(s => {
    if (typeof s.themes === 'string' && s.themes.startsWith('@ref:')) {
      const refId = s.themes.replace('@ref:', '');
      const ref = map.get(refId);
      return { ...s, themes: (ref?.themes as ThemeJson[]) ?? [] };
    }
    return s as StyleJson;
  });
};

export const detectStyleAndThemeForDesign = (
  design: BannerDesign,
): { styleId: string; themeId: string } | undefined => {
  const styles = resolveRefThemes((themes as { styles: StyleJson[] }).styles);
  const dc = coloursFromDesign(design);

  for (const style of styles) {
    for (const theme of style.themes as ThemeJson[]) {
      const tc = theme.colours;
      const equal =
        normalize(dc.background) === normalize(tc.background) &&
        normalize(dc.heading) === normalize(tc.heading) &&
        normalize(dc.bodyText) === normalize(tc.bodyText) &&
        normalize(dc.articleCountText) === normalize(tc.articleCountText ?? dc.articleCountText) &&
        normalize(dc.highlightText) === normalize(tc.highlightText) &&
        normalize(dc.highlightBackground) === normalize(tc.highlightBackground) &&
        normalize(dc.primaryCta.text) === normalize(tc.primaryCta.text) &&
        normalize(dc.primaryCta.background) === normalize(tc.primaryCta.background) &&
        normalize(dc.primaryCta.border) === normalize(tc.primaryCta.border ?? undefined) &&
        normalize(dc.secondaryCta.text) === normalize(tc.secondaryCta.text) &&
        normalize(dc.secondaryCta.background) === normalize(tc.secondaryCta.background) &&
        normalize(dc.secondaryCta.border) === normalize(tc.secondaryCta.border ?? undefined) &&
        normalize(dc.closeButton?.text) ===
          normalize(tc.closeButton?.text ?? dc.closeButton?.text) &&
        normalize(dc.closeButton?.background) ===
          normalize(tc.closeButton?.background ?? dc.closeButton?.background) &&
        normalize(dc.closeButton?.border) === normalize(tc.closeButton?.border ?? undefined);
      if (equal) {
        return { styleId: style.id, themeId: theme.id };
      }
    }
  }
  return undefined;
};
