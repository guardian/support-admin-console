import React from 'react';
import { List } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Products, PromoCampaign, PromoCampaigns } from './utils/promoModels';
import { PromoCampaignsListItem } from './promoCampaignsListItem';

const useStyles = makeStyles(() => ({
  container: {
    marginTop: '16px',
    width: '100%',
  },
  list: {
    padding: 0,
    width: '100%',
  },
}));

interface PromoCampaignsListProps {
  promoCampaigns: PromoCampaigns;
  promoCampaignSearch: string;
  selectedPromoCampaign?: PromoCampaign | null;
  onPromoCampaignSelected: (campaignCode: string) => void;
  selectedProduct?: Products;
}

const PromoCampaignsList = ({
  promoCampaigns,
  promoCampaignSearch,
  selectedPromoCampaign,
  onPromoCampaignSelected,
  selectedProduct,
}: PromoCampaignsListProps): React.ReactElement => {
  const classes = useStyles();

  const filterPromoCampaigns = (campaignArray: PromoCampaigns) => {
    return campaignArray.filter(c => {
      if (!promoCampaignSearch) {
        return true;
      } else if (c.name && c.name.indexOf(promoCampaignSearch) >= 0) {
        return true;
      } else if (c.name.indexOf(promoCampaignSearch) >= 0) {
        return true;
      }
      return false;
    });
  };

  const filterPromoCampaignsByProduct = (campaignArray: PromoCampaigns) => {
    return campaignArray.filter(c => {
      if (!selectedProduct) {
        return true;
      } else if (c.product && c.product === selectedProduct.toString()) {
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
    <div className={classes.container}>
      <List className={classes.list}>
        {filteredAndSortedPromoCampaigns.map(promoCampaign => {
          const isSelected = Boolean(
            selectedPromoCampaign &&
              selectedPromoCampaign.campaignCode === promoCampaign.campaignCode,
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
      </List>
    </div>
  );
};

export default PromoCampaignsList;
