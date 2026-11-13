import { Button, Checkbox, FormControlLabel, Grid, TextField, Typography } from '@mui/material';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { fetchCountryGroups, fetchProductDetails } from '../../utils/requests';
import {
  ButtonGroup,
  CountryGroupsContainer,
  FormField,
  InfoBanner,
  LockBanner,
  Root,
  Section,
  SectionTitle,
} from './promoEditorStyles';
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
  getPromoCountryTargeting,
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
  const [editedPromo, setEditedPromo] = useState<Promo | null>(promo);
  const [countryGroups, setCountryGroups] = useState<CountryGroup[]>([]);
  const [allRatePlans, setAllRatePlans] = useState<RatePlanWithProduct[]>([]);
  const [promotionHasLandingPage, setPromotionHasLandingPage] = useState<boolean>(
    !!promo?.landingPage,
  );
  const [backupLandingPage, setBackupLandingPage] = useState<LandingPage | undefined>(
    promo?.landingPage,
  );

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
      <Root>
        <Typography variant="h6" color="textSecondary">
          Select a promo code to view details
        </Typography>
      </Root>
    );
  }

  const targeting = editedPromo && getPromoCountryTargeting(editedPromo.appliesTo, countryGroups);

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

  const handleCountryGroupToggle = (group: CountryGroup) => {
    if (!editedPromo || !targeting) {
      return;
    }

    const groupIds = targeting.groupIds.includes(group.id)
      ? targeting.groupIds.filter((id) => id !== group.id)
      : [...targeting.groupIds, group.id];
    const countries = targeting.countries.filter((country) => !group.countries.includes(country));
    setEditedPromo({
      ...editedPromo,
      appliesTo: {
        ...editedPromo.appliesTo,
        countryGroups: groupIds,
        countries: countries.length > 0 ? countries : undefined,
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
    if (editedPromo && targeting && !hasFractionalSelectedPlan) {
      const { appliesTo } = editedPromo;
      const hasGroups = targeting.groupIds.length > 0 || appliesTo.countryGroups !== undefined;
      onSave({
        ...editedPromo,
        appliesTo: {
          ...appliesTo,
          countryGroups: hasGroups ? targeting.groupIds : undefined,
          countries: !hasGroups || targeting.countries.length > 0 ? targeting.countries : undefined,
        },
      });
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
    <Root>
      {(isLockedByOther ?? isLockedByUser) && (
        <LockBanner>
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
        </LockBanner>
      )}

      <Section>
        <SectionTitle>Basic Information</SectionTitle>
        <FormField
          fullWidth
          label="Name"
          value={editedPromo?.name ?? ''}
          onChange={(e) => handleFieldChange('name', e.target.value)}
          disabled={!isEditing}
        />
        <FormField
          fullWidth
          label="Description"
          multiline
          rows={3}
          value={editedPromo?.description ?? ''}
          onChange={(e) => handleFieldChange('description', e.target.value)}
          disabled={!isEditing}
        />
      </Section>

      <Section>
        <SectionTitle>Duration (UTC)</SectionTitle>
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
      </Section>

      <Section>
        <SectionTitle>Discount</SectionTitle>
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
      </Section>

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

      <Section>
        <SectionTitle>Availability</SectionTitle>
        <Typography variant="subtitle2" gutterBottom>
          Country Groups
        </Typography>
        <CountryGroupsContainer>
          <Grid container spacing={2}>
            {countryGroups.map((group) => {
              const checked = targeting?.groupIds.includes(group.id) ?? false;
              const indeterminate =
                targeting?.countries.some((country) => group.countries.includes(country)) ?? false;
              return (
                <Grid item xs={6} key={group.id}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={checked}
                        indeterminate={indeterminate}
                        inputProps={{ 'aria-checked': indeterminate ? 'mixed' : checked }}
                        onChange={() => handleCountryGroupToggle(group)}
                        disabled={!isEditing}
                      />
                    }
                    label={group.name}
                  />
                </Grid>
              );
            })}
          </Grid>
        </CountryGroupsContainer>
      </Section>
      {showLandingPageSection && (
        <Section>
          <SectionTitle>Landing page</SectionTitle>
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
              <InfoBanner>
                <Typography variant="body2">
                  Tip: When this option is enabled, the landing page top section content will be
                  replaced by the data specified below.
                </Typography>
              </InfoBanner>
              <PromoLandingPage
                landingPage={backupLandingPage}
                updateLandingPage={handleLandingPageChange}
                isEditing={isEditing}
              />
            </>
          )}
        </Section>
      )}

      {isEditing && (
        <ButtonGroup>
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
        </ButtonGroup>
      )}
    </Root>
  );
};

export default PromoEditor;
