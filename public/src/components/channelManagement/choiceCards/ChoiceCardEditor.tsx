import {ChoiceCard, Product} from '../../../models/choiceCards';
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
  AccordionDetails, Theme,
} from '@mui/material';
import { useFieldArray, useForm, Controller } from 'react-hook-form';
import FormControlLabel from '@mui/material/FormControlLabel';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {makeStyles} from "@mui/styles";

const useStyles = makeStyles(({ spacing }: Theme) => ({
  productContainer: {
    '& > * + *': {
      marginLeft: spacing(2),
    },
  },
}));

const productDisplayName = (productTier: Product['supportTier']) => {
  if (productTier === 'OneOff') {
    return 'One-off Contribution';
  } else if (productTier === 'Contribution') {
    return 'Recurring Contribution';
  } else {
    return 'Supporter Plus';
  }
}

interface ChoiceCardEditorProps {
  choiceCard: ChoiceCard;
  onChange: (choiceCard: ChoiceCard) => void;
  isDisabled: boolean;
}
export const ChoiceCardEditor: React.FC<ChoiceCardEditorProps> = ({
  choiceCard,
  onChange,
  isDisabled,
}) => {
  const classes = useStyles();

  const {
    control,
    handleSubmit,
    register,
    trigger,
    formState: { errors },
  } = useForm<ChoiceCard>({
    defaultValues: choiceCard,
    mode: 'onChange',
  });

  const { fields: benefits, append, remove } = useFieldArray({
    control,
    name: 'benefits',
  });

  const handleFormChange = (data: ChoiceCard) => {
    console.log('handleFormChange',data)
    onChange(data);
  };

  return (
    <Accordion key={choiceCard.product.supportTier}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6">{productDisplayName(choiceCard.product.supportTier)}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <form onChange={handleSubmit(handleFormChange)}>
          <div className={classes.productContainer}>
            <FormControl disabled={isDisabled} margin="normal">
              <InputLabel id="supportTier-label">Support Tier</InputLabel>
              <Controller
                name="product.supportTier"
                control={control}
                render={({field} ) => (
                  <Select
                    {...field}
                    labelId="supportTier-label"
                    value={field.value}
                    onChange={e => {
                      console.log(e)
                      field.onChange(e);
                      const newSupportTier = e.target.value as Product['supportTier'];
                      const oldSupportTier = choiceCard.product.supportTier;

                      const buildProduct = (): Product => {
                        if (newSupportTier === 'OneOff') {
                          return { supportTier: 'OneOff' };
                        } else if (oldSupportTier === 'OneOff') {
                          debugger
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
                      }
                      handleFormChange({
                        ...choiceCard,
                        product: buildProduct(),
                      });
                      // handleSubmit(handleFormChange)();
                      // trigger();
                    }}
                  >
                    <MenuItem value="Contribution">Recurring Contribution</MenuItem>
                    <MenuItem value="SupporterPlus">Supporter Plus</MenuItem>
                    <MenuItem value="OneOff">Single Contribution</MenuItem>
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
                    <RadioGroup
                      row
                      {...field}
                      onChange={(e) => field.onChange(e.target.value)}
                    >
                      <FormControlLabel
                        value="Monthly"
                        control={<Radio />}
                        label="Monthly"
                      />
                      <FormControlLabel
                        value="Annual"
                        control={<Radio />}
                        label="Annual"
                      />
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
            onBlur={handleSubmit(handleFormChange)}
          />

          <TextField
            label="Benefits Label"
            variant="filled"
            fullWidth
            margin="normal"
            disabled={isDisabled}
            error={!!errors.benefitsLabel}
            helperText={errors.benefitsLabel?.message}
            {...register('benefitsLabel')}
            onBlur={handleSubmit(handleFormChange)}
          />

          <TextField
            label="Pill Copy"
            variant="filled"
            fullWidth
            margin="normal"
            disabled={isDisabled}
            {...register('pill.copy')}
            onBlur={handleSubmit(handleFormChange)}
          />

          <FormControl margin="normal">
            <Controller
              name="isDefault"
              control={control}
              render={({field}) => (
                <Checkbox {...field} checked={field.value} color="primary" disabled={isDisabled} />
              )}
            />
            <label>Is Default</label>
          </FormControl>

          <div>
            <label>Benefits</label>
            {benefits.map((benefit, index) => (
              <div key={benefit.id}>
                <TextField
                  label={`Benefit ${index + 1}`}
                  variant="filled"
                  fullWidth
                  margin="normal"
                  disabled={isDisabled}
                  {...register(`benefits.${index}.copy`)}
                  onBlur={handleSubmit(handleFormChange)}
                  defaultValue={benefit.copy}
                />
                <Button onClick={() => remove(index)} disabled={isDisabled}>
                  Remove
                </Button>
              </div>
            ))}
            <Button onClick={() => append({ copy: '' })} disabled={isDisabled}>
              Add Benefit
            </Button>
          </div>
        </form>
      </AccordionDetails>
    </Accordion>
  );
};
