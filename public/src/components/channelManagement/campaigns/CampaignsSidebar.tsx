import { Box, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useState } from 'react';
import CampaignsList from './CampaignsList';
import { Campaign, Campaigns } from './CampaignsTypes';
import NewCampaignButton from './NewCampaignButton';

const Root = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  paddingLeft: '32px',
});

const ListsContainer = styled(Box)({
  position: 'relative',
  display: 'flex',
  marginTop: '8px',
});

const SearchField = styled(TextField)({
  marginTop: '8px',
});

const ButtonsContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  marginBottom: '10px',
});

interface CampaignsSidebarProps {
  campaigns: Campaigns;
  selectedCampaign?: Campaign;
  createCampaign: (campaign: Campaign) => void;
  onCampaignSelected: (campaignName: string) => void;
}

function CampaignsSidebar({
  campaigns,
  createCampaign,
  selectedCampaign,
  onCampaignSelected,
}: CampaignsSidebarProps): React.ReactElement {
  const [campaignSearch, setCampaignSearch] = useState('');

  const searchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCampaignSearch(e.target.value.toUpperCase());
  };

  const searchInputNative = (event: React.FormEvent<HTMLDivElement>) => {
    const target = event.target;
    if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) {
      setCampaignSearch(target.value.toUpperCase());
    }
  };

  return (
    <Root>
      <ButtonsContainer>
        <NewCampaignButton
          existingNames={campaigns.map((c) => c.name)}
          existingNicknames={campaigns.map((c) => c.nickname || '')}
          createCampaign={createCampaign}
        />
        <SearchField
          label="Filter campaigns"
          type="search"
          variant="outlined"
          onInput={searchInputNative}
          onChange={searchInput}
        />
      </ButtonsContainer>
      <ListsContainer>
        <CampaignsList
          campaigns={campaigns}
          campaignSearch={campaignSearch}
          selectedCampaign={selectedCampaign}
          onCampaignSelected={onCampaignSelected}
        />
      </ListsContainer>
    </Root>
  );
}

export default CampaignsSidebar;
