import { TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useState } from 'react';
import NewPromoCampaignButton from './newPromoCampaignButton';
import { ProductSelector } from './productSelector';
import PromoCampaignsList from './promoCampaignsList';
import { PromoCampaign, PromoCampaigns, PromoProduct } from './utils/promoModels';

const Root = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  paddingLeft: '32px',
});
const Headline = styled('h2')({
  color: '#555',
  fontSize: 18,
  marginTop: '20px',
});
const ListsContainer = styled('div')({
  position: 'relative',
  display: 'flex',
  marginTop: '8px',
});
const SearchField = styled(TextField)({
  marginTop: '8px',
});
const ButtonsContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  marginBottom: '10px',
});

interface PromoCampaignsSidebarProps {
  promoCampaigns: PromoCampaigns;
  selectedPromoCampaign?: PromoCampaign;
  createPromoCampaign: (name: string, product: PromoProduct) => void;
  onPromoCampaignSelected: (campaignName: string) => void;
  selectedProduct: PromoProduct;
  setSelectedProduct: (product: PromoProduct) => void;
  allowEditing: boolean;
}

function PromoCampaignsSidebar({
  promoCampaigns,
  selectedPromoCampaign,
  onPromoCampaignSelected,
  createPromoCampaign,
  selectedProduct,
  setSelectedProduct,
  allowEditing,
}: PromoCampaignsSidebarProps): React.ReactElement {
  const [promoCampaignSearch, setPromoCampaignSearch] = useState('');

  const searchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPromoCampaignSearch(e.target.value);
  };

  const searchInputNative = (event: React.FormEvent<HTMLDivElement>) => {
    const target = event.target;
    if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) {
      setPromoCampaignSearch(target.value);
    }
  };

  return (
    <Root>
      <Headline>Select Product to filter Promo Campaigns</Headline>
      <ProductSelector
        selectedValue={selectedProduct.toString()}
        handleSelectedValue={setSelectedProduct}
      />
      <Headline>Promo Campaigns</Headline>
      <ButtonsContainer>
        <NewPromoCampaignButton
          createPromoCampaign={createPromoCampaign}
          existingNames={promoCampaigns.map((c) => c.name)}
          selectedProduct={selectedProduct}
          allowEditing={allowEditing}
        />
        <SearchField
          label="Filter Promo Campaigns"
          type="search"
          variant="outlined"
          onInput={searchInputNative}
          onChange={searchInput}
        />
      </ButtonsContainer>
      <ListsContainer>
        <PromoCampaignsList
          promoCampaigns={promoCampaigns}
          promoCampaignSearch={promoCampaignSearch}
          selectedPromoCampaign={selectedPromoCampaign}
          onPromoCampaignSelected={onPromoCampaignSelected}
          selectedProduct={selectedProduct}
        />
      </ListsContainer>
    </Root>
  );
}

export default PromoCampaignsSidebar;
