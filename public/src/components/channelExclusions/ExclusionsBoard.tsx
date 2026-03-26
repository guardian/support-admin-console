import React, { useState } from 'react';

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
import ExclusionsTopBar from './ExclusionsTopBar';
import ChannelExclusionsSection from './ChannelExclusionsSection';

type ChannelKey = keyof ExclusionSettings;

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
    gap: spacing(3),
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
  sendToS3,
  saving,
}) => {
  const classes = useStyles();
  const [settings, setSettings] = useState<ExclusionSettings>(data ?? {});
  const [editMode, setEditMode] = useState(false);

  const handleEdit = () => setEditMode(true);

  const handleSave = () => {
    sendToS3();
    setEditMode(false);
  };

  const handleCancel = () => {
    setSettings(data ?? {});
    update(data ?? {});
    setEditMode(false);
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
    const rules = [...(settings[channel]?.rules ?? []), { ...EMPTY_RULE }];
    applyChange({ ...settings, [channel]: { rules } });
  };

  const deleteRule = (channel: ChannelKey, index: number) => {
    const rules = (settings[channel]?.rules ?? []).filter((_, i) => i !== index);
    applyChange({ ...settings, [channel]: { rules } });
  };

  return (
    <div className={classes.wrapper}>
      <form className={classes.form}>
        <ExclusionsTopBar
          editMode={editMode}
          canEdit={canEdit}
          saving={saving}
          onEdit={handleEdit}
          onSave={handleSave}
          onCancel={handleCancel}
        />

        <div className={classes.gridContainer}>
          {(Object.keys(CHANNEL_LABELS) as ChannelKey[]).map((channel) => {
            const rules = settings[channel]?.rules ?? [];
            return (
              <ChannelExclusionsSection
                key={channel}
                channel={channel}
                label={CHANNEL_LABELS[channel]}
                rules={rules}
                editMode={editMode}
                onUpdateRule={(index, rule) => updateRule(channel, index, rule)}
                onDeleteRule={(index) => deleteRule(channel, index)}
                onAddRule={() => addRule(channel)}
              />
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
