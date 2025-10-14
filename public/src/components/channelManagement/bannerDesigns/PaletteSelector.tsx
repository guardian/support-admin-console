import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { Theme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import React, { useEffect, useMemo, useState } from 'react';
import { HELP_GUIDE_URL } from '../../../main';
import PalettePreview from './PalettePreview';
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
  styleId?: string;
  themeId?: string;
  colours?: ThemeColours;
}

type Props = {
  onChange: (selected: SelectedPalette) => void;
  initialStyleId?: string;
  initialThemeId?: string;
  visualKind?: 'Image' | 'ChoiceCards';
};

const PaletteSelector: React.FC<Props> = ({
  onChange,
  initialStyleId,
  initialThemeId,
  visualKind,
}) => {
  const classes = useStyles();
  const { styles } = colourThemes;

  const getStyle = (styleId?: string) =>
    styles.find(style => style.id === styleId && style.themes.some(t => t.kind === visualKind));

  const [style, setStyle] = useState<ThemeStyle | undefined>(getStyle(initialStyleId));

  const getTheme = (style?: ThemeStyle, themeId?: string) => {
    const theme =
      style?.themes.find(theme => theme.id === themeId && theme.kind === visualKind) ??
      style?.themes.find(theme => theme.kind === visualKind); // Fallback to any theme matching the visualKind
    return theme;
  };

  const [theme, setTheme] = useState<ThemeDefinition | undefined>(getTheme(style, initialThemeId));

  const availableStyles = useMemo(() => {
    return styles.filter(style => style.themes.some(t => t.kind === visualKind));
  }, [styles, visualKind]);

  const availableThemes = useMemo(() => {
    return style?.themes.filter(theme => theme.kind === visualKind) ?? [];
  }, [styles, style, visualKind]);

  useEffect(() => {
    const style = getStyle(initialStyleId || initialStyleId);
    const theme = getTheme(style, initialThemeId || initialThemeId);
    setStyle(style);
    setTheme(theme);
    setSelectedPalette(style, theme);
  }, [initialStyleId, initialThemeId, visualKind, styles]);

  const selectedColours = useMemo(() => theme?.colours, [theme]);

  const setSelectedPalette = (style?: ThemeStyle, theme?: ThemeDefinition) => {
    console.log('Setting selected palette', { style, theme });
    onChange({
      styleId: style?.id,
      themeId: theme?.id,
      colours: theme?.colours,
    });
  };

  const onStyleChange = (e: SelectChangeEvent<string>) => {
    const newStyleId = e.target.value;
    const newStyle = getStyle(newStyleId);

    setStyle(newStyle);
    if (!newStyle) {
      setTheme(undefined);
      return;
    }

    const newTheme = getTheme(newStyle, theme?.id);
    setTheme(newTheme);
    setSelectedPalette(newStyle, newTheme);
  };

  const onThemeChange = (e: SelectChangeEvent<string>) => {
    const newThemeId = e.target.value;
    const newTheme = getTheme(style, newThemeId);
    setTheme(newTheme);
    setSelectedPalette(style, newTheme);
  };

  return (
    <div className={classes.container}>
      <div className={classes.selectors}>
        <FormControl required fullWidth error={!style}>
          <InputLabel id="style-label">Style</InputLabel>
          <Select
            labelId="style-label"
            label="Style"
            value={style?.id ?? ''}
            onChange={onStyleChange}
          >
            {availableStyles.map(style => (
              <MenuItem key={style.id} value={style.id}>
                {style.label}
              </MenuItem>
            ))}
          </Select>
          {!style && <FormHelperText>Select a style</FormHelperText>}
        </FormControl>
        <FormControl required fullWidth error={!theme}>
          <InputLabel id="theme-label">Colour theme</InputLabel>
          <Select
            labelId="theme-label"
            label="Colour theme"
            value={theme?.id ?? ''}
            onChange={onThemeChange}
          >
            {availableThemes.map(theme => (
              <MenuItem key={theme.id} value={theme.id}>
                {theme.label}
              </MenuItem>
            ))}
          </Select>
          {!theme && <FormHelperText>Select a colour theme</FormHelperText>}
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
