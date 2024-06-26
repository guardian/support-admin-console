import React from 'react';
import { MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { BannerUi, uiIsDesign } from '../../../models/banner';
import { BannerDesign } from '../../../models/bannerDesign';

interface BannerDesignSelectorProps {
  ui: BannerUi;
  onUiChange: (updatedUi: BannerUi) => void;
  editMode: boolean;
  designs: BannerDesign[];
}

const BannerDesignSelector: React.FC<BannerDesignSelectorProps> = ({
  ui,
  onUiChange,
  editMode,
  designs,
}: BannerDesignSelectorProps) => {
  const onChange = (event: SelectChangeEvent): void => {
    const designName = event.target.value;
    const isValidBannerDesign = designs.map(d => d.name).includes(designName);
    if (isValidBannerDesign) {
      onUiChange({ designName });
    }
  };

  // It should always be a design now
  const designName = uiIsDesign(ui) ? ui.designName : designs[0]?.name;

  return (
    <Select value={designName} onChange={onChange} disabled={!editMode}>
      {designs.map(design => (
        <MenuItem value={design.name} key={design.name}>
          {design.name}
        </MenuItem>
      ))}
    </Select>
  );
};

export default BannerDesignSelector;
