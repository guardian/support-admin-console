import React from 'react';
import { PromoProduct } from './utils/promoModels';
import { makeStyles } from '@mui/styles';
import { InputLabel, MenuItem, Select } from '@mui/material';

interface ProductSelectorProps {
  promoProductNames: Record<PromoProduct, string>;
}

const useStyles = makeStyles(() => ({
  select: {
    marginBottom: '8px',
    width: '100%',
  },
}));

export function ProductSelector({ promoProductNames }: ProductSelectorProps): React.ReactElement {
  const classes = useStyles();

  return (
    <>
      <InputLabel>Select a Product</InputLabel>
      <Select className={classes.select} value="" aria-label="Select Product">
        {Object.entries(promoProductNames).map(([code, description]) => (
          <MenuItem value={code} key={code}>
            {description}
          </MenuItem>
        ))}
      </Select>
    </>
  );
}

export default ProductSelector;
