import React from 'react';
import { TextField, Typography, FormControlLabel, Checkbox, MenuItem } from '@mui/material';
import {
  CheckoutNudgeVariant,
  Product,
  Copy,
  ProductType,
  RatePlan,
} from '../../../models/checkoutNudge';
import { useStyles } from '../helpers/testEditorStyles';
import { PRODUCTS, getAvailableRatePlans, ONE_TIME_PLANS, RECURRING_PLANS } from './utils/defaults';
import PromoCodesEditor from '../choiceCards/PromoCodesEditor';

interface VariantEditorProps {
  variant: CheckoutNudgeVariant;
  onVariantChange: (update: (current: CheckoutNudgeVariant) => CheckoutNudgeVariant) => void;
  onDelete: () => void;
  editMode: boolean;
  onValidationChange: (isValid: boolean) => void;
}

const VariantEditor: React.FC<VariantEditorProps> = ({
  variant,
  onVariantChange,
  editMode,
  onValidationChange,
}) => {
  const classes = useStyles();

  const hasNudge = !!variant.nudge;

  const updateNudgeToProduct = (update: (current: Product) => Product): void => {
    onVariantChange(current => ({
      ...current,
      nudge: current.nudge
        ? {
            ...current.nudge,
            nudgeToProduct: update(current.nudge.nudgeToProduct),
          }
        : undefined,
    }));
  };

  const updateNudgeCopy = (update: (current: Copy) => Copy): void => {
    onVariantChange(current => ({
      ...current,
      nudge: current.nudge
        ? {
            ...current.nudge,
            nudgeCopy: update(current.nudge.nudgeCopy),
          }
        : undefined,
    }));
  };

  const updateThankyouCopy = (update: (current: Copy) => Copy): void => {
    onVariantChange(current => ({
      ...current,
      nudge: current.nudge
        ? {
            ...current.nudge,
            thankyouCopy: update(current.nudge.thankyouCopy),
          }
        : undefined,
    }));
  };

  const updateBenefits = (label: string): void => {
    onVariantChange(current => ({
      ...current,
      nudge: current.nudge
        ? {
            ...current.nudge,
            benefits: label ? { label } : undefined,
          }
        : undefined,
    }));
  };

  const toggleNudge = (): void => {
    onVariantChange(current => ({
      ...current,
      nudge: current.nudge
        ? undefined
        : {
            nudgeCopy: { heading: '', body: '' },
            thankyouCopy: { heading: '', body: '' },
            nudgeToProduct: { product: 'Contribution', ratePlan: 'Monthly' },
          },
    }));
  };

  const getAvailableRatePlansForProduct = (): typeof ONE_TIME_PLANS | typeof RECURRING_PLANS => {
    const { product } = variant.nudge?.nudgeToProduct || { product: 'Contribution' };
    return getAvailableRatePlans(product);
  };

  React.useEffect(() => {
    // Basic validation: if nudge exists, heading should be present
    const isValid =
      !hasNudge || (!!variant.nudge?.nudgeCopy.heading && !!variant.nudge?.thankyouCopy.heading);
    onValidationChange(isValid);
  }, [variant, hasNudge, onValidationChange]);

  return (
    <div className={classes.container}>
      <FormControlLabel
        control={
          <Checkbox
            checked={hasNudge}
            onChange={toggleNudge}
            disabled={!editMode}
            color="primary"
          />
        }
        label="Show nudge for this variant"
      />

      {hasNudge && variant.nudge && (
        <>
          <div className={classes.sectionContainer}>
            <Typography variant="h4" className={classes.sectionHeader}>
              Nudge to Product
            </Typography>
            <TextField
              select
              label="Product"
              value={variant.nudge.nudgeToProduct.product}
              onChange={(e): void =>
                updateNudgeToProduct(current => ({
                  ...current,
                  product: e.target.value as ProductType,
                }))
              }
              disabled={!editMode}
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
              value={variant.nudge.nudgeToProduct.ratePlan || ''}
              onChange={(e): void =>
                updateNudgeToProduct(current => ({
                  ...current,
                  ratePlan: e.target.value ? (e.target.value as RatePlan) : undefined,
                }))
              }
              disabled={!editMode}
              fullWidth
              margin="normal"
            >
              <MenuItem value="">
                <em>Any</em>
              </MenuItem>
              {getAvailableRatePlansForProduct().map((option: { value: string; label: string }) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </div>

          <div className={classes.sectionContainer}>
            <Typography variant="h4" className={classes.sectionHeader}>
              Nudge Copy
            </Typography>
            <TextField
              label="Heading"
              value={variant.nudge.nudgeCopy.heading}
              onChange={(e): void =>
                updateNudgeCopy(current => ({ ...current, heading: e.target.value }))
              }
              disabled={!editMode}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Body"
              value={variant.nudge.nudgeCopy.body || ''}
              onChange={(e): void =>
                updateNudgeCopy(current => ({ ...current, body: e.target.value }))
              }
              disabled={!editMode}
              fullWidth
              margin="normal"
              multiline
              rows={3}
            />
          </div>

          <div className={classes.sectionContainer}>
            <Typography variant="h4" className={classes.sectionHeader}>
              Thank You Copy
            </Typography>
            <TextField
              label="Heading"
              value={variant.nudge.thankyouCopy.heading}
              onChange={(e): void =>
                updateThankyouCopy(current => ({ ...current, heading: e.target.value }))
              }
              disabled={!editMode}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Body"
              value={variant.nudge.thankyouCopy.body}
              onChange={(e): void =>
                updateThankyouCopy(current => ({ ...current, body: e.target.value }))
              }
              disabled={!editMode}
              fullWidth
              margin="normal"
              multiline
              rows={3}
            />
          </div>

          <div className={classes.sectionContainer}>
            <Typography variant="h4" className={classes.sectionHeader}>
              Benefits (Optional)
            </Typography>
            <TextField
              label="Benefits Label"
              value={variant.nudge.benefits?.label || ''}
              onChange={(e): void => updateBenefits(e.target.value)}
              disabled={!editMode}
              fullWidth
              margin="normal"
              helperText="e.g., 'Your all-access benefits:'"
            />
          </div>
        </>
      )}

      <div className={classes.sectionContainer}>
        <Typography variant="h4" className={classes.sectionHeader}>
          Promo Codes
        </Typography>
        <PromoCodesEditor
          promoCodes={variant.promoCodes ?? []}
          updatePromoCodes={(promoCodes: string[]): void => {
            onVariantChange(current => ({ ...current, promoCodes }));
          }}
          isDisabled={!editMode}
        />
      </div>
    </div>
  );
};

export default VariantEditor;
