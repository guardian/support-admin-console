import { ChoiceCard, Product } from '../../../models/choiceCards';
import React from 'react';
import {
  Checkbox,
  InputLabel,
  MenuItem,
  Select,
  FormControl,
  TextField,
  RadioGroup,
  Button,
  Radio,
  AccordionSummary,
  Typography,
  Accordion,
  AccordionDetails,
  Theme,
} from '@mui/material';
import { useFieldArray, useForm, Controller } from 'react-hook-form';
import FormControlLabel from '@mui/material/FormControlLabel';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { makeStyles } from '@mui/styles';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';

const useStyles = makeStyles(({ spacing }: Theme) => ({
  productContainer: {
    '& > * + *': {
      marginLeft: spacing(2),
    },
  },
  benefitsHeading: {
    fontWeight: 700,
  },
  benefitContainer: {
    display: 'flex',
  },
  deleteButton: {
    margin: `${spacing(2)} 0 ${spacing(1)} ${spacing(1)}`,
  },
}));

const productDisplayName = (product: Product) => {
  if (product.supportTier === 'OneOff') {
    return 'One-off Contribution';
  } else if (product.supportTier === 'Contribution') {
    return `Recurring Contribution - ${product.ratePlan}`;
  } else {
    return `Supporter Plus - ${product.ratePlan}`;
  }
};

interface ChoiceCardEditorProps {
  choiceCard: ChoiceCard;
  onChange: (choiceCard: ChoiceCard) => void;
  isDisabled: boolean;
  index: number;
}
export const ChoiceCardEditor: React.FC<ChoiceCardEditorProps> = ({
  choiceCard,
  onChange,
  isDisabled,
  index,
}) => {
  const classes = useStyles();

  const {
    control,
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm<ChoiceCard>({
    defaultValues: choiceCard,
    mode: 'onChange',
  });

  const { fields: benefits, append, remove } = useFieldArray({
    control,
    name: 'benefits',
  });

  const onFormChange = (update: ChoiceCard) => {
    const pill = update.pill?.copy ? update.pill : undefined;
    onChange({
      ...update,
      pill,
    });
  };

  return (
    <Accordion key={`${choiceCard.product.supportTier}-${index}`}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6">{productDisplayName(choiceCard.product)}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <form onChange={handleSubmit(onFormChange)}>
          <div className={classes.productContainer}>
            <FormControl disabled={isDisabled} margin="normal">
              <InputLabel id="supportTier-label">Support Tier</InputLabel>
              <Controller
                name="product.supportTier"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    labelId="supportTier-label"
                    value={field.value}
                    onChange={e => {
                      field.onChange(e);
                      const newSupportTier = e.target.value as Product['supportTier'];
                      const oldSupportTier = choiceCard.product.supportTier;

                      const buildProduct = (): Product => {
                        if (newSupportTier === 'OneOff') {
                          return { supportTier: 'OneOff' };
                        } else if (oldSupportTier === 'OneOff') {
                          // Default to monthly
                          return {
                            supportTier: newSupportTier,
                            ratePlan: 'Monthly',
                          };
                        } else {
                          return {
                            supportTier: newSupportTier,
                            ratePlan: choiceCard.product.ratePlan,
                          };
                        }
                      };
                      const updatedProduct = buildProduct();
                      onFormChange({
                        ...choiceCard,
                        product: updatedProduct,
                      });
                      // The ratePlan UI doesn't update unless we trigger an update on that field
                      if (updatedProduct.supportTier !== 'OneOff') {
                        setValue('product.ratePlan', updatedProduct.ratePlan, {
                          shouldValidate: true,
                        });
                      }
                    }}
                  >
                    <MenuItem value="Contribution">Recurring Contribution</MenuItem>
                    <MenuItem value="SupporterPlus">Supporter Plus</MenuItem>
                    <MenuItem value="OneOff">One-off Contribution</MenuItem>
                  </Select>
                )}
              />
            </FormControl>

            {['Contribution', 'SupporterPlus'].includes(choiceCard.product.supportTier) && (
              <FormControl component="fieldset" margin="normal" disabled={isDisabled}>
                <Controller
                  name="product.ratePlan"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup row {...field} onChange={e => field.onChange(e.target.value)}>
                      <FormControlLabel value="Monthly" control={<Radio />} label="Monthly" />
                      <FormControlLabel value="Annual" control={<Radio />} label="Annual" />
                    </RadioGroup>
                  )}
                />
              </FormControl>
            )}
          </div>

          <TextField
            label={
              choiceCard.product.supportTier === 'OneOff'
                ? 'Label'
                : `Label is auto-generated for ${choiceCard.product.supportTier}`
            }
            variant="filled"
            fullWidth
            margin="normal"
            disabled={isDisabled || choiceCard.product.supportTier !== 'OneOff'}
            error={!!errors.label}
            helperText={errors.label?.message}
            {...register('label')}
            onBlur={handleSubmit(onFormChange)}
          />

          <TextField
            label="Benefits Label"
            variant="filled"
            fullWidth
            margin="normal"
            disabled={isDisabled}
            error={!!errors.benefitsLabel}
            helperText={errors.benefitsLabel?.message}
            {...register('benefitsLabel', {
              setValueAs: value => value || undefined,
            })}
            onBlur={handleSubmit(onFormChange)}
          />

          <TextField
            label="Pill Copy"
            variant="filled"
            fullWidth
            margin="normal"
            disabled={isDisabled}
            {...register('pill.copy', {
              setValueAs: value => value || undefined,
            })}
            onBlur={handleSubmit(onFormChange)}
          />

          <FormControlLabel
            control={
              <Controller
                name="isDefault"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    {...field}
                    checked={field.value}
                    color="primary"
                    disabled={isDisabled}
                  />
                )}
              />
            }
            label="Is Default"
          />

          <div>
            <label className={classes.benefitsHeading}>Benefits</label>
            {benefits.map((benefit, index) => (
              <div className={classes.benefitContainer} key={benefit.id}>
                <TextField
                  label={`Benefit ${index + 1}`}
                  variant="filled"
                  fullWidth
                  margin="normal"
                  disabled={isDisabled}
                  {...register(`benefits.${index}.copy`)}
                  onBlur={handleSubmit(onFormChange)}
                  defaultValue={benefit.copy}
                />
                <Button
                  className={classes.deleteButton}
                  onClick={() => remove(index)}
                  disabled={isDisabled}
                  variant="outlined"
                  size="medium"
                >
                  <CloseIcon />
                </Button>
              </div>
            ))}
            <div>
              <Button
                onClick={() => append({ copy: '' })}
                disabled={isDisabled || benefits.length >= 8}
                variant="outlined"
                size="medium"
              >
                <AddIcon />
              </Button>
            </div>
          </div>
        </form>
      </AccordionDetails>
    </Accordion>
  );
};
