import React from 'react';
import { HighlightedTextColours } from '../../../models/bannerDesign';
import { ColourInput } from './ColourInput';
import { makeStyles, Theme } from '@material-ui/core/styles';

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
        required={true}
      />
      <ColourInput
        colour={colours.highlight}
        name="colours.highlightedText.highlight"
        label="Background Colour"
        isDisabled={isDisabled}
        onChange={colour => onChange({ ...colours, highlight: colour })}
        onValidationChange={onValidationChange}
        required={true}
      />
    </div>
  );
};
