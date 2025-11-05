import React from 'react';
import {
  Box,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Paper,
  Grid,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';
import { RatePlanWithProduct, Pricing, applyDiscountToPricing } from './utils/productCatalog';

const useStyles = makeStyles(({ spacing, palette }: Theme) => ({
  section: {
    marginBottom: spacing(3),
  },
  sectionTitle: {
    marginBottom: spacing(2),
    fontWeight: 600,
  },
  ratePlanCard: {
    padding: spacing(2),
    marginBottom: spacing(2),
    border: '1px solid #ddd',
    borderRadius: 4,
    cursor: 'pointer',
    transition: 'all 0.2s',
    '&:hover': {
      backgroundColor: palette.action.hover,
    },
  },
  selectedCard: {
    border: `2px solid ${palette.primary.main}`,
    backgroundColor: palette.action.selected,
  },
  priceList: {
    marginTop: spacing(1),
  },
  priceItem: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing(1),
    marginBottom: spacing(0.5),
    fontSize: '0.875rem',
  },
  originalPrice: {
    textDecoration: 'line-through',
    color: palette.text.disabled,
  },
  discountedPrice: {
    color: palette.success.main,
    fontWeight: 600,
  },
  arrow: {
    color: palette.text.secondary,
  },
  noDiscount: {
    color: palette.text.primary,
  },
  ratePlanTitle: {
    fontWeight: 500,
    marginBottom: spacing(1),
  },
}));

interface RatePlanSelectorProps {
  annualRatePlans: RatePlanWithProduct[];
  monthlyRatePlans: RatePlanWithProduct[];
  selectedRatePlanId?: string;
  onRatePlanSelected: (ratePlanId: string) => void;
  discountPercentage?: number;
  isDisabled: boolean;
}

const RatePlanSelector: React.FC<RatePlanSelectorProps> = ({
  annualRatePlans,
  monthlyRatePlans,
  selectedRatePlanId,
  onRatePlanSelected,
  discountPercentage,
  isDisabled,
}) => {
  const classes = useStyles();

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
      <Box className={classes.priceList}>
        <Grid container spacing={1}>
          {currencies.map(currency => {
            const originalPrice = pricing[currency];
            const discountedPrice = discountedPricing?.[currency];

            return (
              <Grid item xs={12} sm={6} key={currency}>
                <Box className={classes.priceItem}>
                  <span className={discountedPrice ? classes.originalPrice : classes.noDiscount}>
                    {currency} {originalPrice.toFixed(2)}
                  </span>
                  {discountedPrice && (
                    <>
                      <span className={classes.arrow}>→</span>
                      <span className={classes.discountedPrice}>
                        {currency} {discountedPrice.toFixed(2)}
                      </span>
                    </>
                  )}
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    );
  };

  const renderRatePlan = (ratePlan: RatePlanWithProduct) => {
    const isSelected = selectedRatePlanId === ratePlan.id;
    const discountedPricing =
      discountPercentage && discountPercentage > 0
        ? applyDiscountToPricing(ratePlan.pricing, discountPercentage)
        : undefined;

    return (
      <Paper
        key={ratePlan.id}
        className={`${classes.ratePlanCard} ${isSelected ? classes.selectedCard : ''}`}
        onClick={() => !isDisabled && onRatePlanSelected(ratePlan.id)}
        elevation={isSelected ? 3 : 1}
      >
        <FormControlLabel
          value={ratePlan.id}
          control={<Radio />}
          label={
            <Box>
              <Typography className={classes.ratePlanTitle}>
                {ratePlan.productDisplayName} - {ratePlan.ratePlanName}
              </Typography>
              {renderPricing(ratePlan.pricing, discountedPricing)}
            </Box>
          }
          disabled={isDisabled}
        />
      </Paper>
    );
  };

  const hasAnnual = annualRatePlans.length > 0;
  const hasMonthly = monthlyRatePlans.length > 0;

  if (!hasAnnual && !hasMonthly) {
    return (
      <Box className={classes.section}>
        <Typography color="textSecondary">No rate plans available for this product</Typography>
      </Box>
    );
  }

  return (
    <Box className={classes.section}>
      <Typography className={classes.sectionTitle}>Rate Plan</Typography>
      <FormControl component="fieldset" fullWidth disabled={isDisabled}>
        <FormLabel component="legend">
          {discountPercentage && discountPercentage > 0
            ? `Select a rate plan (${discountPercentage}% discount will be applied)`
            : 'Select a rate plan'}
        </FormLabel>
        <RadioGroup
          value={selectedRatePlanId || ''}
          onChange={e => onRatePlanSelected(e.target.value)}
        >
          {hasAnnual && (
            <>
              <Typography variant="subtitle2" style={{ marginTop: 16, marginBottom: 8 }}>
                Annual Plans
              </Typography>
              {annualRatePlans.map(ratePlan => renderRatePlan(ratePlan))}
            </>
          )}
          {hasMonthly && (
            <>
              <Typography variant="subtitle2" style={{ marginTop: 16, marginBottom: 8 }}>
                Monthly Plans
              </Typography>
              {monthlyRatePlans.map(ratePlan => renderRatePlan(ratePlan))}
            </>
          )}
        </RadioGroup>
      </FormControl>
    </Box>
  );
};

export default RatePlanSelector;
