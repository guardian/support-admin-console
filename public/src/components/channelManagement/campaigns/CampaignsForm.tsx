import React, { useState } from 'react';
import { makeStyles, Theme, Typography } from '@material-ui/core';
import CampaignsSidebar from './CampaignsSidebar';
import CampaignsEditor from './CampaignsEditor';
import { unassignedCampaignLabel } from '../CampaignSelector';
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

export const unassignedCampaign = {
  name: unassignedCampaignLabel,
  nickname: 'TESTS NOT IN A CAMPAIGN',
  description: 'Tests not assigned to a campaign',
};

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
      const requiredCampaign = campaigns.find(c => c.name === testName);
      if (requiredCampaign != null) {
        return requiredCampaign;
      }
    }
    return selectedCampaign;
  };

  const onCampaignSelected = (name: string) => {
    if (unassignedCampaignLabel === name) {
      setSelectedCampaign(unassignedCampaign);
    } else {
      const requiredCampaign = campaigns.find(c => c.name === name);
      if (requiredCampaign != null) {
        setSelectedCampaign(requiredCampaign);
      }
    }
  };

  const currentCampaign = getSelectedCampaign();

  return (
    <div className={classes.body}>
      <div className={classes.leftCol}>
        <CampaignsSidebar
          campaigns={campaigns}
          createCampaign={createCampaign}
          newCampaignCreated={newCampaignCreated}
          selectedCampaign={currentCampaign}
          onCampaignSelected={onCampaignSelected}
          saveAllCampaigns={saveAllCampaigns}
        />
      </div>
      <div className={classes.rightCol}>
        {currentCampaign ? (
          <CampaignsEditor campaign={currentCampaign} />
        ) : (
          <div className={classes.viewTextContainer}>
            <Typography className={classes.viewText}>
              Select an existing campaign from the menu,
            </Typography>
            <Typography className={classes.viewText}>or create a new one</Typography>
          </div>
        )}
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
