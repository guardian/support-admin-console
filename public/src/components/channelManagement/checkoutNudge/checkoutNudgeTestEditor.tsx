import React from 'react';
import { ValidatedTestEditorProps } from '../validatedTestEditor';
import { CheckoutNudgeTest, CheckoutNudgeVariant, Product } from '../../../models/checkoutNudge';
import { Typography, TextField, MenuItem } from '@mui/material';
import VariantsEditor from '../../tests/variants/variantsEditor';
import { useStyles } from '../helpers/testEditorStyles';
import { getDefaultVariant, PRODUCTS, RATE_PLANS } from './utils/defaults';
import VariantSummary from '../../tests/variants/variantSummary';
import VariantEditor from './variantEditor';
import TestEditorTargetRegionsSelector from '../testEditorTargetRegionsSelector';
import { RegionTargeting } from '../helpers/shared';

const CheckoutNudgeTestEditor: React.FC<ValidatedTestEditorProps<CheckoutNudgeTest>> = ({
  test,
  userHasTestLocked,
  onTestChange,
  setValidationStatusForField,
}: ValidatedTestEditorProps<CheckoutNudgeTest>) => {
  const classes = useStyles();

  const onVariantsChange = (
    update: (current: CheckoutNudgeVariant[]) => CheckoutNudgeVariant[],
  ): void => {
    onTestChange(current => {
      const updatedVariantList = update(current.variants);
      return { ...current, variants: updatedVariantList };
    });
  };

  const onVariantChange = (variantName: string) => (
    update: (current: CheckoutNudgeVariant) => CheckoutNudgeVariant,
  ): void => {
    onVariantsChange(current =>
      current.map(variant => {
        if (variant.name === variantName) {
          return update(variant);
        }
        return variant;
      }),
    );
  };

  const onVariantDelete = (deletedVariantName: string): void => {
    onVariantsChange(current => current.filter(variant => variant.name !== deletedVariantName));
  };

  const createVariant = (name: string): void => {
    const newVariant: CheckoutNudgeVariant = {
      ...getDefaultVariant(),
      name: name,
    };
    onVariantsChange(current => [...current, newVariant]);
  };

  const onTargetingChange = (updatedTargeting: RegionTargeting): void => {
    onTestChange(current => ({
      ...current,
      regionTargeting: updatedTargeting,
    }));
  };

  const updateNudgeFromProduct = (update: (current: Product) => Product): void => {
    onTestChange(current => ({
      ...current,
      nudgeFromProduct: update(current.nudgeFromProduct),
    }));
  };

  const renderVariantEditor = (variant: CheckoutNudgeVariant): React.ReactElement => (
    <VariantEditor
      key={`checkout-nudge-${test.name}-${variant.name}`}
      variant={variant}
      onVariantChange={onVariantChange(variant.name)}
      onDelete={(): void => onVariantDelete(variant.name)}
      editMode={userHasTestLocked}
      onValidationChange={(isValid: boolean): void =>
        setValidationStatusForField(variant.name, isValid)
      }
    />
  );

  const renderVariantSummary = (variant: CheckoutNudgeVariant): React.ReactElement => {
    return (
      <VariantSummary
        name={variant.name}
        testName={test.name}
        testType="LANDING_PAGE"
        isInEditMode={userHasTestLocked}
        platform="DOTCOM"
        articleType="Standard"
      />
    );
  };

  const onVariantClone = (
    originalVariant: CheckoutNudgeVariant,
    clonedVariantName: string,
  ): void => {
    const newVariant: CheckoutNudgeVariant = {
      ...originalVariant,
      name: clonedVariantName,
    };
    onVariantsChange(current => [...current, newVariant]);
  };

  if (test) {
    return (
      <div className={classes.container}>
        <div className={classes.sectionContainer}>
          <Typography variant={'h3'} className={classes.sectionHeader}>
            Nudge From Product
          </Typography>
          <Typography variant="body2" color="textSecondary" style={{ marginBottom: 16 }}>
            Configure which product checkout this nudge appears on
          </Typography>
          <TextField
            select
            label="Product"
            value={test.nudgeFromProduct.product}
            onChange={(e): void =>
              updateNudgeFromProduct(current => ({ ...current, product: e.target.value }))
            }
            disabled={!userHasTestLocked}
            fullWidth
            margin="normal"
          >
            {PRODUCTS.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Rate Plan (Optional)"
            value={test.nudgeFromProduct.ratePlan || ''}
            onChange={(e): void =>
              updateNudgeFromProduct(current => ({
                ...current,
                ratePlan: e.target.value || undefined,
              }))
            }
            disabled={!userHasTestLocked}
            fullWidth
            margin="normal"
          >
            <MenuItem value="">
              <em>Any</em>
            </MenuItem>
            {RATE_PLANS.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </div>

        <div className={classes.sectionContainer}>
          <Typography variant={'h3'} className={classes.sectionHeader}>
            Variants
          </Typography>
          <div>
            <VariantsEditor
              variants={test.variants}
              createVariant={createVariant}
              testName={test.name}
              editMode={userHasTestLocked}
              renderVariantEditor={renderVariantEditor}
              renderVariantSummary={renderVariantSummary}
              onVariantDelete={onVariantDelete}
              onVariantClone={onVariantClone}
            />
          </div>
        </div>

        <div className={classes.sectionContainer}>
          <Typography variant={'h3'} className={classes.sectionHeader}>
            Target audience
          </Typography>

          <TestEditorTargetRegionsSelector
            regionTargeting={test.regionTargeting}
            onRegionTargetingUpdate={onTargetingChange}
            isDisabled={!userHasTestLocked}
          />
        </div>
      </div>
    );
  }
  return null;
};

export default CheckoutNudgeTestEditor;
