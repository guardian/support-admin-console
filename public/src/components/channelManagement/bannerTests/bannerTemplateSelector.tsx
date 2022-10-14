import React from 'react';
import { MenuItem, Select } from '@material-ui/core';
import { BannerTemplate } from '../../../models/banner';

function isBannerTemplate(s: string): s is BannerTemplate {
  return Object.values(BannerTemplate).includes(s as BannerTemplate);
}

interface BannerTemplateSelectorProps {
  template: BannerTemplate;
  onTemplateChange: (updatedTemplate: BannerTemplate) => void;
  editMode: boolean;
}

const templatesWithLabels = [
  { template: BannerTemplate.ContributionsBanner, label: 'Contributions' },
  {
    template: BannerTemplate.ContributionsBannerWithSignIn,
    label: 'Contributions - with sign in link',
  },
  { template: BannerTemplate.DigitalSubscriptionsBanner, label: 'Digital subscriptions' },
  { template: BannerTemplate.GuardianWeeklyBanner, label: 'Guardian Weekly' },
  { template: BannerTemplate.InvestigationsMomentBanner, label: 'Investigations moment' },
  { template: BannerTemplate.EnvironmentMomentBanner, label: 'Environment moment' },
  { template: BannerTemplate.GlobalNewYearBanner, label: 'Global New Year moment' },
  {
    template: BannerTemplate.AuBrandMomentBanner,
    label: 'Australian brand moment 2022',
  },
  {
    template: BannerTemplate.ClimateCrisisMomentBanner,
    label: 'Climate crisis moment 2022',
  },
];

const BannerTemplateSelector: React.FC<BannerTemplateSelectorProps> = ({
  template,
  onTemplateChange,
  editMode,
}: BannerTemplateSelectorProps) => {
  const onChange = (event: React.ChangeEvent<{ value: unknown }>): void => {
    const value = event.target.value as string;
    if (isBannerTemplate(value)) {
      onTemplateChange(value);
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

export default BannerTemplateSelector;
