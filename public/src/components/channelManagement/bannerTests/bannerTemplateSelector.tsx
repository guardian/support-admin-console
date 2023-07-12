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
  { template: BannerTemplate.AusAnniversaryBanner, label: 'Aus 10 yr moment' },
  { template: BannerTemplate.ContributionsBanner, label: 'Contributions' },
  {
    template: BannerTemplate.ContributionsBannerWithSignIn,
    label: 'Contributions - with sign in link',
  },
  { template: BannerTemplate.CharityAppealBanner, label: 'Charity Appeal' },
  { template: BannerTemplate.DigitalSubscriptionsBanner, label: 'Digital subscriptions' },
  { template: BannerTemplate.PrintSubscriptionsBanner, label: 'Print subscriptions' },
  { template: BannerTemplate.GuardianWeeklyBanner, label: 'Guardian Weekly' },
  { template: BannerTemplate.InvestigationsMomentBanner, label: 'Investigations moment' },
  { template: BannerTemplate.EnvironmentMomentBanner, label: 'Environment moment' },
  { template: BannerTemplate.GlobalNewYearBanner, label: 'Global New Year moment' },
  {
    template: BannerTemplate.UkraineMomentBanner,
    label: 'Ukraine Moment Banner 2023',
  },
  {
    template: BannerTemplate.ChoiceCardsBannerBlue,
    label: 'Choice cards banner - TABS',
  },
  {
    template: BannerTemplate.ChoiceCardsButtonsBannerBlue,
    label: 'Choice cards banner - BUTTONS',
  },
  {
    template: BannerTemplate.WorldPressFreedomDayBanner,
    label: 'World Press Freedom Day',
  },
  {
    template: BannerTemplate.Scotus2023MomentBanner,
    label: 'US Supreme Court 2023 Moment',
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
