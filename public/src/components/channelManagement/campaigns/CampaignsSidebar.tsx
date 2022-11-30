import React, { useState } from 'react';
import { makeStyles, TextField } from '@material-ui/core';
import { Campaigns, Campaign } from './CampaignsForm';
import NewCampaignButton from './NewCampaignButton';
import CampaignsList from './CampaignsList';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: '32px',
  },
  listsContainer: {
    position: 'relative',
    display: 'flex',
    marginTop: '8px',
  },
  searchField: {
    marginTop: '8px',
  },
  buttonsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginBottom: '10px',
  },
}));

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
  const classes = useStyles();

  const [campaignSearch, setCampaignSearch] = useState('');

  const searchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e && e.target) {
      setCampaignSearch(e.target.value.toUpperCase());
    }
  };

  return (
    <div className={classes.root}>
      <div className={classes.buttonsContainer}>
        <NewCampaignButton
          existingNames={campaigns.map(c => c.name)}
          existingNicknames={campaigns.map(c => c.nickname || '')}
          createCampaign={createCampaign}
        />
        <TextField
          className={classes.searchField}
          label="Filter campaigns"
          type="search"
          variant="outlined"
          onInput={searchInput}
          onChange={searchInput}
        />
      </div>
      <div className={classes.listsContainer}>
        <CampaignsList
          campaigns={campaigns}
          campaignSearch={campaignSearch}
          selectedCampaign={selectedCampaign}
          onCampaignSelected={onCampaignSelected}
        />
      </div>
    </div>
  );
}

export default CampaignsSidebar;
