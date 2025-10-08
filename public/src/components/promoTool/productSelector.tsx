import React from 'react';
import { makeStyles } from '@mui/styles';
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { productIds, Products, PromoProduct, PromoProductNames } from './utils/promoModels';

const useStyles = makeStyles(() => ({
  select: {
    marginBottom: '8px',
    width: '100%',
  },
}));

export interface ProductSelectorProps {
  selectedValue: string;
  handleSelectedValue: (event: Products) => void;
}

export const ProductSelector: React.FC<ProductSelectorProps> = ({
  selectedValue,
  handleSelectedValue,
}: ProductSelectorProps) => {
  const classes = useStyles();

  console.log(productIds);

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
        {productIds.map((product, index) => (
          <MenuItem value={product} key={index}>
            {PromoProductNames[product]}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
