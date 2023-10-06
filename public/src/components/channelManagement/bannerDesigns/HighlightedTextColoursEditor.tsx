import React from 'react';
import { HighlightedTextColours } from '../../../models/bannerDesign';
import { ColourInput } from './ColourInput';

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
  return (
    <div>
      <ColourInput
        colour={colours.text}
        name="colours.highlightedText.text"
        label="Background Colour"
        isDisabled={isDisabled}
        onChange={colour => onChange({ ...colours, text: colour })}
        onValidationChange={onValidationChange}
        required={true}
      />
      <ColourInput
        colour={colours.highlight}
        name="colours.highlightedText.highlight"
        label="Body Text Colour"
        isDisabled={isDisabled}
        onChange={colour => onChange({ ...colours, highlight: colour })}
        onValidationChange={onValidationChange}
        required={true}
      />
    </div>
  );
};
