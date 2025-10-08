import React from 'react';
import { makeStyles } from '@mui/styles';
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { promoProductNames } from './utils/promoModels';

const useStyles = makeStyles(() => ({
  select: {
    marginBottom: '8px',
    width: '100%',
  },
}));

export interface ProductSelectorProps {
  selectedValue: string;
  handleSelectedValue: (selectedValue: string) => void;
}

export const ProductSelector: React.FC<ProductSelectorProps> = 
({selectedValue, handleSelectedValue} :ProductSelectorProps) => {
  const classes = useStyles();

  const handleProductSelectorChange = (selectedValue: string) => {
    handleSelectedValue(selectedValue);
  };

  return (
    <FormControl fullWidth>
      <InputLabel id="product-selector-label">Select a Product</InputLabel>
      <Select
        id="product-selector-label"
        className={classes.select}
        onChange={(event: SelectChangeEvent): void =>
          handleProductSelectorChange(event.target.value)
        }
        value=""
        aria-label="Select Product"
      >
        {Object.entries(promoProductNames).map(([code, description]) => (
          <MenuItem value={code} key={code}>
            {description}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
