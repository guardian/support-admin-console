import React from 'react';
import { MenuItem, Select } from '@material-ui/core';
import { BannerTemplate, BannerUi, isBannerTemplate, uiIsDesign } from '../../../models/banner';

interface BannerUiSelectorProps {
  ui: BannerUi;
  onUiChange: (updatedUi: BannerUi) => void;
  editMode: boolean;
}

interface BannerTemplateSelectorProps {
  template: BannerTemplate;
  onUiChange: (updatedUi: BannerUi) => void;
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

const BannerUiSelector: React.FC<BannerUiSelectorProps> = ({
  ui,
  onUiChange,
  editMode,
}: BannerUiSelectorProps) => {
  if (uiIsDesign(ui)) {
    return <div>Implement design picker!</div>;
  } else {
    return <BannerTemplateSelector template={ui} onUiChange={onUiChange} editMode={editMode} />;
  }
};

export default BannerUiSelector;
