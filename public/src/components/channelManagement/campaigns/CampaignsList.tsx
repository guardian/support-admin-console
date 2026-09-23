import { Box, Button, List, ListItem, Typography } from '@mui/material';
import { red } from '@mui/material/colors';
import { styled } from '@mui/material/styles';
import React from 'react';
import { Campaign, Campaigns, unassignedCampaign } from './CampaignsTypes';

const Container = styled(Box)({
  marginTop: '16px',
});

const StyledList = styled(List)({
  padding: 0,
  width: '100%',
});

const StyledListItem = styled(ListItem)({
  margin: 0,
  padding: 0,
  width: '100%',
});

const Text = styled(Typography)({
  fontSize: '12px',
  fontWeight: 500,
  textTransform: 'uppercase',
  letterSpacing: '1px',
});

const CampaignButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'isActive' && prop !== 'isCurrent',
})<{ isActive: boolean; isCurrent: boolean }>(({ theme, isActive, isCurrent }) => {
  const base = {
    position: 'relative' as const,
    height: '50px',
    width: '290px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: 'white',
    borderRadius: '4px',
    padding: '0 12px',
    marginBottom: '4px',
  };
  const accentColour = isActive ? red[500] : theme.palette.grey[700];
  if (isCurrent) {
    return {
      ...base,
      background: accentColour,
      color: 'white',
      '&:hover': { background: accentColour, color: 'white' },
    };
  }
  return {
    ...base,
    border: `1px solid ${accentColour}`,
    '&:hover': { background: accentColour, color: 'white' },
  };
});

interface CampaignsListProps {
  campaigns: Campaigns;
  campaignSearch: string;
  selectedCampaign?: Campaign;
  onCampaignSelected: (testName: string) => void;
}

const CampaignsList = ({
  campaigns,
  campaignSearch,
  selectedCampaign,
  onCampaignSelected,
}: CampaignsListProps): React.ReactElement => {
  const getCampaignButtonState = (campaign: Campaign | undefined) => {
    const isActive = campaign?.isActive ?? true;
    const isCurrent = selectedCampaign != null ? campaign?.name === selectedCampaign.name : false;
    return { isActive, isCurrent };
  };

  const filterCampaigns = (campaignArray: Campaigns) => {
    return campaignArray.filter((c) => {
      if (!campaignSearch) {
        return true;
      } else if (c.nickname.includes(campaignSearch)) {
        return true;
      } else if (c.name.includes(campaignSearch)) {
        return true;
      }
      return false;
    });
  };

  const sortCampaigns = (campaignArray: Campaigns) => {
    campaignArray.sort((a, b) => {
      const A = a.nickname || a.name;
      const B = b.nickname || b.name;

      if (A < B) {
        return -1;
      }
      if (B < A) {
        return 1;
      }
      return 0;
    });
    return campaignArray;
  };

  const sortedCampaigns = sortCampaigns(filterCampaigns(campaigns));

  return (
    <Container>
      <StyledList>
        {sortedCampaigns.map((campaign) => (
          <StyledListItem key={campaign.name}>
            <CampaignButton
              key={`${campaign.name}-button`}
              {...getCampaignButtonState(campaign)}
              variant="outlined"
              onClick={(): void => onCampaignSelected(campaign.name)}
            >
              <Text>{campaign.nickname ? campaign.nickname : campaign.name}</Text>
            </CampaignButton>
          </StyledListItem>
        ))}
        <StyledListItem key={unassignedCampaign.name}>
          <CampaignButton
            key={`${unassignedCampaign.name}-button`}
            {...getCampaignButtonState(unassignedCampaign)}
            variant="outlined"
            onClick={(): void => onCampaignSelected(unassignedCampaign.name)}
          >
            <Text>{unassignedCampaign.nickname}</Text>
          </CampaignButton>
        </StyledListItem>
      </StyledList>
    </Container>
  );
};

export default CampaignsList;
