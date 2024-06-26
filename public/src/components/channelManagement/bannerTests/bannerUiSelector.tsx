import React, { useEffect, useState } from 'react';
import { MenuItem, Select, SelectChangeEvent } from '@mui/material';
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
  const [isValid, setIsValid] = useState<boolean>(true);
  const onChange = (event: SelectChangeEvent): void => {
    const designName = event.target.value;
    // const isValidBannerDesign = designs.map(d => d.name).includes(designName);
    // if (isValidBannerDesign) {
    onUiChange({ designName });
    // }
  };

  useEffect(() => {
    const isValidBannerDesign = designs.map(d => d.name).includes(designName);
    console.log('setIsValid', isValidBannerDesign);
    setIsValid(isValidBannerDesign);
    onValidationChange(isValidBannerDesign);
  }, [designName, designs]);

  return (
    <Select value={designName} onChange={onChange} disabled={!editMode} error={!isValid}>
      {designs.map(design => (
        <MenuItem value={design.name} key={design.name}>
          {design.name}
        </MenuItem>
      ))}
    </Select>
  );
};

export default BannerDesignSelector;
