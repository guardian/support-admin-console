import React from 'react';
import { List, Button, Box } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';
import { Promo, CountryGroup } from './utils/promoModels';
import { RatePlanWithProduct } from './utils/productCatalog';
import { PromoListItem } from './promoListItem';

const useStyles = makeStyles(({ spacing }: Theme) => ({
  container: {
    marginTop: spacing(2),
    width: '100%',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing(2),
  },
  list: {
    padding: 0,
    width: '100%',
    border: '1px solid #ddd',
    borderRadius: '4px',
  },
}));

interface PromosListProps {
  promos: Promo[];
  onCreatePromo: () => void;
  onClonePromo: (promo: Promo) => void;
  onViewPromo: (promoCode: string) => void;
  countryGroups?: CountryGroup[];
  ratePlans?: RatePlanWithProduct[];
}

const PromosList = ({
  promos,
  onCreatePromo,
  onClonePromo,
  onViewPromo,
  countryGroups,
  ratePlans,
}: PromosListProps): React.ReactElement => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <h3>Promo codes</h3>
        <Button variant="contained" color="primary" onClick={onCreatePromo}>
          Create promo code
        </Button>
      </div>
      {promos.length === 0 ? (
        <Box p={2} textAlign="center" color="text.secondary">
          No promo codes yet. Click &quot;Create promo code&quot; to add one.
        </Box>
      ) : (
        <List className={classes.list}>
          {promos.map((promo) => {
            return (
              <PromoListItem
                key={promo.promoCode}
                promo={promo}
                onClonePromo={onClonePromo}
                onViewPromo={onViewPromo}
                countryGroups={countryGroups}
                ratePlans={ratePlans}
              />
            );
          })}
        </List>
      )}
    </div>
  );
};

export default PromosList;
