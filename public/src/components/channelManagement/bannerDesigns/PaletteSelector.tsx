import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { Theme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import React, { useEffect, useMemo, useState } from 'react';
import { HELP_GUIDE_URL } from '../../../main';
import PalettePreview, { PreviewColours } from './PalettePreview';
import { colourThemes, ThemeColours, ThemeDefinition, ThemeStyle } from './utils/colourThemes';

const useStyles = makeStyles(({ breakpoints, spacing }: Theme) => ({
  container: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing(3),
    width: '100%',
    flexDirection: 'column',
    flexWrap: 'wrap',
    marginTop: spacing(2),

    [breakpoints.up('md')]: {
      flexDirection: 'row',
    },
  },
  selectors: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing(2),
    minWidth: 320,
  },
}));

export interface SelectedPalette {
  styleId: string;
  styleLabel: string;
  themeId: string;
  themeLabel: string;
  colours: ThemeColours;
}

type Props = {
  onChange: (selected: SelectedPalette) => void;
  initialStyleId?: string;
  initialThemeId?: string;
  visualKind?: 'Image' | 'ChoiceCards' | 'None';
};

const PaletteSelector: React.FC<Props> = ({
  onChange,
  initialStyleId,
  initialThemeId,
  visualKind,
}) => {
  const classes = useStyles();
  const styles: ThemeStyle[] = useMemo(() => colourThemes.styles, []);

  const defaultStyleId = initialStyleId ?? 'business-as-usual';
  const [styleId, setStyleId] = useState<string>(defaultStyleId);
  const availableThemes = useMemo(() => {
    const s = styles.find(st => st.id === styleId);
    return s?.themes ?? [];
  }, [styles, styleId]);

  const defaultThemeId = initialThemeId ?? 'support-default';
  const [themeId, setThemeId] = useState<string>(defaultThemeId);

  useEffect(() => {
    const initialStyle = initialStyleId || defaultStyleId;
    const initialTheme = initialThemeId || defaultThemeId;
    const styleExists = styles.some(s => s.id === initialStyle);
    const styleToUse = styleExists ? initialStyle : defaultStyleId;
    const styleObj = styles.find(s => s.id === styleToUse);
    const themeExists = styleObj ? styleObj.themes.some(t => t.id === initialTheme) : false;
    const themeToUse = themeExists
      ? initialTheme
      : (styleObj?.themes as ThemeDefinition[])[0]?.id || defaultThemeId;
    setStyleId(styleToUse);
    setThemeId(themeToUse);
    if (styleToUse && themeToUse) {
      setSelectedPalette(styleToUse, themeToUse);
    }
  }, [initialStyleId, initialThemeId, styles]);

  useEffect(() => {
    const newThemeId = availableThemes[0]?.id;
    if (newThemeId && newThemeId !== themeId) {
      setThemeId(newThemeId);
    }
  }, [availableThemes]);

  const selectedColours: PreviewColours | undefined = useMemo(() => {
    const style = styles.find(st => st.id === styleId);
    const theme = (style?.themes as ThemeDefinition[]).find(theme => theme.id === themeId);
    return theme?.colours;
  }, [styles, styleId, themeId]);

  const setSelectedPalette = (styleId: string, themeId: string) => {
    const style = styles.find(st => st.id === styleId)!;
    const theme = (style.themes as ThemeDefinition[]).find(t => t.id === themeId)!;
    onChange({
      styleId,
      styleLabel: style.label,
      themeId,
      themeLabel: theme.label,
      colours: theme.colours,
    });
  };

  const onStyleChange = (e: SelectChangeEvent<string>) => {
    const newStyleId = e.target.value;
    setStyleId(newStyleId);
    const themesForStyle =
      (styles.find(s => s.id === newStyleId)?.themes as ThemeDefinition[]) ?? [];
    const nextThemeId = themesForStyle.some(t => t.id === themeId)
      ? themeId
      : themesForStyle[0]?.id;
    if (nextThemeId && nextThemeId !== themeId) {
      setThemeId(nextThemeId);
    }
    if (nextThemeId) {
      setSelectedPalette(newStyleId, nextThemeId);
    }
  };

  const onThemeChange = (e: SelectChangeEvent<string>) => {
    const newThemeId = e.target.value;
    setThemeId(newThemeId);
    setSelectedPalette(styleId, newThemeId);
  };

  if (visualKind === 'None') {
    return null;
  }

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
      {selectedColours && (
        <>
          <PalettePreview colours={selectedColours} visualKind={visualKind} />
          <div>
            <p>
              The colours used in the Main Image and Choice Card banners are sometimes different,
              even when they belong to the same colour theme. Refer to the{' '}
              <a href={HELP_GUIDE_URL} target="_blank" rel="noopener noreferrer">
                user guide
              </a>{' '}
              for a complete list of colours within each theme.
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default PaletteSelector;
