import React, { useState } from 'react';
import { makeStyles, Theme } from '@material-ui/core';
import CampaignsSidebar from './CampaignsSidebar';
import CampaignsEditor from './CampaignsEditor';
import { useParams } from 'react-router-dom';

import {
  fetchFrontendSettings,
  FrontendSettingsType,
  saveFrontendSettings,
} from '../../../utils/requests';

import withS3Data, { DataFromServer, InnerProps } from '../../../hocs/withS3Data';

const useStyles = makeStyles(({ spacing, typography }: Theme) => ({
  viewTextContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '-50px',
  },
  viewText: {
    fontSize: typography.pxToRem(16),
  },
  body: {
    display: 'flex',
    overflow: 'hidden',
    flexGrow: 1,
    width: '100%',
    height: '100%',
  },
  leftCol: {
    height: '100%',
    flexShrink: 0,
    overflowY: 'auto',
    background: 'white',
    paddingTop: spacing(6),
    paddingLeft: spacing(6),
    paddingRight: spacing(6),
  },
  rightCol: {
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'center',
  },
}));

export interface Campaign {
  name: string;
  nickname: string;
  description?: string;
}
export type Campaigns = Campaign[];

const CampaignsForm: React.FC<InnerProps<Campaigns>> = ({
  data: campaigns,
  setData: setCampaigns,
  saveData: saveCampaigns,
}: InnerProps<Campaigns>) => {
  const classes = useStyles();
  const { testName } = useParams<{ testName?: string }>();

  const createCampaign = (campaign: Campaign): void => {
    setCampaigns([...campaigns, campaign]);
    setNewCampaignCreated(true);
    setSelectedCampaign(campaign);
  };

  const saveAllCampaigns = (): void => {
    saveCampaigns();
    setNewCampaignCreated(false);
  };

  const [newCampaignCreated, setNewCampaignCreated] = useState(false);

  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | undefined>();

  const getSelectedCampaign = (): Campaign | undefined => {
    if (selectedCampaign == null && testName != null) {
      const requiredCampaign = campaigns.filter(c => c.name === testName);
      if (requiredCampaign[0] != null) {
        return requiredCampaign[0];
      }
    }
    return selectedCampaign;
  };

  const onCampaignSelected = (name: string) => {
    const requiredCampaign = campaigns.filter(c => c.name === name);
    if (requiredCampaign[0] != null) {
      setSelectedCampaign(requiredCampaign[0]);
    }
  };

  return (
    <div className={classes.body}>
      <div className={classes.leftCol}>
        <CampaignsSidebar
          campaigns={campaigns}
          createCampaign={createCampaign}
          newCampaignCreated={newCampaignCreated}
          selectedCampaign={getSelectedCampaign()}
          onCampaignSelected={onCampaignSelected}
          saveAllCampaigns={saveAllCampaigns}
        />
      </div>

      <div className={classes.rightCol}>
        <CampaignsEditor
          campaign={getSelectedCampaign()}
          existingNames={campaigns.map(c => c.name)}
          existingNicknames={campaigns.map(c => c.nickname)}
        />
      </div>
    </div>
  );
};

const fetchSettings = (): Promise<DataFromServer<Campaigns>> => {
  return fetchFrontendSettings(FrontendSettingsType.campaigns);
};

const saveSettings = (data: DataFromServer<Campaigns>): Promise<Response> => {
  return saveFrontendSettings(FrontendSettingsType.campaigns, data);
};

export default withS3Data<Campaigns>(CampaignsForm, fetchSettings, saveSettings);
