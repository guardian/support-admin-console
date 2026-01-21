import React from 'react';
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  RadioGroup,
  Radio,
  Typography,
  Theme,
  Grid,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { DefaultProductSelection } from '../../../models/supportLandingPage';

const useStyles = makeStyles(({ spacing }: Theme) => ({
  container: {
    marginBottom: spacing(3),
  },
  sectionTitle: {
    marginBottom: spacing(2),
    fontWeight: 600,
  },
  formControl: {
    marginBottom: spacing(2),
  },
}));

interface DefaultProductSelectorProps {
  defaultProductSelection?: DefaultProductSelection;
  onDefaultProductSelectionChange: (selection: DefaultProductSelection | undefined) => void;
  editMode: boolean;
}

const DefaultProductSelector: React.FC<DefaultProductSelectorProps> = ({
  defaultProductSelection,
  onDefaultProductSelectionChange,
  editMode,
}) => {
  const classes = useStyles();

  const handleProductTypeChange = (productType: DefaultProductSelection['productType'] | '') => {
    if (productType === '') {
      handleClearDefault();
      return;
    }

    if (defaultProductSelection) {
      onDefaultProductSelectionChange({
        ...defaultProductSelection,
        productType,
      });
      return;
    }

    onDefaultProductSelectionChange({
      productType,
      billingPeriod: 'Monthly',
    });
  };

  const handleBillingPeriodChange = (billingPeriod: DefaultProductSelection['billingPeriod']) => {
    if (defaultProductSelection) {
      onDefaultProductSelectionChange({
        ...defaultProductSelection,
        billingPeriod,
      });
      return;
    }

    onDefaultProductSelectionChange({
      productType: 'Contribution',
      billingPeriod,
    });
  };

  const handleClearDefault = () => {
    onDefaultProductSelectionChange(undefined);
  };

  const getProductDisplayName = (productType: DefaultProductSelection['productType']) => {
    switch (productType) {
      case 'Contribution':
        return 'Contribution';
      case 'SupporterPlus':
        return 'Supporter Plus';
      case 'DigitalSubscription':
        return 'Digital Plus';
      default:
        return productType;
    }
  };

  return (
    <div className={classes.container}>
      <Typography className={classes.sectionTitle} variant="h6">
        Default Product Selection
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <FormControl component="fieldset" className={classes.formControl} disabled={!editMode}>
            <FormLabel component="legend">Default Product</FormLabel>
            <RadioGroup
              value={defaultProductSelection?.productType || ''}
              onChange={(e) => {
                const value = e.target.value as DefaultProductSelection['productType'] | '';
                handleProductTypeChange(value);
              }}
            >
              <FormControlLabel value="" control={<Radio />} label="No default (user chooses)" />
              <FormControlLabel value="Contribution" control={<Radio />} label="Contribution" />
              <FormControlLabel value="SupporterPlus" control={<Radio />} label="Supporter Plus" />
              <FormControlLabel
                value="DigitalSubscription"
                control={<Radio />}
                label="Digital Plus"
              />
            </RadioGroup>
          </FormControl>
        </Grid>

        {defaultProductSelection && (
          <Grid item xs={12} md={6}>
            <FormControl component="fieldset" className={classes.formControl} disabled={!editMode}>
              <FormLabel component="legend">
                Default Billing Period for{' '}
                {getProductDisplayName(defaultProductSelection.productType)}
              </FormLabel>
              <RadioGroup
                value={defaultProductSelection.billingPeriod}
                onChange={(e) =>
                  handleBillingPeriodChange(
                    e.target.value as DefaultProductSelection['billingPeriod'],
                  )
                }
              >
                <FormControlLabel value="Monthly" control={<Radio />} label="Monthly" />
                <FormControlLabel value="Annual" control={<Radio />} label="Annual" />
                <FormControlLabel value="OneTime" control={<Radio />} label="One-time" />
              </RadioGroup>
            </FormControl>
          </Grid>
        )}
      </Grid>
    </div>
  );
};

export default DefaultProductSelector;
