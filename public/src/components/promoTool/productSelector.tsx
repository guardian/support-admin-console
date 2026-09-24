import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';
import { PromoProduct, promoProductNames } from './utils/promoModels';

const StyledSelect = styled(Select)({
  marginBottom: '8px',
  width: '100%',
});

const isPromoProduct = (value: unknown): value is PromoProduct =>
  typeof value === 'string' && Object.prototype.hasOwnProperty.call(promoProductNames, value);

export interface ProductSelectorProps {
  selectedValue: string;
  handleSelectedValue: (product: PromoProduct) => void;
}

export const ProductSelector: React.FC<ProductSelectorProps> = ({
  selectedValue,
  handleSelectedValue,
}: ProductSelectorProps) => {
  const handleProductSelectorChange = (selectedValue: PromoProduct) => {
    handleSelectedValue(selectedValue);
  };
  return (
    <FormControl fullWidth>
      <InputLabel id="product-selector-label">Select a Product</InputLabel>
      <StyledSelect
        id="product-selector-label"
        value={selectedValue}
        onChange={(event: SelectChangeEvent<unknown>): void => {
          if (isPromoProduct(event.target.value)) {
            handleProductSelectorChange(event.target.value);
          }
        }}
        aria-label="Select a Product"
      >
        {Object.entries(promoProductNames).map(([product, label], index) => (
          <MenuItem value={product} key={index}>
            {label}
          </MenuItem>
        ))}
      </StyledSelect>
    </FormControl>
  );
};
