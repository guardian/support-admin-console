import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  Paper,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';
import {
  applyDiscountToPricing,
  billingPeriodToMonths,
  Pricing,
  RatePlanWithProduct,
} from './utils/productCatalog';

const Section = styled(Box)(({ theme }) => ({ marginBottom: theme.spacing(3) }));
const SectionTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  fontWeight: 600,
}));
const RatePlanCard = styled(Paper, { shouldForwardProp: (prop) => prop !== 'selected' })<{
  selected: boolean;
}>(({ theme, selected }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  border: '1px solid #ddd',
  borderRadius: 4,
  cursor: 'pointer',
  transition: 'all 0.2s',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
  ...(selected && {
    border: `2px solid ${theme.palette.primary.main}`,
    backgroundColor: theme.palette.action.selected,
  }),
}));
const PriceList = styled(Box)(({ theme }) => ({ marginTop: theme.spacing(1) }));
const PriceItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(0.5),
  fontSize: '0.875rem',
}));
const OriginalPrice = styled('span')(({ theme }) => ({
  textDecoration: 'line-through',
  color: theme.palette.text.disabled,
}));
const DiscountedPrice = styled('span')(({ theme }) => ({
  color: theme.palette.success.main,
  fontWeight: 600,
}));
const Arrow = styled('span')(({ theme }) => ({ color: theme.palette.text.secondary }));
const NoDiscount = styled('span')(({ theme }) => ({ color: theme.palette.text.primary }));
const RatePlanTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 500,
  marginBottom: theme.spacing(1),
}));
const FractionalInfo = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(0.5),
  color: theme.palette.info.main,
  fontSize: '0.8rem',
}));
const FractionalError = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(0.5),
  color: theme.palette.error.main,
  fontSize: '0.8rem',
}));

interface RatePlanSelectorProps {
  ratePlans: RatePlanWithProduct[];
  selectedRatePlanIds: string[];
  onRatePlansSelected: (ratePlanIds: string[]) => void;
  discountPercentage?: number;
  discountDurationMonths?: number;
  isDisabled: boolean;
}

const RatePlanSelector: React.FC<RatePlanSelectorProps> = ({
  ratePlans,
  selectedRatePlanIds,
  onRatePlansSelected,
  discountPercentage,
  discountDurationMonths,
  isDisabled,
}) => {
  const handleToggleRatePlan = (ratePlanId: string) => {
    if (selectedRatePlanIds.includes(ratePlanId)) {
      onRatePlansSelected(selectedRatePlanIds.filter((id) => id !== ratePlanId));
    } else {
      onRatePlansSelected([...selectedRatePlanIds, ratePlanId]);
    }
  };

  const renderPricing = (pricing: Pricing, discountedPricing?: Pricing) => {
    const currencies = Object.keys(pricing).sort();

    if (currencies.length === 0) {
      return (
        <Typography variant="body2" color="textSecondary">
          No pricing available
        </Typography>
      );
    }

    return (
      <PriceList>
        <Grid container spacing={1}>
          {currencies.map((currency) => {
            const originalPrice = pricing[currency];
            const discountedPrice = discountedPricing?.[currency];
            const Price = discountedPrice ? OriginalPrice : NoDiscount;

            return (
              <Grid item xs={12} sm={6} key={currency}>
                <PriceItem>
                  <Price>
                    {currency} {originalPrice.toFixed(2)}
                  </Price>
                  {discountedPrice && (
                    <>
                      <Arrow>→</Arrow>
                      <DiscountedPrice>
                        {currency} {discountedPrice.toFixed(2)}
                      </DiscountedPrice>
                    </>
                  )}
                </PriceItem>
              </Grid>
            );
          })}
        </Grid>
      </PriceList>
    );
  };

  const renderRatePlan = (ratePlan: RatePlanWithProduct) => {
    const isSelected = selectedRatePlanIds.includes(ratePlan.id);

    const billingPeriodMonths = billingPeriodToMonths(ratePlan.billingPeriod);
    const isFractionalDuration =
      discountDurationMonths != null &&
      discountDurationMonths > 0 &&
      discountDurationMonths % billingPeriodMonths !== 0;

    const discountedPricing =
      discountPercentage && discountPercentage > 0
        ? applyDiscountToPricing(
            ratePlan.pricing,
            discountPercentage,
            discountDurationMonths,
            ratePlan.billingPeriod,
          )
        : undefined;

    const canToggle = !isDisabled && (!isFractionalDuration || isSelected);

    return (
      <RatePlanCard key={ratePlan.id} selected={isSelected} elevation={isSelected ? 3 : 1}>
        <FormControlLabel
          control={
            <Checkbox
              checked={isSelected}
              onChange={() => canToggle && handleToggleRatePlan(ratePlan.id)}
            />
          }
          label={
            <Box>
              <RatePlanTitle>
                {ratePlan.productDisplayName} ({ratePlan.productName}) - {ratePlan.ratePlanName}
              </RatePlanTitle>
              {renderPricing(ratePlan.pricing, discountedPricing)}
              {isFractionalDuration && isSelected && (
                <FractionalError>
                  The promotion is not a whole number of billing periods. Uncheck this billing plan
                  to fix this error.
                </FractionalError>
              )}
              {isFractionalDuration && !isSelected && (
                <FractionalInfo>
                  The promotion is not a whole number of billing periods.
                </FractionalInfo>
              )}
            </Box>
          }
          disabled={isDisabled || (isFractionalDuration && !isSelected)}
        />
      </RatePlanCard>
    );
  };

  if (ratePlans.length === 0) {
    return (
      <Section>
        <Typography color="textSecondary">No rate plans available for this product</Typography>
      </Section>
    );
  }

  return (
    <Section>
      <SectionTitle>Rate Plans</SectionTitle>
      <FormControl component="fieldset" fullWidth disabled={isDisabled}>
        <FormLabel component="legend">Select rate plans</FormLabel>
        <FormGroup>{ratePlans.map((ratePlan) => renderRatePlan(ratePlan))}</FormGroup>
      </FormControl>
    </Section>
  );
};

export default RatePlanSelector;
