import React from 'react';
import { Button, Divider, Typography, Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';
import AddIcon from '@mui/icons-material/Add';
import { ExclusionRule as ExclusionRuleType, ExclusionSettings } from '../../models/exclusions';
import { ChannelKey } from './util';
import ExclusionRule from './ExclusionRule';

const useStyles = makeStyles(({ spacing }: Theme) => ({
  container: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  sectionHeader: {
    marginBottom: spacing(2),
    textTransform: 'capitalize',
  },
  addRuleButton: {
    marginBottom: spacing(2),
  },
  bottomDivider: {
    marginTop: 'auto',
  },
}));

interface ExclusionsSectionProps {
  channel: ChannelKey;
  label: string;
  data: ExclusionSettings;
  canEdit: boolean;
  saving: boolean;
  onUpdateSettings: (settings: ExclusionSettings) => void;
  onPersistSettings: (settings: ExclusionSettings) => void;
}

const EMPTY_RULE: ExclusionRuleType = { name: '' };

const ExclusionsSection: React.FC<ExclusionsSectionProps> = ({
  channel,
  label,
  data,
  canEdit,
  saving,
  onUpdateSettings,
  onPersistSettings,
}) => {
  const classes = useStyles();

  const handleAddRule = () => {
    const currentRules = data[channel]?.rules ?? [];
    const newRules = [...currentRules, { ...EMPTY_RULE }];
    const updatedSettings = {
      ...data,
      [channel]: { rules: newRules },
    };
    onUpdateSettings(updatedSettings);
  };

  return (
    <div className={classes.container}>
      <Typography variant="h6" className={classes.sectionHeader}>
        {label}
      </Typography>

      <Button
        className={classes.addRuleButton}
        variant="outlined"
        size="small"
        startIcon={<AddIcon />}
        onClick={handleAddRule}
        disabled={!canEdit}
      >
        Add {channel} rule
      </Button>

      {(data[channel]?.rules ?? []).length === 0 && (
        <Typography variant="body2" color="textSecondary">
          No rules defined.
        </Typography>
      )}

      {(data[channel]?.rules ?? []).map((rule, i) => (
        <ExclusionRule
          key={i}
          channel={channel}
          label={label}
          data={data}
          index={i}
          rule={rule}
          canEdit={canEdit}
          saving={saving}
          onUpdateSettings={onUpdateSettings}
          onPersistSettings={onPersistSettings}
        />
      ))}

      <Divider className={classes.bottomDivider} sx={{ mt: 3 }} />
    </div>
  );
};

export default ExclusionsSection;
