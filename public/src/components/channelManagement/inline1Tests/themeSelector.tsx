import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  styled,
} from '@mui/material';
import React, { useCallback, useMemo, useState } from 'react';
import {
  Inline1SupportMessageColours,
  Inline1SupportMessageStyle,
  inline1SupportMessageStyles,
  Inline1SupportMessageTheme,
} from './utils/styles';

const Container = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: theme.spacing(3),
  width: '100%',
  flexDirection: 'column',
  flexWrap: 'wrap',
  marginTop: theme.spacing(2),

  [theme.breakpoints.up('md')]: {
    flexDirection: 'row',
  },
}));

const Selectors = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  minWidth: 320,
}));

export interface SelectedPalette {
  styleId: string;
  themeId: string;
  colours: Inline1SupportMessageColours;
}

interface ThemeSelectorProps {
  initialStyleId: string;
  initialThemeId: string;
  onChange: (selected: SelectedPalette) => void;
  isDisabled: boolean;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  initialStyleId,
  initialThemeId,
  onChange,
  isDisabled,
}) => {
  const styles = inline1SupportMessageStyles;

  const getStyle = useCallback(
    (styleId: string) => styles.find((style) => style.id === styleId),
    [styles],
  );

  const getTheme = useCallback(
    (style: Inline1SupportMessageStyle, themeId: string) =>
      style.themes.find((theme) => theme.id === themeId),
    [],
  );

  const [style, setStyle] = useState<Inline1SupportMessageStyle>(
    () => getStyle(initialStyleId) ?? styles[0],
  );

  const [theme, setTheme] = useState<Inline1SupportMessageTheme>(
    () => getTheme(style, initialThemeId) ?? style.themes[0],
  );

  const availableThemes = useMemo(() => style.themes, [style]);

  const setSelectedPalette = useCallback(
    (style: Inline1SupportMessageStyle, theme: Inline1SupportMessageTheme) => {
      onChange({
        styleId: style.id,
        themeId: theme.id,
        colours: theme.colours,
      });
    },
    [onChange],
  );

  const onStyleChange = (e: SelectChangeEvent) => {
    const newStyleId = e.target.value;
    const newStyle = getStyle(newStyleId) ?? style;
    const newTheme = getTheme(newStyle, theme.id) ?? newStyle.themes[0];
    setStyle(newStyle);
    setTheme(newTheme);
    setSelectedPalette(newStyle, newTheme);
  };

  const onThemeChange = (e: SelectChangeEvent) => {
    const newThemeId = e.target.value;
    const newTheme = getTheme(style, newThemeId) ?? theme;
    setTheme(newTheme);
    setSelectedPalette(style, newTheme);
  };

  return (
    <Container>
      <Selectors>
        <FormControl required fullWidth error={!style}>
          <InputLabel id="style-label" htmlFor="style-select">
            Style
          </InputLabel>
          <Select
            labelId="style-label"
            label="Style"
            value={initialStyleId}
            onChange={onStyleChange}
            disabled={isDisabled}
            inputProps={{
              id: 'style-select',
            }}
          >
            {styles.map((style) => (
              <MenuItem key={style.id} value={style.id}>
                {style.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl required fullWidth error={!theme}>
          <InputLabel id="theme-label" htmlFor="theme-select">
            Colour theme
          </InputLabel>
          <Select
            labelId="theme-label"
            label="Colour theme"
            value={initialThemeId}
            onChange={onThemeChange}
            disabled={isDisabled}
            inputProps={{
              id: 'theme-select',
            }}
          >
            {availableThemes.map((theme) => (
              <MenuItem key={theme.id} value={theme.id}>
                {theme.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Selectors>
    </Container>
  );
};

export default ThemeSelector;
