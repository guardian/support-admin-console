import React, { useState } from 'react';
import { makeStyles } from '@mui/styles';
import { MenuItem, Select, TextField } from '@mui/material';
import PromoCampaignsList from './promoCampaignsList';
import NewPromoCampaignButton from './newPromoCampaignButton';
import { Products, PromoCampaign, PromoCampaigns } from './utils/promoModels';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: '32px',
  },
  headline2: {
    color: '#555',
    fontSize: 18,
  },
  listsContainer: {
    position: 'relative',
    display: 'flex',
    marginTop: '8px',
  },
  searchField: {
    marginTop: '8px',
  },
  select: {
    marginBottom: '50px',
  },
  buttonsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginBottom: '10px',
  },
}));

interface PromoCampaignsSidebarProps {
  promoCampaigns: PromoCampaigns;
  selectedPromoCampaign?: PromoCampaign;
  createPromoCampaign: (campaign: PromoCampaign) => void;
  onPromoCampaignSelected: (campaignName: string) => void;
}

function PromoCampaignsSidebar({
  promoCampaigns,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  createPromoCampaign,
  selectedPromoCampaign,
  onPromoCampaignSelected,
}: PromoCampaignsSidebarProps): React.ReactElement {
  const classes = useStyles();
  const [promoCampaignSearch, setPromoCampaignSearch] = useState('');

  const searchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e && e.target) {
      setPromoCampaignSearch(e.target.value.toUpperCase());
    }
  };

  return (
    <div className={classes.root}>
      <h2 className={classes.headline2}>Select Product to filter Promo Campaigns</h2>
      <Select className={classes.select} value={Products[0].code} aria-label="Select Product">
        {Products.map(c => (
          <MenuItem value={c.code} key={`product-${c.code}`}>
            {c.name}
          </MenuItem>
        ))}
      </Select>
      <h2 className={classes.headline2}>Promo Campaigns</h2>
      <div className={classes.buttonsContainer}>
        <NewPromoCampaignButton
        // existingNames={promoCampaigns.map(c => c.name)}
        // existingNicknames={promoCampaigns.map(c => c.name || '')}
        // createCampaign={createPromoCampaign}
        />
        <TextField
          className={classes.searchField}
          label="Filter Promo Campaigns"
          type="search"
          variant="outlined"
          onInput={searchInput}
          onChange={searchInput}
        />
      </div>
      <div className={classes.listsContainer}>
        <PromoCampaignsList
          promoCampaigns={promoCampaigns}
          promoCampaignSearch={promoCampaignSearch}
          selectedPromoCampaign={selectedPromoCampaign}
          onPromoCampaignSelected={onPromoCampaignSelected}
        />
      </div>
    </div>
  );
}

export default PromoCampaignsSidebar;
