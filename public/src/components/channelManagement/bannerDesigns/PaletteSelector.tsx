import React, { useEffect, useMemo, useState } from 'react';
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import PalettePreview, { PreviewColours } from './PalettePreview';
import themes from './utils/colourThemes.json';
import { Theme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';

interface ThemeColoursJson {
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
    text: string;
    filledProgress: string;
    progressBarBackground: string;
    goalMarker: string;
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
}

interface ThemeJson {
  id: string;
  label: string;
  colours: ThemeColoursJson;
}

interface StyleJson {
  id: string;
  label: string;
  themes: ThemeJson[] | string; // string for @ref
}

const useStyles = makeStyles(({ spacing }: Theme) => ({
  container: {
    display: 'flex',
    gap: spacing(3),
    width: '100%',
  },
  selectors: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing(2),
    minWidth: 320,
  },
  preview: {
    flex: 1,
  },
}));

export interface SelectedPalette {
  styleId: string;
  styleLabel: string;
  themeId: string;
  themeLabel: string;
  colours: ThemeColoursJson;
}

type Props = {
  onChange: (selected: SelectedPalette) => void;
  initialStyleId?: string;
  initialThemeId?: string;
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

const PaletteSelector: React.FC<Props> = ({ onChange, initialStyleId, initialThemeId }) => {
  const classes = useStyles();
  const styles: StyleJson[] = useMemo(
    () => resolveRefThemes((themes as { styles: StyleJson[] }).styles),
    [],
  );

  const defaultStyleId = initialStyleId ?? 'business-as-usual';
  const [styleId, setStyleId] = useState<string>(defaultStyleId);
  const availableThemes = useMemo(() => {
    const s = styles.find(st => st.id === styleId);
    return (s?.themes as ThemeJson[]) ?? [];
  }, [styles, styleId]);

  const defaultThemeId = initialThemeId ?? 'support-default';
  const [themeId, setThemeId] = useState<string>(defaultThemeId);

  useEffect(() => {
    // when style changes, if current theme id doesn't exist in that style, reset to first
    const exists = availableThemes.some(t => t.id === themeId);
    const newThemeId = exists ? themeId : availableThemes[0]?.id;
    if (newThemeId && newThemeId !== themeId) {
      setThemeId(newThemeId);
    }
  }, [styleId, availableThemes]);

  const selectedColours: PreviewColours | undefined = useMemo(() => {
    const s = styles.find(st => st.id === styleId);
    const t = (s?.themes as ThemeJson[]).find(tt => tt.id === themeId);
    return t?.colours as PreviewColours | undefined;
  }, [styles, styleId, themeId]);

  const emit = (sid: string, tid: string) => {
    const style = styles.find(st => st.id === sid)!;
    const theme = (style.themes as ThemeJson[]).find(t => t.id === tid)!;
    onChange({
      styleId: sid,
      styleLabel: style.label,
      themeId: tid,
      themeLabel: theme.label,
      colours: theme.colours,
    });
  };

  const onStyleChange = (e: SelectChangeEvent<string>) => {
    const newStyleId = e.target.value;
    setStyleId(newStyleId);
    const themesForStyle = (styles.find(s => s.id === newStyleId)?.themes as ThemeJson[]) ?? [];
    const nextThemeId = themesForStyle.some(t => t.id === themeId)
      ? themeId
      : themesForStyle[0]?.id;
    if (nextThemeId && nextThemeId !== themeId) {
      setThemeId(nextThemeId);
    }
    if (nextThemeId) {
      emit(newStyleId, nextThemeId);
    }
  };

  const onThemeChange = (e: SelectChangeEvent<string>) => {
    const newThemeId = e.target.value;
    setThemeId(newThemeId);
    emit(styleId, newThemeId);
  };

  return (
    <div className={classes.container}>
      <div className={classes.selectors}>
        <FormControl required fullWidth>
          <InputLabel id="style-label">Style</InputLabel>
          <Select labelId="style-label" label="Style" value={styleId} onChange={onStyleChange}>
            {styles.map(s => (
              <MenuItem key={s.id} value={s.id}>
                {s.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl required fullWidth>
          <InputLabel id="theme-label">Colour theme</InputLabel>
          <Select
            labelId="theme-label"
            label="Colour theme"
            value={themeId}
            onChange={onThemeChange}
          >
            {availableThemes.map(t => (
              <MenuItem key={t.id} value={t.id}>
                {t.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      <div className={classes.preview}>
        {selectedColours && <PalettePreview colours={selectedColours} />}
      </div>
    </div>
  );
};

export default PaletteSelector;
