import React from 'react';
import { makeStyles } from '@mui/styles';
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { PromoProduct, promoProductNames } from './utils/promoModels';

const useStyles = makeStyles(() => ({
  select: {
    marginBottom: '8px',
    width: '100%',
  },
}));

export interface ProductSelectorProps {
  selectedValue: string;
  handleSelectedValue: (product: PromoProduct) => void;
}

export const ProductSelector: React.FC<ProductSelectorProps> = ({
  selectedValue,
  handleSelectedValue,
}: ProductSelectorProps) => {
  const classes = useStyles();

  const handleProductSelectorChange = (selectedValue: PromoProduct) => {
    handleSelectedValue(selectedValue);
  };
  return (
    <FormControl fullWidth>
      <InputLabel id="product-selector-label">Select a Product</InputLabel>
      <Select
        id="product-selector-label"
        className={classes.select}
        value={selectedValue}
        onChange={(event: SelectChangeEvent): void =>
          handleProductSelectorChange(event.target.value as PromoProduct)
        }
        aria-label="Select a Product"
      >
        {Object.entries(promoProductNames).map(([product, label], index) => (
          <MenuItem value={product} key={index}>
            {label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
