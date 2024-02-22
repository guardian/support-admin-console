import React from 'react';
import { HighlightedTextColours } from '../../../models/bannerDesign';
import { ColourInput } from './ColourInput';
import { Theme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(({ spacing }: Theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    '& > * + *': {
      marginTop: spacing(1),
    },
  },
}));

interface Props {
  colours: HighlightedTextColours;
  isDisabled: boolean;
  onChange: (colours: HighlightedTextColours) => void;
  onValidationChange: (fieldName: string, isValid: boolean) => void;
}

export const HighlightedTextColoursEditor: React.FC<Props> = ({
  colours,
  isDisabled,
  onValidationChange,
  onChange,
}: Props) => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <ColourInput
        colour={colours.text}
        name="colours.highlightedText.text"
        label="Text Colour"
        isDisabled={isDisabled}
        onChange={colour => onChange({ ...colours, text: colour })}
        onValidationChange={onValidationChange}
      />
      <ColourInput
        colour={colours.highlight}
        name="colours.highlightedText.highlight"
        label="Background Colour"
        isDisabled={isDisabled}
        onChange={colour => onChange({ ...colours, highlight: colour })}
        onValidationChange={onValidationChange}
      />
    </div>
  );
};
