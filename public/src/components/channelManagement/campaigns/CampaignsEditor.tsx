import React from 'react';
import { makeStyles, Theme } from '@material-ui/core';
import {
  fetchFrontendSettings,
  FrontendSettingsType,
  saveFrontendSettings,
} from '../../../utils/requests';
import Button from '@material-ui/core/Button';
import withS3Data, { DataFromServer, InnerProps } from '../../../hocs/withS3Data';
import NewCampaignButton from './NewCampaignButton';
import DeleteCampaignButton from './DeleteCampaignButton';

const useStyles = makeStyles(({ palette }: Theme) => ({
  container: {
    margin: '30px',
    maxWidth: '500px',
    display: 'flex',
    flexDirection: 'column',
    '& > * + *': {
      marginTop: '5px',
    },
  },
  campaign: {
    display: 'flex',
    alignItems: 'center',
    '& > * + *': {
      marginLeft: 'auto',
    },
    borderRadius: '4px',
    border: `1px solid ${palette.grey[700]}`,
    padding: '0 12px',
    fontWeight: 500,
  },
}));

export interface Campaign {
  name: string;
}
type Campaigns = Campaign[];

const CampaignsEditor: React.FC<InnerProps<Campaigns>> = ({
  data: campaigns,
  setData: setCampaigns,
  saveData: saveCampaigns,
}: InnerProps<Campaigns>) => {
  const classes = useStyles();

  const createCampaign = (name: string): void => {
    setCampaigns([...campaigns, { name }]);
  };

  const deleteCampaign = (name: string): void => {
    setCampaigns(campaigns.filter(c => c.name !== name));
  };

  return (
    <div className={classes.container}>
      <NewCampaignButton
        existingNames={campaigns.map(c => c.name)}
        createCampaign={createCampaign}
      />

      {campaigns.map(campaign => (
        <div className={classes.campaign} key={`campaign-${campaign.name}`}>
          <div>{campaign.name}</div>
          <DeleteCampaignButton onDelete={(): void => deleteCampaign(campaign.name)} />
        </div>
      ))}

      <Button
        onClick={saveCampaigns}
        color="primary"
        variant="contained"
        size="large"
        fullWidth={false}
      >
        Submit
      </Button>
    </div>
  );
};

const fetchSettings = (): Promise<DataFromServer<Campaigns>> =>
  fetchFrontendSettings(FrontendSettingsType.campaigns);
const saveSettings = (data: DataFromServer<Campaigns>): Promise<Response> =>
  saveFrontendSettings(FrontendSettingsType.campaigns, data);

export default withS3Data<Campaigns>(CampaignsEditor, fetchSettings, saveSettings);
