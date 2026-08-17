import { Typography } from '@mui/material';
import React from 'react';
import { ChoiceCardsSettings } from '../../models/choiceCards';
import {
  ChoiceCardsDefaultsProfile,
  DefaultChoiceCardsSettings,
} from '../../models/defaultChoiceCards';
import { ProfileEditor } from './ProfileEditor';
import { useStyles } from './styles';
import { buildLabel, ChannelKey, PROFILE_ORDER } from './utils';

interface SectionProps {
  channel: ChannelKey;
  data: DefaultChoiceCardsSettings;
  disabled: boolean;
  onChange: (
    channel: ChannelKey,
    profile: ChoiceCardsDefaultsProfile,
    settings: ChoiceCardsSettings,
  ) => void;
  onValidationChange: (
    channel: ChannelKey,
    profile: ChoiceCardsDefaultsProfile,
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
  const classes = useStyles();
  const channelSettings = data[channel] as Record<ChoiceCardsDefaultsProfile, ChoiceCardsSettings>;

  return (
    <section className={classes.section}>
      <div className={classes.sectionHeading}>
        <Typography variant="h4">
          {channel === 'epic' ? 'Epic defaults' : 'Banner defaults'}
        </Typography>
        <Typography variant="body2" className={classes.helperText}>
          {`Manage default choice cards for ${channel} variants that do not define custom choice cards.`}
        </Typography>
      </div>
      <div className={classes.sectionGrid}>
        {PROFILE_ORDER.map((profile) => (
          <ProfileEditor
            key={`${channel}-${profile}`}
            label={buildLabel(profile)}
            idPrefix={`${channel}-${profile}`}
            settings={channelSettings[profile]}
            disabled={disabled}
            onChange={(settings) => onChange(channel, profile, settings)}
            onValidationChange={(isValid) => onValidationChange(channel, profile, isValid)}
          />
        ))}
      </div>
    </section>
  );
};
