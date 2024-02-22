import React from 'react';
import { BannerDesignVisual } from '../../../models/bannerDesign';
import { MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { defaultBannerChoiceCardsDesign, defaultBannerImage } from './utils/defaults';
import { ImageEditor } from './ImageEditor';
import { OptionalColourInput } from './ColourInput';

interface Props {
  visual?: BannerDesignVisual;
  isDisabled: boolean;
  onValidationChange: (fieldName: string, isValid: boolean) => void;
  onChange: (visual: BannerDesignVisual | undefined) => void;
}

type VisualType = 'Image' | 'ChoiceCards' | 'None';

export const BannerVisualEditor: React.FC<Props> = ({
  visual,
  isDisabled,
  onValidationChange,
  onChange,
}: Props) => {
  const onVisualTypeChange = (event: SelectChangeEvent<VisualType>) => {
    const value = event.target.value;
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
          Main Image
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
          <>
            <OptionalColourInput
              colour={visual.buttonColour}
              name="visual.buttonColour"
              label="Button background colour"
              isDisabled={isDisabled}
              onChange={buttonColour => onChange({ ...visual, buttonColour })}
              onValidationChange={onValidationChange}
            />
            <OptionalColourInput
              colour={visual.buttonTextColour}
              name="visual.buttonTextColour"
              label="Button text colour"
              isDisabled={isDisabled}
              onChange={buttonTextColour => onChange({ ...visual, buttonTextColour })}
              onValidationChange={onValidationChange}
            />
            <OptionalColourInput
              colour={visual.buttonBorderColour}
              name="visual.buttonBorderColour"
              label="Button border colour"
              isDisabled={isDisabled}
              onChange={buttonBorderColour => onChange({ ...visual, buttonBorderColour })}
              onValidationChange={onValidationChange}
            />
            <OptionalColourInput
              colour={visual.buttonSelectColour}
              name="visual.buttonSelectColour"
              label="Selected button background colour"
              isDisabled={isDisabled}
              onChange={buttonSelectColour => onChange({ ...visual, buttonSelectColour })}
              onValidationChange={onValidationChange}
            />
            <OptionalColourInput
              colour={visual.buttonSelectTextColour}
              name="visual.buttonSelectTextColour"
              label="Selected button text colour"
              isDisabled={isDisabled}
              onChange={buttonSelectTextColour => onChange({ ...visual, buttonSelectTextColour })}
              onValidationChange={onValidationChange}
            />
            <OptionalColourInput
              colour={visual.buttonSelectBorderColour}
              name="visual.buttonSelectBorderColour"
              label="Selected button border colour"
              isDisabled={isDisabled}
              onChange={buttonSelectBorderColour =>
                onChange({ ...visual, buttonSelectBorderColour })
              }
              onValidationChange={onValidationChange}
            />
          </>
        )}
      </div>
    </div>
  );
};
