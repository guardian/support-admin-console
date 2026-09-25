import { List } from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';
import { PromoCampaignsListItem } from './promoCampaignsListItem';
import { PromoCampaign, PromoCampaigns, PromoProduct } from './utils/promoModels';

const Container = styled('div')({
  marginTop: '16px',
  width: '100%',
});
const StyledList = styled(List)({
  padding: 0,
  width: '100%',
});

interface PromoCampaignsListProps {
  promoCampaigns: PromoCampaigns;
  promoCampaignSearch: string;
  selectedPromoCampaign?: PromoCampaign | null;
  onPromoCampaignSelected: (campaignCode: string) => void;
  selectedProduct?: PromoProduct;
}

const PromoCampaignsList = ({
  promoCampaigns,
  promoCampaignSearch,
  selectedPromoCampaign,
  onPromoCampaignSelected,
  selectedProduct,
}: PromoCampaignsListProps): React.ReactElement => {
  const filterPromoCampaigns = (campaignArray: PromoCampaigns) => {
    return campaignArray.filter((c) => {
      if (!promoCampaignSearch) {
        return true;
      } else if (c.name.includes(promoCampaignSearch)) {
        return true;
      }
      return false;
    });
  };
  const filterPromoCampaignsByProduct = (campaignArray: PromoCampaigns) => {
    return campaignArray.filter((c) => {
      if (!selectedProduct) {
        return true;
      } else if (c.product === selectedProduct) {
        return true;
      }
      return false;
    });
  };
  const sortPromoCampaigns = (campaignArray: PromoCampaigns) => {
    campaignArray.sort((a, b) => {
      const A = a.name;
      const B = b.name;

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
  const filteredAndSortedPromoCampaigns = sortPromoCampaigns(
    filterPromoCampaigns(filterPromoCampaignsByProduct(promoCampaigns)),
  );

  return (
    <Container>
      <StyledList>
        {filteredAndSortedPromoCampaigns.map((promoCampaign) => {
          const isSelected = Boolean(
            selectedPromoCampaign?.campaignCode === promoCampaign.campaignCode,
          );
          return (
            <PromoCampaignsListItem
              key={promoCampaign.campaignCode}
              promoCampaign={promoCampaign}
              isSelected={isSelected}
              onPromoCampaignSelected={onPromoCampaignSelected}
            />
          );
        })}
      </StyledList>
    </Container>
  );
};

export default PromoCampaignsList;
