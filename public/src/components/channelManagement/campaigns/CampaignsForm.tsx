import React, { useEffect, useState } from 'react';
import { makeStyles, Theme, Typography } from '@material-ui/core';
import CampaignsSidebar from './CampaignsSidebar';
import CampaignsEditor from './CampaignsEditor';
import { useParams } from 'react-router-dom';

import {
  fetchFrontendSettings,
  FrontendSettingsType,
  sendCreateCampaignRequest,
  sendUpdateCampaignRequest,
} from '../../../utils/requests';

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
  notes?: string[];
  isActive?: boolean;
}
export type Campaigns = Campaign[];

export const unassignedCampaign = {
  name: 'NOT_IN_CAMPAIGN',
  nickname: 'TESTS NOT IN A CAMPAIGN',
  description: 'Tests not assigned to a campaign',
};

const CampaignsForm: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | undefined>();
  const { testName: campaignName } = useParams<{ testName?: string }>();
  const classes = useStyles();

  const fetchSettings = (): Promise<Campaign[]> => {
    return fetchFrontendSettings(FrontendSettingsType.campaigns);
  };

  useEffect(() => {
    fetchSettings().then(setCampaigns);
  }, []);

  useEffect(() => {
    if (campaignName != null) {
      const requiredCampaign = campaigns.find(c => c.name === campaignName);
      if (requiredCampaign != null) {
        setSelectedCampaign(requiredCampaign);
      }
    }
  }, [campaignName, campaigns]);

  const createCampaign = (campaign: Campaign): void => {
    setCampaigns([...campaigns, campaign]);
    setSelectedCampaign(campaign);
    sendCreateCampaignRequest(campaign).catch(error => alert(`Error creating campaign: ${error}`));
  };

  const updateCampaign = (updatedCampaign: Campaign): void => {
    sendUpdateCampaignRequest(updatedCampaign)
      .then(() => fetchSettings())
      .then(c => setCampaigns(c))
      .then(() => onCampaignSelected(updatedCampaign.name))
      .catch(error => alert(`Error updating campaign ${updatedCampaign.name}: ${error}`));
  };

  const onCampaignSelected = (name: string) => {
    if (unassignedCampaign.name === name) {
      setSelectedCampaign(unassignedCampaign);
    } else {
      const requiredCampaign = campaigns.find(c => c.name === name);
      if (requiredCampaign != null) {
        setSelectedCampaign(requiredCampaign);
      }
    }
  };

  return (
    <div className={classes.body}>
      <div className={classes.leftCol}>
        <CampaignsSidebar
          campaigns={campaigns}
          createCampaign={createCampaign}
          selectedCampaign={selectedCampaign}
          onCampaignSelected={onCampaignSelected}
        />
      </div>
      <div className={classes.rightCol}>
        {selectedCampaign ? (
          <CampaignsEditor
            key={selectedCampaign.name}
            campaign={selectedCampaign}
            updateCampaign={updateCampaign}
          />
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

export default CampaignsForm;
