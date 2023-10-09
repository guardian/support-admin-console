import React from 'react';
import { BannerDesignVisual } from '../../../models/bannerDesign';
import { MenuItem, Select } from '@material-ui/core';
import { defaultBannerChoiceCardsDesign, defaultBannerImage } from './utils/defaults';
import { ImageEditor } from './ImageEditor';
import { ColourInput } from './ColourInput';

interface Props {
  visual?: BannerDesignVisual;
  isDisabled: boolean;
  onValidationChange: (fieldName: string, isValid: boolean) => void;
  onChange: (visual: BannerDesignVisual | undefined) => void;
}

export const BannerVisualEditor: React.FC<Props> = ({
  visual,
  isDisabled,
  onValidationChange,
  onChange,
}: Props) => {
  const onVisualTypeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const value = event.target.value as 'Image' | 'ChoiceCards' | 'None';
    if (value === 'Image') {
      onChange(defaultBannerImage);
    } else if (value === 'ChoiceCards') {
      onChange(defaultBannerChoiceCardsDesign);
    } else {
      onChange(undefined);
    }
  };

  return (
    <div>
      <Select value={visual?.kind || 'None'} onChange={onVisualTypeChange} disabled={isDisabled}>
        <MenuItem value="Image" key="Image">
          Image
        </MenuItem>
        <MenuItem value="ChoiceCards" key="ChoiceCards">
          Amounts Choice Cards
        </MenuItem>
        <MenuItem value="None" key="None">
          None
        </MenuItem>
      </Select>
      <div>
        {visual?.kind === 'Image' && (
          <ImageEditor
            image={visual}
            isDisabled={isDisabled}
            onValidationChange={isValid => onValidationChange('visual.image', isValid)}
            onChange={onChange}
          />
        )}
        {visual?.kind === 'ChoiceCards' && (
          <ColourInput
            colour={visual.buttonColour}
            name="visual.buttonColour"
            label="Button Colour"
            isDisabled={isDisabled}
            onChange={buttonColour => onChange({ ...visual, buttonColour })}
            onValidationChange={onValidationChange}
            required={false}
          />
        )}
      </div>
    </div>
  );
};
