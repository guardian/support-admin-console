import React, { useEffect } from 'react';
import { Products, LandingPageProductDescription } from '../../../models/supportLandingPage';
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
import { useFieldArray, useForm, Controller } from 'react-hook-form';
import { copyLengthValidator, EMPTY_ERROR_HELPER_TEXT } from '../helpers/validation';

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
  onValidationChange: (isValid: boolean) => void;
}

export const ProductEditor: React.FC<ProductEditorProps> = ({
  editMode,
  productKey,
  product,
  onProductChange,
  onValidationChange,
}: ProductEditorProps) => {
  const classes = useStyles();

  // Validation for this product as a whole
  const { control, handleSubmit, errors, register } = useForm<LandingPageProductDescription>({
    mode: 'onChange',
    defaultValues: product,
  });

  // Validation specifically for the benefits array
  const { fields: benefits, append, remove } = useFieldArray({
    control,
    name: 'benefits',
  });

  useEffect(() => {
    const isValid = Object.keys(errors).length === 0;
    onValidationChange(isValid);
  }, [errors.title, errors.cta, errors.label, errors.benefits]);

  return (
    <Accordion key={productKey}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6">{productKey}</Typography>
      </AccordionSummary>
      <AccordionDetails className={classes.accordionDetails}>
        <TextField
          inputRef={register({ required: EMPTY_ERROR_HELPER_TEXT })}
          error={!!errors.title}
          helperText={errors?.title?.message}
          label="Title"
          name="title"
          required={true}
          onBlur={handleSubmit(onProductChange)}
          disabled={!editMode}
          fullWidth
        />
        <TextField
          inputRef={register({ required: EMPTY_ERROR_HELPER_TEXT })}
          error={!!errors.cta?.copy}
          helperText={errors?.cta?.copy?.message}
          label="CTA Copy"
          name="cta.copy"
          required={true}
          onBlur={handleSubmit(onProductChange)}
          disabled={!editMode}
          fullWidth
        />
        <TextField
          inputRef={register({
            validate: copyLengthValidator(30),
          })}
          error={!!errors.label?.copy}
          helperText={errors?.label?.copy?.message}
          label="Pill (optional)"
          name="label.copy"
          onBlur={handleSubmit(onProductChange)}
          disabled={!editMode}
          fullWidth
        />

        <div className={classes.benefitsHeading}>{buildBenefitsHeading(productKey)}</div>

        {benefits.map((benefit, index) => (
          <Grid container columns={9} spacing={1} key={benefit.id}>
            <Grid item xs={3}>
              <TextField
                label="Benefit Copy"
                required={true}
                name={`benefits[${index}].copy`}
                inputRef={register({ required: EMPTY_ERROR_HELPER_TEXT })}
                error={!!errors.benefits?.[index]?.copy}
                defaultValue={benefit.copy}
                onBlur={handleSubmit(onProductChange)}
                disabled={!editMode}
                fullWidth
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                label="Tooltip (optional)"
                name={`benefits[${index}].tooltip`}
                inputRef={register()}
                error={!!errors.benefits?.[index]?.tooltip}
                defaultValue={benefit.tooltip}
                onBlur={handleSubmit(onProductChange)}
                disabled={!editMode}
                fullWidth
              />
            </Grid>
            <Grid item xs={2}>
              <TextField
                label="Pill (optional)"
                name={`benefits[${index}].label.copy`}
                inputRef={register()}
                error={!!errors.benefits?.[index]?.label?.copy}
                defaultValue={benefit.label?.copy}
                onBlur={handleSubmit(onProductChange)}
                disabled={!editMode}
                fullWidth
              />
            </Grid>
            <Grid item xs={1}>
              <Button
                className={classes.deleteButton}
                onClick={() => {
                  remove(index);
                  onProductChange({
                    ...product,
                    benefits: product.benefits.filter((_, i) => i !== index),
                  });
                }}
                disabled={!editMode}
                variant="outlined"
                size="medium"
              >
                <CloseIcon />
              </Button>
            </Grid>
          </Grid>
        ))}
        <Button
          onClick={() => append({ copy: '' })}
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
  onValidationChange: (isValid: boolean) => void;
  editMode: boolean;
}

export const ProductsEditor: React.FC<ProductsEditorProps> = ({
  products,
  onProductsChange,
  onValidationChange,
  editMode,
}) => {
  const classes = useStyles();

  // Validation for all 3 products
  const { control, setError, clearErrors, errors } = useForm<Products>({
    mode: 'onChange',
    defaultValues: products,
  });

  useEffect(() => {
    const isValid = Object.keys(errors).length === 0;
    onValidationChange(isValid);
  }, [errors.Contribution, errors.SupporterPlus, errors.TierThree]);

  return (
    <div>
      <Typography className={classes.heading} variant="h5">
        Products
      </Typography>

      {productKeys.map(productKey => (
        <Controller
          key={productKey}
          control={control}
          name={productKey}
          render={field => (
            <ProductEditor
              productKey={productKey}
              editMode={editMode}
              product={field.value}
              onProductChange={updatedProduct =>
                onProductsChange({ ...products, [productKey]: updatedProduct })
              }
              onValidationChange={isValid => {
                if (!isValid) {
                  setError(productKey, { message: `Product ${productKey} is not valid` });
                } else {
                  clearErrors(productKey);
                }
              }}
            />
          )}
        />
      ))}
    </div>
  );
};
