import {
  Box,
  Button,
  Chip,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';
import { RatePlanWithProduct } from './utils/productCatalog';
import { CountryGroup, Promo } from './utils/promoModels';

const StyledListItem = styled(ListItem, { shouldForwardProp: (prop) => prop !== 'expired' })<{
  expired: boolean;
}>(({ expired }) => ({
  padding: 0,
  borderBottom: '1px solid #eee',
  opacity: expired ? 0.8 : 1,
  '&:last-child': { borderBottom: 'none' },
}));
const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
  padding: '12px 16px',
  '&.Mui-selected': {
    backgroundColor: theme.palette.primary.light,
    '&:hover': { backgroundColor: theme.palette.primary.light },
  },
}));
const PromoCode = styled('span')({
  fontWeight: 600,
  fontSize: '14px',
});
const Dates = styled('span')(({ theme }) => ({
  fontSize: '12px',
  color: theme.palette.text.secondary,
}));
const EndDate = styled('span')({ fontWeight: 'bold' });
const ActionButtons = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
}));
const ExpiredChip = styled(Chip)(({ theme }) => ({
  backgroundColor: theme.palette.error.main,
  color: 'white',
  fontSize: '10px',
  height: '20px',
  display: 'flex',
}));
const PromoDetails = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.5),
  marginTop: theme.spacing(0.5),
}));
const DetailItem = styled(Typography)(({ theme }) => ({
  fontSize: '11px',
  color: theme.palette.text.secondary,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
}));
const DetailLabel = styled('span')(({ theme }) => ({
  fontWeight: 500,
  color: theme.palette.text.primary,
}));

interface PromoListItemProps {
  promo: Promo;
  onClonePromo: (promo: Promo) => void;
  onViewPromo: (promoCode: string) => void;
  countryGroups?: CountryGroup[];
  ratePlans?: RatePlanWithProduct[];
  allowEditing: boolean;
}

export const PromoListItem = ({
  promo,
  onClonePromo,
  onViewPromo,
  countryGroups,
  ratePlans,
  allowEditing,
}: PromoListItemProps): React.ReactElement => {
  const formatDate = (timestamp?: string) => {
    if (!timestamp || Number.isNaN(Date.parse(timestamp))) {
      return 'N/A';
    }
    const date = new Date(timestamp);
    return (
      date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }) + ' UTC'
    );
  };

  const isExpired = promo.endTimestamp ? new Date(promo.endTimestamp) < new Date() : false;

  const getDiscountText = () => {
    if (!promo.discount) {
      return 'No discount';
    }
    const { amount, durationMonths } = promo.discount;
    if (amount && durationMonths) {
      return `${amount}% off for ${durationMonths} months`;
    }
    if (amount) {
      return `${amount}% off`;
    }
    if (durationMonths) {
      return `${durationMonths} months duration`;
    }
    return 'No discount applied';
  };

  const getRatePlansText = () => {
    if (promo.appliesTo.productRatePlanIds.length === 0) {
      return 'No rate plans';
    }

    const ratePlanNames = promo.appliesTo.productRatePlanIds.map((ratePlanId) => {
      const ratePlan = ratePlans?.find((rp) => rp.id === ratePlanId);
      if (ratePlan) {
        return `${ratePlan.productDisplayName} - ${ratePlan.ratePlanName}`;
      }
      return ratePlanId; // Fallback to ID if not found
    });

    return ratePlanNames.join(', ');
  };

  const getRegionsText = () => {
    if (promo.appliesTo.countries.length === 0) {
      return 'All regions';
    }
    const regionNames = promo.appliesTo.countries.map((country) => {
      const countryGroup = countryGroups?.find((cg) => cg.countries.includes(country));
      if (countryGroup) {
        return countryGroup.name;
      }
      return country;
    });
    const uniqueRegionNames = [...new Set(regionNames)];
    return uniqueRegionNames.join(', ');
  };

  return (
    <StyledListItem expired={isExpired} disablePadding>
      <StyledListItemButton onClick={() => onViewPromo(promo.promoCode)}>
        <ListItemText
          primary={
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Box display="flex" alignItems="center" gap={1}>
                <PromoCode>{promo.promoCode}</PromoCode>
                {isExpired && <ExpiredChip label="Expired" size="small" />}
              </Box>
              <ActionButtons>
                {promo.lockStatus?.locked && <Chip label="Locked" size="small" color="warning" />}
                <Button
                  size="small"
                  variant="outlined"
                  onClick={(e) => {
                    e.stopPropagation();
                    onClonePromo(promo);
                  }}
                  disabled={!allowEditing}
                >
                  Clone
                </Button>
              </ActionButtons>
            </Box>
          }
          secondaryTypographyProps={{ component: 'div' }}
          secondary={
            <Box>
              <Dates>
                {formatDate(promo.startTimestamp)} -{' '}
                <EndDate>{formatDate(promo.endTimestamp)}</EndDate>
              </Dates>
              <PromoDetails>
                <DetailItem>
                  <DetailLabel>Discount:</DetailLabel> {getDiscountText()}
                </DetailItem>
                <DetailItem>
                  <DetailLabel>Rate plans:</DetailLabel> {getRatePlansText()}
                </DetailItem>
                <DetailItem>
                  <DetailLabel>Regions:</DetailLabel> {getRegionsText()}
                </DetailItem>
              </PromoDetails>
            </Box>
          }
        />
      </StyledListItemButton>
    </StyledListItem>
  );
};
