import React, { useEffect, useState } from 'react';
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
} from '@material-ui/core';
import {
  BannerDesignName,
  BannerTemplate,
  BannerUi,
  isBannerTemplate,
  uiIsDesign,
} from '../../../models/banner';
import { BannerDesign } from '../../../models/bannerDesign';
import { shouldShowBannerDesignsFeature } from '../../../utils/features';

interface BannerUiSelectorProps {
  ui: BannerUi;
  onUiChange: (updatedUi: BannerUi) => void;
  editMode: boolean;
  designs: BannerDesign[];
}

const templatesWithLabels = [
  {
    template: BannerTemplate.EnvironmentMoment2023Banner,
    label: 'Environment Moment 2023',
  },
  {
    template: BannerTemplate.EuropeMomentLocalLanguageBanner,
    label: 'Europe Moment Local Language 2023',
  },
  {
    template: BannerTemplate.SupporterMomentBanner,
    label: 'Supporter Moment 2023',
  },
  {
    template: BannerTemplate.Scotus2023MomentBanner,
    label: 'US-Supreme-Court Moment 2023',
  },
  { template: BannerTemplate.AusAnniversaryMomentBanner, label: 'Aus-Anniversary Moment 2023' },
  {
    template: BannerTemplate.UkraineMomentBanner,
    label: 'Ukraine Moment 2023',
  },
  { template: BannerTemplate.GlobalNewYearMomentBanner, label: 'Global-New-Year Moment 2022' },
  { template: BannerTemplate.ContributionsBanner, label: 'Contributions' },
  {
    template: BannerTemplate.ContributionsBannerWithSignIn,
    label: 'Contributions - with sign in link',
  },
  {
    template: BannerTemplate.ChoiceCardsButtonsBannerBlue,
    label: 'Choice cards banner - BUTTONS',
  },
  {
    template: BannerTemplate.WorldPressFreedomDayBanner,
    label: 'World Press Freedom Day',
  },
  { template: BannerTemplate.GuardianWeeklyBanner, label: 'Guardian Weekly' },
  { template: BannerTemplate.InvestigationsMomentBanner, label: 'Investigations moment' },
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
  const onChange = (event: React.ChangeEvent<{ value: unknown }>): void => {
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
  const onChange = (event: React.ChangeEvent<{ value: unknown }>): void => {
    const designName = event.target.value as string;
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
      {shouldShowBannerDesignsFeature() && (
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
      )}

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
