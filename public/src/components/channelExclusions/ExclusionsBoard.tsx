import { styled } from '@mui/material/styles';
import React from 'react';
import withS3Data, { DataFromServer, InnerProps } from '../../hocs/withS3Data';
import { ExclusionSettings } from '../../models/exclusions';
import { hasPermission } from '../../utils/permissions';
import {
  fetchFrontendSettings,
  FrontendSettingsType,
  saveFrontendSettings,
} from '../../utils/requests';
import ExclusionsSection from './ExclusionsSection';
import { ChannelKey } from './util';

const Wrapper = styled('div')({
  display: 'flex',
  justifyContent: 'center',
});

const GridContainer = styled('div')(({ theme }) => ({
  marginTop: theme.spacing(4),
  marginLeft: theme.spacing(4),
  marginRight: theme.spacing(4),
  marginBottom: theme.spacing(4),
  overflowY: 'auto',
  maxWidth: 1400,
  width: '100%',
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  alignItems: 'stretch',
  gap: theme.spacing(3),
}));

const GridItem = styled('div')({
  height: '100%',
});

const CHANNEL_LABELS: Record<ChannelKey, string> = {
  epic: 'Epic',
  banner: 'Banner',
  gutterAsk: 'Gutter Ask',
  header: 'Header',
};

const canEdit = hasPermission(FrontendSettingsType.ExclusionsSettings, 'Write');

const ExclusionsBoard: React.FC<InnerProps<ExclusionSettings>> = ({
  data,
  update,
  updateAndSendToS3,
  saving,
}) => {
  const handleUpdateSettings = (updatedSettings: ExclusionSettings) => {
    update(updatedSettings);
  };

  const handlePersistSettings = (updatedSettings: ExclusionSettings) => {
    updateAndSendToS3(updatedSettings);
  };

  return (
    <Wrapper>
      <GridContainer>
        {(Object.keys(CHANNEL_LABELS) as ChannelKey[]).map((channel) => {
          return (
            <GridItem key={channel}>
              <ExclusionsSection
                channel={channel}
                label={CHANNEL_LABELS[channel]}
                data={data}
                canEdit={canEdit}
                saving={saving}
                onUpdateSettings={handleUpdateSettings}
                onPersistSettings={handlePersistSettings}
              />
            </GridItem>
          );
        })}
      </GridContainer>
    </Wrapper>
  );
};

const fetchSettings = (): Promise<DataFromServer<ExclusionSettings>> => {
  return fetchFrontendSettings<DataFromServer<ExclusionSettings>>(
    FrontendSettingsType.ExclusionsSettings,
  );
};

const saveSettings = (data: DataFromServer<ExclusionSettings>): Promise<Response> => {
  return saveFrontendSettings(FrontendSettingsType.ExclusionsSettings, data);
};

export default withS3Data<ExclusionSettings>(ExclusionsBoard, fetchSettings, saveSettings);
