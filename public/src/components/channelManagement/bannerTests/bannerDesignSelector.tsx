import { MenuItem, Select, SelectChangeEvent } from '@mui/material';
import React, { useEffect } from 'react';
import { BannerUi } from '../../../models/banner';
import { BannerDesign } from '../../../models/bannerDesign';

interface BannerDesignSelectorProps {
  designName: string;
  onUiChange: (updatedUi: BannerUi) => void;
  editMode: boolean;
  designs: BannerDesign[];
  onValidationChange: (isValid: boolean) => void;
}

const BannerDesignSelector: React.FC<BannerDesignSelectorProps> = ({
  designName,
  onUiChange,
  editMode,
  designs,
  onValidationChange,
}: BannerDesignSelectorProps) => {
  const isValid = designs.map((d) => d.name).includes(designName);

  const onChange = (event: SelectChangeEvent): void => {
    const designName = event.target.value;
    onUiChange({ designName });
  };

  useEffect(() => {
    const isValidBannerDesign = designs.map((d) => d.name).includes(designName);
    onValidationChange(isValidBannerDesign);
  }, [designName, designs, onValidationChange]);

  return (
    <Select
      value={designName}
      onChange={onChange}
      disabled={!editMode}
      error={!isValid}
      name="banner-design-selector"
    >
      {designs.map((design) => (
        <MenuItem value={design.name} key={design.name}>
          {design.name}
        </MenuItem>
      ))}
    </Select>
  );
};

export default BannerDesignSelector;
