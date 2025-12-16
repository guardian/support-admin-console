import React from 'react';
import { BannerDesignVisual } from '../../../models/bannerDesign';
import { MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { defaultBannerChoiceCardsDesign, defaultBannerImage } from './utils/defaults';
import { ImageEditor } from './ImageEditor';

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
      <Select
        value={visual?.kind || 'None'}
        onChange={onVisualTypeChange}
        disabled={isDisabled}
        name="visual-type-select"
      >
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
      </div>
    </div>
  );
};
