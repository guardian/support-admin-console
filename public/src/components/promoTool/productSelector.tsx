import React from 'react';
import { PromoProduct } from './utils/promoModels';
import { makeStyles } from '@mui/styles';
import { InputLabel, MenuItem, Select } from '@mui/material';

interface ProductSelectorProps {
  promoProductNames: Record<PromoProduct, string>;
}

interface MapableData {
  name: string;
  description: string;
}

const useStyles = makeStyles(() => ({
  select: {
    marginBottom: '8px',
    width: '100%',
  },
}));

export function ProductSelector({ promoProductNames }: ProductSelectorProps): React.ReactElement {
  const classes = useStyles();

  const createMapableDataStructure = () => {
    {
      const useableDataStructure: MapableData[] = new Array<MapableData>();
      Object.entries(promoProductNames).forEach(([promoProductkey, promoProductvalue]) => {
        useableDataStructure.push({ name: promoProductkey, description: promoProductvalue });
      });
      return useableDataStructure;
    }
  };

  const mapableDataStructure = createMapableDataStructure();

  return (
    <>
      <InputLabel>Select a Product</InputLabel>
      <Select className={classes.select} value="" aria-label="Select Product">
        {mapableDataStructure.map(product => (
          <MenuItem value={product.name} key={product.name}>
            {product.description}
          </MenuItem>
        ))}
      </Select>
    </>
  );
}

export default ProductSelector;
