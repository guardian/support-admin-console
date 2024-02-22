import React, { useEffect, useState } from 'react';
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import {
  BannerDesignName,
  BannerTemplate,
  BannerUi,
  isBannerTemplate,
  uiIsDesign,
} from '../../../models/banner';
import { BannerDesign } from '../../../models/bannerDesign';

interface BannerUiSelectorProps {
  ui: BannerUi;
  onUiChange: (updatedUi: BannerUi) => void;
  editMode: boolean;
  designs: BannerDesign[];
}

const templatesWithLabels = [
  {
    template: BannerTemplate.EuropeMomentLocalLanguageBanner,
    label: 'Europe Moment Local Language 2023',
  },
  { template: BannerTemplate.ContributionsBanner, label: 'Contributions' },
  {
    template: BannerTemplate.ContributionsBannerWithSignIn,
    label: 'Contributions - with sign in link',
  },
  {
    template: BannerTemplate.WorldPressFreedomDayBanner,
    label: 'World Press Freedom Day',
  },
  { template: BannerTemplate.EnvironmentBanner, label: 'Environment' },
];

interface BannerTemplateSelectorProps {
  template: BannerTemplate;
  onUiChange: (updatedUi: BannerUi) => void;
  editMode: boolean;
}

const BannerTemplateSelector: React.FC<BannerTemplateSelectorProps> = ({
  template,
  onUiChange,
  editMode,
}: BannerTemplateSelectorProps) => {
  const onChange = (event: SelectChangeEvent<BannerTemplate>): void => {
    const value = event.target.value as string;
    if (isBannerTemplate(value)) {
      onUiChange(value);
    }
  };

  return (
    <Select value={template} onChange={onChange} disabled={!editMode}>
      {templatesWithLabels.map(withLabel => (
        <MenuItem value={withLabel.template} key={withLabel.template}>
          {withLabel.label}
        </MenuItem>
      ))}
    </Select>
  );
};

interface BannerDesignSelectorProps {
  design: BannerDesignName;
  onUiChange: (updatedUi: BannerUi) => void;
  editMode: boolean;
  designs: BannerDesign[];
}

const BannerDesignSelector: React.FC<BannerDesignSelectorProps> = ({
  design,
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

  return (
    <Select value={design.designName} onChange={onChange} disabled={!editMode}>
      {designs.map(design => (
        <MenuItem value={design.name} key={design.name}>
          {design.name}
        </MenuItem>
      ))}
    </Select>
  );
};

type UiType = 'Design' | 'Template';

const BannerUiSelector: React.FC<BannerUiSelectorProps> = ({
  ui,
  onUiChange,
  editMode,
  designs,
}: BannerUiSelectorProps) => {
  const [uiType, setUiType] = useState<UiType>(uiIsDesign(ui) ? 'Design' : 'Template');

  const onUiTypeChange = (event: React.ChangeEvent<{ value: unknown }>): void => {
    const uiType = event.target.value as UiType;
    setUiType(uiType);

    const defaultUI =
      uiType === 'Design' ? { designName: designs[0]?.name } : BannerTemplate.ContributionsBanner;

    onUiChange(defaultUI);
  };

  useEffect(() => {
    // This state isn't part of the variant, so when changes are discarded we want to reflect the unedited variant
    setUiType(uiIsDesign(ui) ? 'Design' : 'Template');
  }, [editMode]);

  return (
    <>
      <div>
        <FormControl>
          <FormLabel>UI Type</FormLabel>
          <RadioGroup
            name="controlled-radio-buttons-group"
            value={uiType}
            onChange={onUiTypeChange}
          >
            <FormControlLabel
              value="Template"
              control={<Radio disabled={!editMode} />}
              label="Template"
            />
            <FormControlLabel
              value="Design"
              control={<Radio disabled={!editMode} />}
              label="Design"
            />
          </RadioGroup>
        </FormControl>
      </div>

      {uiIsDesign(ui) ? (
        <BannerDesignSelector
          design={ui}
          onUiChange={onUiChange}
          editMode={editMode}
          designs={designs}
        />
      ) : (
        <BannerTemplateSelector template={ui} onUiChange={onUiChange} editMode={editMode} />
      )}
    </>
  );
};

export default BannerUiSelector;
