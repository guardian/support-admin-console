import React, { useEffect, useState } from 'react';

import { Theme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import { ExclusionRule, ExclusionSettings } from '../../models/exclusions';
import withS3Data, { DataFromServer, InnerProps } from '../../hocs/withS3Data';
import {
  fetchFrontendSettings,
  FrontendSettingsType,
  saveFrontendSettings,
} from '../../utils/requests';
import { hasPermission } from '../../utils/permissions';
import ChannelExclusionsSection from './ChannelExclusionsSection';

type ChannelKey = keyof ExclusionSettings;
type EditingRule = { channel: ChannelKey; index: number } | null;

const useStyles = makeStyles(({ spacing }: Theme) => ({
  wrapper: {
    display: 'flex',
    justifyContent: 'center',
  },
  form: {
    marginTop: spacing(4),
    marginLeft: spacing(4),
    marginRight: spacing(4),
    marginBottom: spacing(4),
    overflowY: 'auto',
    maxWidth: 1400,
    width: '100%',
  },
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    alignItems: 'stretch',
    gap: spacing(3),
  },
  gridItem: {
    height: '100%',
  },
}));

const CHANNEL_LABELS: Record<ChannelKey, string> = {
  epic: 'Epic',
  banner: 'Banner',
  gutterAsk: 'Gutter Ask',
  header: 'Header',
};

const EMPTY_RULE: ExclusionRule = { name: '' };

const canEdit = hasPermission(FrontendSettingsType.exclusionsSettings, 'Write');

const ExclusionsBoard: React.FC<InnerProps<ExclusionSettings>> = ({
  data,
  update,
  updateAndSendToS3,
  saving,
}) => {
  const classes = useStyles();
  const [settings, setSettings] = useState<ExclusionSettings>(data ?? {});
  const [initialSettings, setInitialSettings] = useState<ExclusionSettings>(data ?? {});
  const [editMode, setEditMode] = useState(false);
  const [editingRule, setEditingRule] = useState<EditingRule>(null);

  useEffect(() => {
    if (data && !editMode) {
      setSettings(data);
      setInitialSettings(data);
    }
  }, [data, editMode]);

  const handleSave = () => {
    updateAndSendToS3(settings);
    setEditMode(false);
    setEditingRule(null);
  };

  const handleCancel = () => {
    setSettings(initialSettings);
    update(initialSettings);
    setEditMode(false);
    setEditingRule(null);
  };

  const startEditingRule = (channel: ChannelKey, index: number) => {
    if (!editMode) {
      setInitialSettings(settings);
    }
    setEditMode(true);
    setEditingRule({ channel, index });
  };

  const applyChange = (updated: ExclusionSettings) => {
    setSettings(updated);
    update(updated);
  };

  const updateRule = (channel: ChannelKey, index: number, rule: ExclusionRule) => {
    const rules = [...(settings[channel]?.rules ?? [])];
    rules[index] = rule;
    applyChange({ ...settings, [channel]: { rules } });
  };

  const addRule = (channel: ChannelKey) => {
    const currentRules = settings[channel]?.rules ?? [];
    const rules = [...currentRules, { ...EMPTY_RULE }];
    applyChange({ ...settings, [channel]: { rules } });
    startEditingRule(channel, rules.length - 1);
  };

  const deleteRule = (channel: ChannelKey, index: number) => {
    const rules = (settings[channel]?.rules ?? []).filter((_, i) => i !== index);
    const updatedSettings = { ...settings, [channel]: { rules } };

    applyChange(updatedSettings);
    updateAndSendToS3(updatedSettings);
    setEditMode(false);
    setEditingRule(null);
  };

  return (
    <div className={classes.wrapper}>
      <form className={classes.form}>
        <div className={classes.gridContainer}>
          {(Object.keys(CHANNEL_LABELS) as ChannelKey[]).map((channel) => {
            const rules = settings[channel]?.rules ?? [];
            return (
              <div key={channel} className={classes.gridItem}>
                <ChannelExclusionsSection
                  channel={channel}
                  label={CHANNEL_LABELS[channel]}
                  rules={rules}
                  editMode={editMode}
                  canEdit={canEdit}
                  saving={saving}
                  editingRuleIndex={editingRule?.channel === channel ? editingRule.index : null}
                  onStartEditRule={(index) => startEditingRule(channel, index)}
                  onSaveEdit={handleSave}
                  onCancelEdit={handleCancel}
                  onUpdateRule={(index, rule) => updateRule(channel, index, rule)}
                  onDeleteRule={(index) => deleteRule(channel, index)}
                  onAddRule={() => addRule(channel)}
                />
              </div>
            );
          })}
        </div>
      </form>
    </div>
  );
};

const fetchSettings = (): Promise<DataFromServer<ExclusionSettings>> => {
  return fetchFrontendSettings<DataFromServer<ExclusionSettings>>(
    FrontendSettingsType.exclusionsSettings,
  );
};

const saveSettings = (data: DataFromServer<ExclusionSettings>): Promise<Response> => {
  return saveFrontendSettings(FrontendSettingsType.exclusionsSettings, data);
};

export default withS3Data<ExclusionSettings>(ExclusionsBoard, fetchSettings, saveSettings);
