import React, { useEffect, useState } from 'react';

import { Theme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import { useForm } from 'react-hook-form';
import { ExclusionRule, ExclusionSettings } from '../../models/exclusions';
import withS3Data, { DataFromServer, InnerProps } from '../../hocs/withS3Data';
import {
  fetchFrontendSettings,
  FrontendSettingsType,
  saveFrontendSettings,
} from '../../utils/requests';
import { hasPermission } from '../../utils/permissions';
import ChannelExclusionsSection from './ChannelExclusionsSection';
import {
  ChannelKey,
  getIndexesForChannel,
  makeRuleKey,
  remapRuleKeysAfterRemoval,
  validateRule,
} from './util';

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
  const { watch, getValues, reset } = useForm<ExclusionSettings>({
    defaultValues: data ?? {},
  });
  const settings = watch();
  const [savedSettings, setSavedSettings] = useState<ExclusionSettings>(data ?? {});
  const [editingRules, setEditingRules] = useState<Set<string>>(new Set());
  const [unsavedRules, setUnsavedRules] = useState<Set<string>>(new Set());

  const editMode = editingRules.size > 0;

  useEffect(() => {
    if (data && !editMode) {
      reset(data);
      setSavedSettings(data);
    }
  }, [data, editMode, reset]);

  const applyChange = (updated: ExclusionSettings) => {
    reset(updated);
    update(updated);
  };

  const startEditingRule = (channel: ChannelKey, index: number) => {
    const ruleKey = makeRuleKey(channel, index);
    const nextEditingRules = new Set(editingRules);
    nextEditingRules.add(ruleKey);
    setEditingRules(nextEditingRules);
  };

  const handleSaveRule = (channel: ChannelKey, index: number) => {
    const currentSettings = getValues();
    const ruleToSave = currentSettings[channel]?.rules?.[index];

    if (!ruleToSave) {
      return;
    }

    const validationError = validateRule(ruleToSave, CHANNEL_LABELS[channel], index);

    if (validationError) {
      alert(validationError);
      return;
    }

    const persistedChannelRules = [...(savedSettings[channel]?.rules ?? [])];

    if (index >= persistedChannelRules.length) {
      persistedChannelRules.push(ruleToSave);
    } else {
      persistedChannelRules[index] = ruleToSave;
    }

    const nextSavedSettings = {
      ...savedSettings,
      [channel]: { rules: persistedChannelRules },
    };

    setSavedSettings(nextSavedSettings);
    updateAndSendToS3(nextSavedSettings);

    const ruleKey = makeRuleKey(channel, index);
    const nextUnsavedRules = new Set(unsavedRules);
    nextUnsavedRules.delete(ruleKey);
    setUnsavedRules(nextUnsavedRules);

    const nextEditingRules = new Set(editingRules);
    nextEditingRules.delete(ruleKey);
    setEditingRules(nextEditingRules);
  };

  const handleCancelRule = (channel: ChannelKey, index: number) => {
    const currentSettings = getValues();
    const currentRules = [...(currentSettings[channel]?.rules ?? [])];
    const persistedRules = savedSettings[channel]?.rules ?? [];

    if (index >= persistedRules.length) {
      currentRules.splice(index, 1);
    } else {
      currentRules[index] = persistedRules[index];
    }

    const updatedSettings = {
      ...currentSettings,
      [channel]: { rules: currentRules },
    };

    applyChange(updatedSettings);

    if (index >= persistedRules.length) {
      setUnsavedRules(remapRuleKeysAfterRemoval(unsavedRules, channel, index));
      setEditingRules(remapRuleKeysAfterRemoval(editingRules, channel, index));
      return;
    }

    const ruleKey = makeRuleKey(channel, index);
    const nextUnsavedRules = new Set(unsavedRules);
    nextUnsavedRules.delete(ruleKey);
    setUnsavedRules(nextUnsavedRules);

    const nextEditingRules = new Set(editingRules);
    nextEditingRules.delete(ruleKey);
    setEditingRules(nextEditingRules);
  };

  const updateRule = (channel: ChannelKey, index: number, rule: ExclusionRule) => {
    const rules = [...(settings[channel]?.rules ?? [])];
    rules[index] = rule;
    applyChange({ ...settings, [channel]: { rules } });

    const ruleKey = makeRuleKey(channel, index);
    const nextUnsavedRules = new Set(unsavedRules);
    nextUnsavedRules.add(ruleKey);
    setUnsavedRules(nextUnsavedRules);

    const nextEditingRules = new Set(editingRules);
    nextEditingRules.add(ruleKey);
    setEditingRules(nextEditingRules);
  };

  const addRule = (channel: ChannelKey) => {
    const currentRules = getValues(channel)?.rules ?? [];
    const rules = [...currentRules, { ...EMPTY_RULE }];
    applyChange({ ...getValues(), [channel]: { rules } });

    const index = rules.length - 1;
    const ruleKey = makeRuleKey(channel, index);

    const nextEditingRules = new Set(editingRules);
    nextEditingRules.add(ruleKey);
    setEditingRules(nextEditingRules);

    const nextUnsavedRules = new Set(unsavedRules);
    nextUnsavedRules.add(ruleKey);
    setUnsavedRules(nextUnsavedRules);
  };

  const deleteRule = (channel: ChannelKey, index: number) => {
    const currentSettings = getValues();
    const rules = (currentSettings[channel]?.rules ?? []).filter((_, i) => i !== index);
    const updatedSettings = { ...currentSettings, [channel]: { rules } };

    applyChange(updatedSettings);

    const persistedRules = savedSettings[channel]?.rules ?? [];
    if (index < persistedRules.length) {
      const nextPersistedRules = persistedRules.filter((_, i) => i !== index);
      const nextSavedSettings = { ...savedSettings, [channel]: { rules: nextPersistedRules } };
      setSavedSettings(nextSavedSettings);
      updateAndSendToS3(nextSavedSettings);
    }

    setUnsavedRules(remapRuleKeysAfterRemoval(unsavedRules, channel, index));
    setEditingRules(remapRuleKeysAfterRemoval(editingRules, channel, index));
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
                  editingRuleIndexes={getIndexesForChannel(editingRules, channel)}
                  unsavedRuleIndexes={getIndexesForChannel(unsavedRules, channel)}
                  onStartEditRule={(index) => startEditingRule(channel, index)}
                  onSaveEdit={(index) => handleSaveRule(channel, index)}
                  onCancelEdit={(index) => handleCancelRule(channel, index)}
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
