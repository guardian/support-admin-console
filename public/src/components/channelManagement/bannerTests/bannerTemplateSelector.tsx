import React, { useState } from 'react';
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
} from '@material-ui/core';
import { BannerTemplate } from '../../../models/banner';

function isBannerTemplate(s: string): s is BannerTemplate {
  return Object.values(BannerTemplate).includes(s as BannerTemplate);
}

interface BannerTemplateSelectorProps {
  template: BannerTemplate;
  onTemplateChange: (updatedTemplate: BannerTemplate) => void;
  editMode: boolean;
}

type TemplateType = 'Contributions' | 'Subscriptions' | 'Moment Template' | 'Bespoke';

const templateTypes: TemplateType[] = [
  'Contributions',
  'Subscriptions',
  'Moment Template',
  'Bespoke',
];

const contributionsTemplatesWithLabels = [
  { template: BannerTemplate.ContributionsBanner, label: 'Contributions' },
  {
    template: BannerTemplate.ContributionsBannerWithSignIn,
    label: 'Contributions - with sign in link',
  },
];

const subscriptionsTemplatesWithLabels = [
  { template: BannerTemplate.DigitalSubscriptionsBanner, label: 'Digital subscriptions' },
  { template: BannerTemplate.PrintSubscriptionsBanner, label: 'Print subscriptions' },
  { template: BannerTemplate.GuardianWeeklyBanner, label: 'Guardian Weekly' },
];

const momentTemplatesWithLabels = [
  { template: BannerTemplate.EnvironmentMomentBanner, label: 'Environment moment' },
  { template: BannerTemplate.GlobalNewYearBanner, label: 'Global New Year moment' },
  {
    template: BannerTemplate.UkraineMomentBanner,
    label: 'Ukraine Moment Banner 2023',
  },
  { template: BannerTemplate.AusAnniversaryBanner, label: 'Aus 10 yr moment' },
];

const bespokeTemplatesWithLabels = [
  { template: BannerTemplate.CharityAppealBanner, label: 'Charity Appeal' },
  { template: BannerTemplate.InvestigationsMomentBanner, label: 'Investigations moment' },
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
];

const getselectedTemplateType = (selectedTemplateType: TemplateType) => {
  switch (selectedTemplateType) {
    case 'Contributions':
      return contributionsTemplatesWithLabels;
    case 'Subscriptions':
      return subscriptionsTemplatesWithLabels;
    case 'Moment Template':
      return momentTemplatesWithLabels;
    case 'Bespoke':
      return bespokeTemplatesWithLabels;

    default:
      return contributionsTemplatesWithLabels;
  }
};

const BannerTemplateSelector: React.FC<BannerTemplateSelectorProps> = ({
  template,
  onTemplateChange,
  editMode,
}: BannerTemplateSelectorProps) => {
  const [selectedTemplateType, setSelectedTemplateType] = useState<TemplateType>('Contributions');

  const onChange = (event: React.ChangeEvent<{ value: unknown }>): void => {
    const value = event.target.value as string;
    if (isBannerTemplate(value)) {
      onTemplateChange(value);
    }
  };

  return (
    <>
      <FormControl>
        <FormLabel id="Banner Template Type">Banner Template Type</FormLabel>
        <RadioGroup
          aria-label="Banner Template Type"
          name="bannerTemplateType"
          value={selectedTemplateType}
          onChange={e => setSelectedTemplateType(e.target.value as TemplateType)}
        >
          {templateTypes.map(templateType => (
            <FormControlLabel
              key={templateType}
              label={templateType}
              value={templateType}
              control={<Radio />}
              id={templateType}
              name={templateType}
              checked={templateType === selectedTemplateType}
            />
          ))}
        </RadioGroup>
      </FormControl>

      <Select value={template} onChange={onChange} disabled={!editMode}>
        {getselectedTemplateType(selectedTemplateType).map(withLabel => (
          <MenuItem value={withLabel.template} key={withLabel.template}>
            {withLabel.label}
          </MenuItem>
        ))}
      </Select>
    </>
  );
};

export default BannerTemplateSelector;
