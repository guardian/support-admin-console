import React from 'react';
import withS3Data, { InnerProps } from '../hocs/withS3Data';
import {
  fetchSupportFrontendSettings,
  saveSupportFrontendSettings,
  SupportFrontendSettingsType,
} from '../utils/requests';

type ProductName = 'guardianWeekly' | 'paper';

type DefaultPromos = {
  [key in ProductName]: string[];
};

const DefaultPromos: React.FC<InnerProps<DefaultPromos>> = ({
  data,
  setData,
  saveData,
  saving,
}: InnerProps<DefaultPromos>) => {
  return <div>{JSON.stringify(data)}</div>;
};

export default withS3Data<DefaultPromos>(
  DefaultPromos,
  () => fetchSupportFrontendSettings(SupportFrontendSettingsType.defaultPromos),
  data => saveSupportFrontendSettings(SupportFrontendSettingsType.defaultPromos, data),
);
