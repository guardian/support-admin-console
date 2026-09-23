import { Box, Button, List } from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';
import { PromoListItem } from './promoListItem';
import { RatePlanWithProduct } from './utils/productCatalog';
import { CountryGroup, Promo } from './utils/promoModels';

const Container = styled('div')(({ theme }) => ({
  marginTop: theme.spacing(2),
  width: '100%',
}));
const Header = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
}));
const StyledList = styled(List)({
  padding: 0,
  width: '100%',
  border: '1px solid #ddd',
  borderRadius: '4px',
});

interface PromosListProps {
  promos: Promo[];
  onCreatePromo: () => void;
  onClonePromo: (promo: Promo) => void;
  onViewPromo: (promoCode: string) => void;
  countryGroups?: CountryGroup[];
  ratePlans?: RatePlanWithProduct[];
  allowEditing: boolean;
}

const PromosList = ({
  promos,
  onCreatePromo,
  onClonePromo,
  onViewPromo,
  countryGroups,
  ratePlans,
  allowEditing,
}: PromosListProps): React.ReactElement => {
  return (
    <Container>
      <Header>
        <h3>Promo codes</h3>
        <Button
          variant="contained"
          color="primary"
          onClick={onCreatePromo}
          disabled={!allowEditing}
        >
          Create promo code
        </Button>
      </Header>
      {promos.length === 0 ? (
        <Box p={2} textAlign="center" color="text.secondary">
          No promo codes yet. Click &quot;Create promo code&quot; to add one.
        </Box>
      ) : (
        <StyledList>
          {promos.map((promo) => {
            return (
              <PromoListItem
                key={promo.promoCode}
                promo={promo}
                onClonePromo={onClonePromo}
                onViewPromo={onViewPromo}
                countryGroups={countryGroups}
                ratePlans={ratePlans}
                allowEditing={allowEditing}
              />
            );
          })}
        </StyledList>
      )}
    </Container>
  );
};

export default PromosList;
