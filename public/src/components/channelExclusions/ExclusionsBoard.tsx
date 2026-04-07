import React from 'react';
import withS3Data, { DataFromServer, InnerProps } from '../../hocs/withS3Data';
import {
  fetchFrontendSettings,
  FrontendSettingsType,
  saveFrontendSettings,
} from '../../utils/requests';
import { ExclusionSettings } from '../../models/exclusions';

const ExclusionsBoard: React.FC<InnerProps<ExclusionSettings>> = ({ data }) => {
  console.log('ExclusionsBoard data:', data);
  return <div>Exclusions board placeholder</div>;
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
