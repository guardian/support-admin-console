import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import React, { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { fetchCountryGroups, fetchProductDetails } from '../../utils/requests';
import { useStyles } from './promoEditorStyles';
import { PromoLandingPage } from './promoLandingPage';
import RatePlanSelector from './ratePlanSelector';
import {
  billingPeriodToMonths,
  getAllRatePlansWithProduct,
  orderRatePlans,
  RatePlanWithProduct,
} from './utils/productCatalog';
import {
  CountryGroup,
  LandingPage,
  mapPromoProductToCatalogProducts,
  Promo,
  PromoProduct,
} from './utils/promoModels';

interface PromoEditorProps {
  promo: Promo | null;
  isEditing: boolean;
  onSave: (promo: Promo) => void;
  onCancel: () => void;
  onLock: (force: boolean) => void;
  userEmail?: string;
  campaignProduct: PromoProduct;
}

const PromoEditor = ({
  promo,
  isEditing,
  onSave,
  onCancel,
  onLock,
  userEmail,
  campaignProduct,
}: PromoEditorProps): React.ReactElement => {
  const classes = useStyles();
  const [editedPromo, setEditedPromo] = useState<Promo | null>(promo);
  const [countryGroups, setCountryGroups] = useState<CountryGroup[]>([]);
  const [allRatePlans, setAllRatePlans] = useState<RatePlanWithProduct[]>([]);
  const [promotionHasLandingPage, setPromotionHasLandingPage] = useState<boolean>(
    !!promo?.landingPage,
  );
  const [backupLandingPage, setBackupLandingPage] = useState<LandingPage | undefined>(
    promo?.landingPage,
  );

  const selectedCountryGroups = useMemo(() => {
    if (editedPromo && countryGroups.length > 0) {
      const countryCodes = editedPromo.appliesTo.countries;
      const matchedGroupIds = countryCodes
        .map((countryCode) => countryGroups.find((cg) => cg.countries.includes(countryCode)))
        .filter((group): group is CountryGroup => group != undefined)
        .map((group) => group.id);
      return [...new Set(matchedGroupIds)];
    }
    return [];
  }, [editedPromo, countryGroups]);

  useEffect(() => {
    fetchCountryGroups()
      .then((groups) => setCountryGroups(groups))
      .catch((error) => console.error('Error fetching country groups:', error));
  }, []);

  useEffect(() => {
    const catalogProducts = mapPromoProductToCatalogProducts(campaignProduct);

    Promise.all(catalogProducts.map((productName) => fetchProductDetails(productName)))
      .then((products) => {
        const ratePlans: RatePlanWithProduct[] = [];

        products.forEach((product, index) => {
          const productName = catalogProducts[index];
          ratePlans.push(...getAllRatePlansWithProduct(product, productName));
        });

        ratePlans.sort(orderRatePlans(campaignProduct));
        setAllRatePlans(ratePlans);
      })
      .catch((error) => {
        console.error('Error fetching product details:', error);
      });
  }, [campaignProduct]);

  if (!promo) {
    return (
      <Box className={classes.root}>
        <Typography variant="h6" color="textSecondary">
          Select a promo code to view details
        </Typography>
      </Box>
    );
  }

  const handleFieldChange = (field: keyof Promo, value: string) => {
    if (editedPromo) {
      setEditedPromo({
        ...editedPromo,
        [field]: value,
      });
    }
  };

  const handleDateChange = (field: 'startTimestamp' | 'endTimestamp', value: string) => {
    if (editedPromo && value) {
      const isoDate = new Date(value).toISOString();
      setEditedPromo({
        ...editedPromo,
        [field]: isoDate,
      });
    }
  };

  const formatDateForInput = (isoString: string): string => {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const handleDiscountChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (isEditing) {
      setEditedPromo((prevPromo) => {
        if (!prevPromo || !e.target.value) {
          return prevPromo;
        }
        return {
          ...prevPromo,
          discount: {
            ...prevPromo.discount,
            [e.target.name]: Number(e.target.value),
          },
        };
      });
    }
  };

  const handleRatePlansSelected = (ratePlanIds: string[]) => {
    if (editedPromo) {
      setEditedPromo({
        ...editedPromo,
        appliesTo: {
          ...editedPromo.appliesTo,
          productRatePlanIds: ratePlanIds,
        },
      });
    }
  };

  const handleCountryGroupToggle = (countryGroupId: string) => {
    if (!editedPromo) {
      return;
    }

    const currentCountries = editedPromo.appliesTo.countries;
    const groupCountries = countryGroups.find((g) => g.id === countryGroupId)?.countries ?? [];

    const isGroupSelected = groupCountries.every((country) => currentCountries.includes(country));

    let newCountries: string[];
    if (isGroupSelected) {
      newCountries = currentCountries.filter((country) => !groupCountries.includes(country));
    } else {
      newCountries = [...new Set([...currentCountries, ...groupCountries])];
    }

    setEditedPromo({
      ...editedPromo,
      appliesTo: {
        ...editedPromo.appliesTo,
        countries: newCountries,
      },
    });
  };

  const handleIsIntroductoryPricingChange = () => {
    if (isEditing && editedPromo) {
      setEditedPromo((curr) => {
        if (!curr) {
          return null;
        }
        return {
          ...curr,
          isIntroductoryPricing: !curr.isIntroductoryPricing,
        };
      });
    }
  };

  const handlePromotionHasLandingPageChange = () => {
    if (isEditing && editedPromo) {
      setEditedPromo({
        ...editedPromo,
        landingPage: promotionHasLandingPage ? undefined : backupLandingPage,
      });
    }
    setPromotionHasLandingPage((prev) => !prev);
  };

  const handleLandingPageChange = (landingPage: LandingPage | undefined) => {
    if (isEditing && editedPromo && promotionHasLandingPage) {
      setBackupLandingPage(landingPage);
      setEditedPromo({
        ...editedPromo,
        landingPage,
      });
    }
  };

  const handleSave = () => {
    if (editedPromo && !hasFractionalSelectedPlan) {
      onSave(editedPromo);
    }
  };

  const hasFractionalSelectedPlan = allRatePlans.some((plan) => {
    const isSelected = editedPromo?.appliesTo.productRatePlanIds.includes(plan.id);
    const durationMonths = editedPromo?.discount?.durationMonths;
    if (!isSelected || durationMonths == null || durationMonths <= 0) {
      return false;
    }
    return durationMonths % billingPeriodToMonths(plan.billingPeriod) !== 0;
  });

  const isLockedByOther = promo.lockStatus?.locked && promo.lockStatus.email !== userEmail;
  const isLockedByUser = promo.lockStatus?.locked && promo.lockStatus.email === userEmail;

  const lockMessage = isLockedByUser
    ? 'This promo is currently locked by you'
    : `This promo is currently locked by ${promo.lockStatus?.email}`;

  const showLandingPageSection = ['Newspaper', 'Weekly'].includes(campaignProduct);
  return (
    <Paper className={classes.root}>
      {(isLockedByOther ?? isLockedByUser) && (
        <Box className={classes.lockBanner}>
          <Typography variant="body2">{lockMessage}</Typography>
          {isLockedByOther && (
            <Button
              size="small"
              variant="outlined"
              onClick={() => onLock(true)}
              style={{ marginTop: 8 }}
            >
              Take Control
            </Button>
          )}
        </Box>
      )}

      <div className={classes.section}>
        <Typography className={classes.sectionTitle}>Basic Information</Typography>
        <TextField
          className={classes.formField}
          fullWidth
          label="Name"
          value={editedPromo?.name ?? ''}
          onChange={(e) => handleFieldChange('name', e.target.value)}
          disabled={!isEditing}
        />
        <TextField
          className={classes.formField}
          fullWidth
          label="Description"
          multiline
          rows={3}
          value={editedPromo?.description ?? ''}
          onChange={(e) => handleFieldChange('description', e.target.value)}
          disabled={!isEditing}
        />
      </div>

      <div className={classes.section}>
        <Typography className={classes.sectionTitle}>Duration (UTC)</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Start Date (UTC)"
              type="datetime-local"
              value={editedPromo ? formatDateForInput(editedPromo.startTimestamp) : ''}
              onChange={(e) => handleDateChange('startTimestamp', e.target.value)}
              disabled={!isEditing}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="End Date (UTC)"
              type="datetime-local"
              value={editedPromo?.endTimestamp ? formatDateForInput(editedPromo.endTimestamp) : ''}
              onChange={(e) => handleDateChange('endTimestamp', e.target.value)}
              disabled={!isEditing}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
        </Grid>
      </div>

      <div className={classes.section}>
        <Typography className={classes.sectionTitle}>Discount</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            {' '}
            <TextField
              name="durationMonths"
              label="Duration (months)"
              value={editedPromo?.discount?.durationMonths ?? ''}
              onChange={(e) => handleDiscountChange(e)}
              fullWidth
              disabled={!isEditing}
              InputLabelProps={{
                shrink: true,
              }}
              type="number"
              inputProps={{ min: 1, step: 1 }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="amount"
              label="Amount (%)"
              value={editedPromo?.discount?.amount ?? ''}
              onChange={(e) => handleDiscountChange(e)}
              fullWidth
              disabled={!isEditing}
              InputLabelProps={{
                shrink: true,
              }}
              type="number"
              inputProps={{ min: 0, max: 100, step: 0.1 }}
            />
          </Grid>
        </Grid>
        <FormControlLabel
          control={
            <Checkbox
              checked={editedPromo?.isIntroductoryPricing ?? false}
              onChange={handleIsIntroductoryPricingChange}
              disabled={!isEditing}
            />
          }
          label="Introductory Price (will not display price comparison on the product page)"
        />
      </div>

      {allRatePlans.length > 0 && (
        <RatePlanSelector
          ratePlans={allRatePlans}
          selectedRatePlanIds={editedPromo?.appliesTo.productRatePlanIds ?? []}
          onRatePlansSelected={handleRatePlansSelected}
          discountPercentage={editedPromo?.discount?.amount}
          discountDurationMonths={editedPromo?.discount?.durationMonths}
          isDisabled={!isEditing}
        />
      )}

      <div className={classes.section}>
        <Typography className={classes.sectionTitle}>Availability</Typography>
        <Typography variant="subtitle2" gutterBottom>
          Country Groups
        </Typography>
        <Box className={classes.countryGroupsContainer}>
          <Grid container spacing={2}>
            {countryGroups.map((group) => (
              <Grid item xs={6} key={group.id}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedCountryGroups.includes(group.id)}
                      onChange={() => handleCountryGroupToggle(group.id)}
                      disabled={!isEditing}
                    />
                  }
                  label={group.name}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      </div>
      {showLandingPageSection && (
        <div className={classes.section}>
          <Typography className={classes.sectionTitle}>Landing page</Typography>
          <FormControlLabel
            control={
              <Checkbox
                checked={promotionHasLandingPage}
                onChange={handlePromotionHasLandingPageChange}
                disabled={!isEditing}
              />
            }
            label="Override product page hero content"
          />
          {promotionHasLandingPage && (
            <>
              <Box className={classes.infoBanner}>
                <Typography variant="body2">
                  Tip: When this option is enabled, the landing page top section content will be
                  replaced by the data specified below.
                </Typography>
              </Box>
              <PromoLandingPage
                landingPage={backupLandingPage}
                updateLandingPage={handleLandingPageChange}
                isEditing={isEditing}
              />
            </>
          )}
        </div>
      )}

      {isEditing && (
        <div className={classes.buttonGroup}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            disabled={hasFractionalSelectedPlan}
          >
            Save
          </Button>
          <Button variant="outlined" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      )}
    </Paper>
  );
};

export default PromoEditor;
