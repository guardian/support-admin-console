import React, { useState } from 'react';
import { makeStyles } from '@mui/styles';
import { TextField } from '@mui/material';
import PromoCampaignsList from './promoCampaignsList';
import NewPromoCampaignButton from './newPromoCampaignButton';
import { PromoCampaign, PromoCampaigns, PromoProduct } from './utils/promoModels';
import { ProductSelector } from './productSelector';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: '32px',
  },
  headline2: {
    color: '#555',
    fontSize: 18,
    marginTop: '20px',
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
  createPromoCampaign: (name: string, product: PromoProduct) => void;
  onPromoCampaignSelected: (campaignName: string) => void;
  selectedProduct: PromoProduct;
  setSelectedProduct: (product: PromoProduct) => void;
}

function PromoCampaignsSidebar({
  promoCampaigns,
  selectedPromoCampaign,
  onPromoCampaignSelected,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  createPromoCampaign,
  selectedProduct,
  setSelectedProduct,
}: PromoCampaignsSidebarProps): React.ReactElement {
  const classes = useStyles();
  const [promoCampaignSearch, setPromoCampaignSearch] = useState('');

  const searchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e && e.target) {
      setPromoCampaignSearch(e.target.value);
    }
  };

  return (
    <div className={classes.root}>
      <h2 className={classes.headline2}>Select Product to filter Promo Campaigns</h2>
      <ProductSelector
        selectedValue={selectedProduct.toString()}
        handleSelectedValue={setSelectedProduct}
      />
      <h2 className={classes.headline2}>Promo Campaigns</h2>
      <div className={classes.buttonsContainer}>
        <NewPromoCampaignButton
          createPromoCampaign={createPromoCampaign}
          existingNames={promoCampaigns.map((c) => c.name)}
          selectedProduct={selectedProduct}
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
          selectedProduct={selectedProduct}
        />
      </div>
    </div>
  );
}

export default PromoCampaignsSidebar;
