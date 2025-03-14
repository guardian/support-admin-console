import React from 'react';
import {
  Products,
  LandingPageProductDescription,
  ProductBenefit,
} from '../../../models/supportLandingPage';
import {
  TextField,
  Typography,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Theme,
  Button,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { makeStyles } from '@mui/styles';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';

const productKeys: (keyof Products)[] = ['Contribution', 'SupporterPlus', 'TierThree'];

const useStyles = makeStyles(({ spacing }: Theme) => ({
  heading: {
    marginBottom: spacing(1),
  },
  accordionDetails: {
    paddingTop: spacing(2),
    '& > * + *': {
      marginTop: spacing(3),
    },
  },
  benefitsHeading: {
    fontWeight: 700,
  },
  deleteButton: {
    height: '100%',
  },
}));

const buildBenefitsHeading = (product: keyof Products) => {
  if (product === 'TierThree') {
    return 'Benefits (in addition to Supporter Plus benefits):';
  } else {
    return 'Benefits:';
  }
};

interface ProductEditorProps {
  editMode: boolean;
  productKey: keyof Products;
  product: LandingPageProductDescription;
  onProductChange: (updatedProduct: LandingPageProductDescription) => void;
}

export const ProductEditor: React.FC<ProductEditorProps> = ({
  editMode,
  productKey,
  product,
  onProductChange,
}: ProductEditorProps) => {
  const classes = useStyles();

  return (
    <Accordion key={productKey}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6">{productKey}</Typography>
      </AccordionSummary>
      <AccordionDetails className={classes.accordionDetails}>
        <TextField
          label="Title"
          required={true}
          value={product.title}
          onChange={e => onProductChange({ ...product, title: e.target.value })}
          disabled={!editMode}
          fullWidth
        />
        <TextField
          label="CTA Copy"
          required={true}
          value={product.cta.copy}
          onChange={e => {
            onProductChange({ ...product, cta: { copy: e.target.value } });
          }}
          disabled={!editMode}
          fullWidth
        />
        <TextField
          label="Pill (optional)"
          value={product.label?.copy}
          onChange={e => {
            const label = e.target.value ? { copy: e.target.value } : undefined;
            onProductChange({ ...product, label });
          }}
          disabled={!editMode}
          fullWidth
        />

        <div className={classes.benefitsHeading}>{buildBenefitsHeading(productKey)}</div>

        {product.benefits.map((benefit, index) => {
          const updateBenefit = (updatedBenefit: ProductBenefit) => {
            const updatedBenefits = [
              ...product.benefits.slice(0, index),
              updatedBenefit,
              ...product.benefits.slice(index + 1),
            ];
            onProductChange({
              ...product,
              benefits: updatedBenefits,
            });
          };

          return (
            <Grid container columns={9} spacing={1} key={index}>
              <Grid item xs={3}>
                <TextField
                  label="Benefit Copy"
                  required={true}
                  value={benefit.copy}
                  onChange={e => updateBenefit({ ...benefit, copy: e.target.value })}
                  disabled={!editMode}
                  fullWidth
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  label="Tooltip (optional)"
                  value={benefit.tooltip || ''}
                  required={false}
                  onChange={e => {
                    const tooltip = e.target.value || undefined;
                    updateBenefit({ ...benefit, tooltip });
                  }}
                  disabled={!editMode}
                  fullWidth
                />
              </Grid>
              <Grid item xs={2}>
                <TextField
                  label="Pill (optional)"
                  value={benefit.label?.copy || ''}
                  required={false}
                  onChange={e => {
                    const label = e.target.value ? { copy: e.target.value } : undefined;
                    updateBenefit({ ...benefit, label });
                  }}
                  disabled={!editMode}
                  fullWidth
                />
              </Grid>
              <Grid item xs={1}>
                <Button
                  className={classes.deleteButton}
                  onClick={() => {
                    const updatedBenefits = [
                      ...product.benefits.slice(0, index),
                      ...product.benefits.slice(index + 1),
                    ];
                    onProductChange({ ...product, benefits: updatedBenefits });
                  }}
                  disabled={!editMode}
                  variant="outlined"
                  size="medium"
                >
                  <CloseIcon />
                </Button>
              </Grid>
            </Grid>
          );
        })}
        <Button
          onClick={() =>
            onProductChange({
              ...product,
              benefits: [...product.benefits, { copy: '' }],
            })
          }
          disabled={!editMode}
          variant="outlined"
          size="medium"
        >
          <AddIcon />
        </Button>
      </AccordionDetails>
    </Accordion>
  );
};

interface ProductsEditorProps {
  products: Products;
  onProductsChange: (updatedProducts: Products) => void;
  editMode: boolean;
}

export const ProductsEditor: React.FC<ProductsEditorProps> = ({
  products,
  onProductsChange,
  editMode,
}) => {
  const classes = useStyles();

  return (
    <div>
      <Typography className={classes.heading} variant="h5">
        Products
      </Typography>

      {productKeys.map(productKey => (
        <ProductEditor
          key={productKey}
          productKey={productKey}
          editMode={editMode}
          product={products[productKey]}
          onProductChange={updatedProduct =>
            onProductsChange({
              ...products,
              [productKey]: updatedProduct,
            })
          }
        />
      ))}
    </div>
  );
};
