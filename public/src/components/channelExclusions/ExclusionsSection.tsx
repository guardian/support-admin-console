import AddIcon from '@mui/icons-material/Add';
import { Button, Divider, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';
import { ExclusionRule as ExclusionRuleType, ExclusionSettings } from '../../models/exclusions';
import ExclusionRule from './ExclusionRule';
import { ChannelKey } from './util';

const Container = styled('div')({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
});

const SectionHeader = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  textTransform: 'capitalize',
}));

const AddRuleButton = styled(Button)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const AddRuleButtonBottom = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

const BottomDivider = styled(Divider)({
  marginTop: 'auto',
});

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
  const rules = data[channel]?.rules ?? [];

  const handleAddRule = () => {
    const currentRules = rules;
    const newRules = [...currentRules, { ...EMPTY_RULE }];
    const updatedSettings = {
      ...data,
      [channel]: { rules: newRules },
    };
    onUpdateSettings(updatedSettings);
  };

  return (
    <Container>
      <SectionHeader variant="h6">{label}</SectionHeader>

      <AddRuleButton
        variant="outlined"
        size="small"
        startIcon={<AddIcon />}
        onClick={handleAddRule}
        disabled={!canEdit}
      >
        Add {channel} rule
      </AddRuleButton>

      {rules.length === 0 && (
        <Typography variant="body2" color="textSecondary">
          No rules defined.
        </Typography>
      )}

      {rules.map((rule, i) => (
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

      {rules.length > 8 && (
        <AddRuleButtonBottom
          variant="outlined"
          size="small"
          startIcon={<AddIcon />}
          onClick={handleAddRule}
          disabled={!canEdit}
        >
          Add {channel} rule
        </AddRuleButtonBottom>
      )}

      <BottomDivider />
    </Container>
  );
};

export default ExclusionsSection;
