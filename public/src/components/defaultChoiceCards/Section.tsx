import { Typography } from '@mui/material';
import React from 'react';
import { ChoiceCardsSettings } from '../../models/choiceCards';
import {
  ChoiceCardsDefaultsRegion,
  DefaultChoiceCardsSettings,
} from '../../models/defaultChoiceCards';
import { buildLabel, ChannelKey, REGION_ORDER } from '../../utils/defaultChoiceCards';
import { CardsPerRegionEditor } from './CardsPerRegionEditor';
import { HelperText, SectionGrid, SectionHeading, Section as StyledSection } from './styles';

interface SectionProps {
  channel: ChannelKey;
  data: DefaultChoiceCardsSettings;
  disabled: boolean;
  onChange: (
    channel: ChannelKey,
    profile: ChoiceCardsDefaultsRegion,
    settings: ChoiceCardsSettings,
  ) => void;
  onValidationChange: (
    channel: ChannelKey,
    profile: ChoiceCardsDefaultsRegion,
    isValid: boolean,
  ) => void;
}

export const Section: React.FC<SectionProps> = ({
  channel,
  data,
  disabled,
  onChange,
  onValidationChange,
}) => {
  const channelSettings = data[channel] as Record<ChoiceCardsDefaultsRegion, ChoiceCardsSettings>;

  return (
    <StyledSection>
      <SectionHeading>
        <Typography variant="h4">
          {channel === 'epic' ? 'Epic defaults' : 'Banner defaults'}
        </Typography>
        <HelperText variant="body2">
          {`Manage default choice cards for ${channel} variants that do not define custom choice cards.`}
        </HelperText>
      </SectionHeading>
      <SectionGrid>
        {REGION_ORDER.map((region) => (
          <CardsPerRegionEditor
            key={`${channel}-${region}`}
            label={buildLabel(region)}
            idPrefix={`${channel}-${region}`}
            settings={channelSettings[region]}
            disabled={disabled}
            onChange={(settings) => onChange(channel, region, settings)}
            onValidationChange={(isValid) => onValidationChange(channel, region, isValid)}
          />
        ))}
      </SectionGrid>
    </StyledSection>
  );
};
