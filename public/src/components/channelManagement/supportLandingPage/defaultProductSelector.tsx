import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';
import { DefaultProductSelection } from '../../../models/supportLandingPage';

const Container = styled('div')(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));
const SectionTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  fontWeight: 600,
}));
const FormControlWithMargin = styled(FormControl)(({ theme }) => ({
  marginBottom: theme.spacing(2),
})) as typeof FormControl;

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
    <Container>
      <SectionTitle variant="h6">Default Product Selection</SectionTitle>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <FormControlWithMargin component="fieldset" disabled={!editMode}>
            <FormLabel component="legend">Default Product</FormLabel>
            <RadioGroup
              value={defaultProductSelection?.productType ?? ''}
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
          </FormControlWithMargin>
        </Grid>

        {defaultProductSelection && (
          <Grid item xs={12} md={6}>
            <FormControlWithMargin component="fieldset" disabled={!editMode}>
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
            </FormControlWithMargin>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default DefaultProductSelector;
