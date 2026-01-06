import React from 'react';
import {
  ListItem,
  ListItemButton,
  ListItemText,
  Box,
  Chip,
  Button,
  Typography,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';
import { Promo, CountryGroup } from './utils/promoModels';
import { RatePlanWithProduct } from './utils/productCatalog';

const useStyles = makeStyles(({ palette, spacing }: Theme) => ({
  listItem: {
    padding: 0,
    borderBottom: '1px solid #eee',
    '&:last-child': {
      borderBottom: 'none',
    },
  },
  listItemButton: {
    padding: '12px 16px',
    '&.Mui-selected': {
      backgroundColor: palette.primary.light,
      '&:hover': {
        backgroundColor: palette.primary.light,
      },
    },
  },
  promoCode: {
    fontWeight: 600,
    fontSize: '14px',
  },
  dates: {
    fontSize: '12px',
    color: palette.text.secondary,
  },
  endDate: {
    fontWeight: 'bold',
  },
  actionButtons: {
    display: 'flex',
    gap: spacing(1),
  },
  expired: {
    backgroundColor: '#ffebee',
    opacity: 0.8,
  },
  expiredChip: {
    backgroundColor: palette.error.main,
    color: 'white',
    fontSize: '10px',
    height: '20px',
  },
  promoDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing(0.5),
    marginTop: spacing(0.5),
  },
  detailItem: {
    fontSize: '11px',
    color: palette.text.secondary,
    display: 'flex',
    alignItems: 'center',
    gap: spacing(0.5),
  },
  detailLabel: {
    fontWeight: 500,
    color: palette.text.primary,
  },
}));

interface PromoListItemProps {
  promo: Promo;
  onClonePromo: (promo: Promo) => void;
  onViewPromo: (promoCode: string) => void;
  countryGroups?: CountryGroup[];
  ratePlans?: RatePlanWithProduct[];
}

export const PromoListItem = ({
  promo,
  onClonePromo,
  onViewPromo,
  countryGroups,
  ratePlans,
}: PromoListItemProps): React.ReactElement => {
  const classes = useStyles();

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
    if (!promo.appliesTo.productRatePlanIds || promo.appliesTo.productRatePlanIds.length === 0) {
      return 'No rate plans';
    }

    const ratePlanNames = promo.appliesTo.productRatePlanIds.map(ratePlanId => {
      const ratePlan = ratePlans?.find(rp => rp.id === ratePlanId);
      if (ratePlan) {
        return `${ratePlan.productDisplayName} - ${ratePlan.ratePlanName}`;
      }
      return ratePlanId; // Fallback to ID if not found
    });

    return ratePlanNames.join(', ');
  };

  const getRegionsText = () => {
    if (!promo.appliesTo.countryGroups || promo.appliesTo.countryGroups.length === 0) {
      return 'All regions';
    }
    const regionNames = promo.appliesTo.countryGroups.map(item => {
      const groupById = countryGroups?.find(cg => cg.id === item);
      if (groupById) {
        return groupById.name;
      }
      const groupByCountryCode = countryGroups?.find(cg => cg.countries.includes(item));
      if (groupByCountryCode) {
        return groupByCountryCode.name;
      }
      return item;
    });
    const uniqueRegionNames = [...new Set(regionNames)];
    return uniqueRegionNames.join(', ');
  };

  return (
    <ListItem className={`${classes.listItem} ${isExpired ? classes.expired : ''}`} disablePadding>
      <ListItemButton
        className={classes.listItemButton}
        onClick={() => onViewPromo(promo.promoCode)}
      >
        <ListItemText
          primary={
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Box display="flex" alignItems="center" gap={1}>
                <span className={classes.promoCode}>{promo.promoCode}</span>
                {isExpired && <Chip label="Expired" size="small" className={classes.expiredChip} />}
              </Box>
              <Box className={classes.actionButtons}>
                {promo.lockStatus?.locked && <Chip label="Locked" size="small" color="warning" />}
                <Button
                  size="small"
                  variant="outlined"
                  onClick={e => {
                    e.stopPropagation();
                    onClonePromo(promo);
                  }}
                >
                  Clone
                </Button>
              </Box>
            </Box>
          }
          secondaryTypographyProps={{ component: 'div' }}
          secondary={
            <Box>
              <span className={classes.dates}>
                {formatDate(promo.startTimestamp)} -{' '}
                <span className={classes.endDate}>{formatDate(promo?.endTimestamp)}</span>
              </span>
              <Box className={classes.promoDetails}>
                <Typography className={classes.detailItem}>
                  <span className={classes.detailLabel}>Discount:</span> {getDiscountText()}
                </Typography>
                <Typography className={classes.detailItem}>
                  <span className={classes.detailLabel}>Rate plans:</span> {getRatePlansText()}
                </Typography>
                <Typography className={classes.detailItem}>
                  <span className={classes.detailLabel}>Regions:</span> {getRegionsText()}
                </Typography>
              </Box>
            </Box>
          }
        />
      </ListItemButton>
    </ListItem>
  );
};
