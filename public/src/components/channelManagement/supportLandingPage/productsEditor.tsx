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
import {
  copyLengthValidator,
  EMPTY_ERROR_HELPER_TEXT,
  PRICE_PRODUCT_WEEKLY,
} from '../helpers/validation';
import { RichTextEditorSingleLine } from '../richTextEditor/richTextEditor';

const productKeys: (keyof Products)[] = ['Contribution', 'SupporterPlus', 'DigitalSubscription'];

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
  if (product === 'DigitalSubscription') {
    return 'Benefits (in addition to Supporter Plus benefits):';
  } else {
    return 'Benefits:';
  }
};

// Validator for billingPeriodsCopy that accounts for template rendering
const billingPeriodsCopyValidator =
  (maxLength: number) =>
  (copy: string | undefined): string | undefined => {
    if (!copy) {
      return undefined;
    }

    // Replace PRICE_PRODUCT_WEEKLY template (24 chars) with its rendered length (6 chars for '£00.00')
    const renderedLength = copy.replace(
      new RegExp(PRICE_PRODUCT_WEEKLY.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
      'X'.repeat(6),
    ).length;

    return renderedLength > maxLength
      ? `Max length is ${maxLength} (rendered: ${renderedLength})`
      : undefined;
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
  const {
    control,
    handleSubmit,
    register,
    reset,

    formState: { errors },
  } = useForm<LandingPageProductDescription>({
    mode: 'onChange',
    defaultValues: product,
  });

  // Validation specifically for the benefits array
  const {
    fields: benefits,
    append,
    remove,
  } = useFieldArray({
    control,
    name: 'benefits',
  });

  useEffect(() => {
    const isValid = Object.keys(errors).length === 0;
    onValidationChange(isValid);
  }, [errors.title, errors.billingPeriodsCopy, errors.cta, errors.label, errors.benefits]);

  useEffect(() => {
    reset(product);
  }, [product, reset]);

  return (
    <Accordion key={productKey}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6">{productKey}</Typography>
      </AccordionSummary>
      <AccordionDetails className={classes.accordionDetails}>
        <TextField
          error={!!errors.title}
          helperText={errors?.title?.message}
          label="Title"
          {...register('title', { required: EMPTY_ERROR_HELPER_TEXT })}
          required={true}
          onBlur={handleSubmit(onProductChange)}
          disabled={!editMode}
          fullWidth
        />
        <TextField
          error={!!errors.titlePill}
          helperText={errors?.titlePill?.message}
          label="Title Pill"
          {...register('titlePill')}
          required={false}
          onBlur={handleSubmit(onProductChange)}
          disabled={!editMode}
          fullWidth
        />
        <Controller
          name="billingPeriodsCopy"
          control={control}
          rules={{
            validate: billingPeriodsCopyValidator(42),
          }}
          render={({ field }) => (
            <RichTextEditorSingleLine
              error={!!errors.billingPeriodsCopy}
              helperText={errors.billingPeriodsCopy ? errors.billingPeriodsCopy.message || '' : ''}
              copyData={field.value}
              updateCopy={(value) => {
                field.onChange(value);
                handleSubmit(onProductChange)();
              }}
              name="billingPeriodsCopy"
              label="Billing Periods Copy"
              disabled={!editMode}
              rteMenuConstraints={{
                noArticleCountTemplate: true,
                noCampaignDeadlineTemplate: true,
                noDayTemplate: true,
                noDateTemplate: true,
                noCountryNameTemplate: true,
                noCurrencyTemplate: true,
                noPriceTemplates: true,
                noBold: true,
                noItalic: true,
              }}
            />
          )}
        />
        <TextField
          error={!!errors.cta?.copy}
          helperText={errors?.cta?.copy?.message}
          label="CTA Copy"
          {...register('cta.copy', { required: EMPTY_ERROR_HELPER_TEXT })}
          required={true}
          onBlur={handleSubmit(onProductChange)}
          disabled={!editMode}
          fullWidth
        />
        <TextField
          error={!!errors.label?.copy}
          helperText={errors?.label?.copy?.message}
          label="Pill (optional)"
          {...register('label.copy', {
            validate: copyLengthValidator(30),
          })}
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
                {...register(`benefits.${index}.copy`, {
                  required: EMPTY_ERROR_HELPER_TEXT,
                  validate: copyLengthValidator(116),
                })}
                error={!!errors.benefits?.[index]?.copy}
                helperText={errors.benefits?.[index]?.copy?.message}
                defaultValue={benefit.copy}
                onBlur={handleSubmit(onProductChange)}
                disabled={!editMode}
                fullWidth
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                label="Tooltip (optional)"
                {...register(`benefits.${index}.tooltip`)}
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
                {...register(`benefits.${index}.label.copy`)}
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
          disabled={!editMode || benefits.length >= 8}
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
  const {
    control,
    setError,
    clearErrors,
    reset,

    formState: { errors },
  } = useForm<Products>({
    mode: 'onChange',
    defaultValues: products,
  });

  useEffect(() => {
    const isValid = Object.keys(errors).length === 0;
    onValidationChange(isValid);
  }, [errors.Contribution, errors.SupporterPlus, errors.DigitalSubscription]);

  useEffect(() => {
    reset(products);
  }, [products, reset]);

  return (
    <div>
      <Typography className={classes.heading} variant="h5">
        Products
      </Typography>

      {productKeys.map((productKey) => (
        <Controller
          key={productKey}
          control={control}
          name={productKey}
          render={({ field }) => (
            <ProductEditor
              productKey={productKey}
              editMode={editMode}
              product={field.value}
              onProductChange={(updatedProduct) =>
                onProductsChange({ ...products, [productKey]: updatedProduct })
              }
              onValidationChange={(isValid) => {
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
