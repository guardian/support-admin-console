import React from 'react';

import { Theme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import { ExclusionSettings } from '../../models/exclusions';
import withS3Data, { DataFromServer, InnerProps } from '../../hocs/withS3Data';
import {
  fetchFrontendSettings,
  FrontendSettingsType,
  saveFrontendSettings,
} from '../../utils/requests';
import { hasPermission } from '../../utils/permissions';
import ExclusionsSection from './ExclusionsSection';
import { ChannelKey } from './util';

const useStyles = makeStyles(({ spacing }: Theme) => ({
  wrapper: {
    display: 'flex',
    justifyContent: 'center',
  },
  gridContainer: {
    marginTop: spacing(4),
    marginLeft: spacing(4),
    marginRight: spacing(4),
    marginBottom: spacing(4),
    overflowY: 'auto',
    maxWidth: 1400,
    width: '100%',
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

const canEdit = hasPermission(FrontendSettingsType.exclusionsSettings, 'Write');

const ExclusionsBoard: React.FC<InnerProps<ExclusionSettings>> = ({
  data,
  update,
  updateAndSendToS3,
  saving,
}) => {
  const classes = useStyles();

  const handleUpdateSettings = (updatedSettings: ExclusionSettings) => {
    update(updatedSettings);
  };

  const handlePersistSettings = (updatedSettings: ExclusionSettings) => {
    updateAndSendToS3(updatedSettings);
  };

  return (
    <div className={classes.wrapper}>
      <div className={classes.gridContainer}>
        {(Object.keys(CHANNEL_LABELS) as ChannelKey[]).map((channel) => {
          return (
            <div key={channel} className={classes.gridItem}>
              <ExclusionsSection
                channel={channel}
                label={CHANNEL_LABELS[channel]}
                data={data ?? {}}
                canEdit={canEdit}
                saving={saving}
                onUpdateSettings={handleUpdateSettings}
                onPersistSettings={handlePersistSettings}
              />
            </div>
          );
        })}
      </div>
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
