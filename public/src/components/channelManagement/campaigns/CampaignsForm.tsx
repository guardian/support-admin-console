import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  fetchFrontendSettings,
  FrontendSettingsType,
  sendCreateCampaignRequest,
  sendUpdateCampaignRequest,
} from '../../../utils/requests';
import CampaignsEditor from './CampaignsEditor';
import CampaignsSidebar from './CampaignsSidebar';
import { Campaign, unassignedCampaign } from './CampaignsTypes';

const ViewTextContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: '-50px',
});

const ViewText = styled(Typography)(({ theme }) => ({
  fontSize: theme.typography.pxToRem(16),
}));

const Body = styled(Box)({
  display: 'flex',
  overflow: 'hidden',
  flexGrow: 1,
  width: '100%',
  height: '100%',
});

const LeftCol = styled(Box)(({ theme }) => ({
  height: '100%',
  flexShrink: 0,
  overflowY: 'auto',
  background: 'white',
  paddingTop: theme.spacing(6),
  paddingLeft: theme.spacing(6),
  paddingRight: theme.spacing(6),
}));

const RightCol = styled(Box)({
  flexGrow: 1,
  display: 'flex',
  justifyContent: 'center',
});

const CampaignsForm: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const { campaignName } = useParams<{ campaignName?: string }>(); // querystring parameter
  const [selectedCampaignName, setSelectedCampaignName] = useState<string | undefined>();
  const previousCampaignNameRef = useRef<string | undefined>(campaignName);

  const fetchSettings = (): Promise<Campaign[]> => {
    return fetchFrontendSettings(FrontendSettingsType.Campaigns);
  };

  useEffect(() => {
    void fetchSettings().then(setCampaigns);
  }, []);

  useEffect(() => {
    if (campaignName != null && previousCampaignNameRef.current !== campaignName) {
      previousCampaignNameRef.current = campaignName;
      requestAnimationFrame(() => setSelectedCampaignName(campaignName));
    }
  }, [campaignName]);

  const createCampaign = (campaign: Campaign): void => {
    setCampaigns([...campaigns, campaign]);
    setSelectedCampaignName(campaign.name);
    sendCreateCampaignRequest(campaign).catch((error) =>
      alert(`Error creating campaign: ${error}`),
    );
  };

  const updateCampaign = (updatedCampaign: Campaign): void => {
    sendUpdateCampaignRequest(updatedCampaign)
      .then(() => fetchSettings())
      .then((c) => setCampaigns(c))
      .catch((error) => alert(`Error updating campaign ${updatedCampaign.name}: ${error}`));
  };

  let selectedCampaign = campaigns.find((c) => c.name === selectedCampaignName);
  if (selectedCampaignName === unassignedCampaign.name) {
    selectedCampaign = unassignedCampaign;
  }

  return (
    <Body>
      <LeftCol>
        <CampaignsSidebar
          campaigns={campaigns}
          createCampaign={createCampaign}
          selectedCampaign={selectedCampaign}
          onCampaignSelected={setSelectedCampaignName}
        />
      </LeftCol>
      <RightCol>
        {selectedCampaign ? (
          <CampaignsEditor
            key={selectedCampaign.name}
            campaign={selectedCampaign}
            updateCampaign={updateCampaign}
          />
        ) : (
          <ViewTextContainer>
            <ViewText>Select an existing campaign from the menu,</ViewText>
            <ViewText>or create a new one</ViewText>
          </ViewTextContainer>
        )}
      </RightCol>
    </Body>
  );
};

export default CampaignsForm;
