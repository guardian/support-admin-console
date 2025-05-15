import { ChoiceCard } from '../../../models/choiceCards';
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
        <Typography variant="h6">{choiceCard.product.supportTier}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <form onChange={handleSubmit(handleFormChange)}>
          <div className={classes.productContainer}>
            <FormControl disabled={isDisabled} margin="normal">
              <InputLabel id="supportTier-label">Support Tier</InputLabel>
              <Controller
                name="product.supportTier"
                control={control}
                render={(field ) => (
                  <Select
                    {...field}
                    labelId="supportTier-label"
                    value={field.value}
                    onChange={e => {
                      console.log(e)
                      field.onChange(e);
                      handleFormChange({ ...choiceCard, product: { ...choiceCard.product, supportTier: e.target.value } });
                      // handleSubmit(handleFormChange);
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
                <RadioGroup row>
                  <Controller
                    name="product.ratePlan"
                    control={control}
                    render={field => (
                      <>
                        <FormControlLabel
                          value="Monthly"
                          control={<Radio {...field} checked={field.value === 'Monthly'} />}
                          label="Monthly"
                        />
                        <FormControlLabel
                          value="Annual"
                          control={<Radio {...field} checked={field.value === 'Annual'} />}
                          label="Annual"
                        />
                      </>
                    )}
                  />
                </RadioGroup>
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
            name="label"
            inputRef={register()}
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
            name="benefitsLabel"
            inputRef={register()}
            onBlur={handleSubmit(handleFormChange)}
          />

          <TextField
            label="Pill Copy"
            variant="filled"
            fullWidth
            margin="normal"
            disabled={isDisabled}
            name="pill.copy"
            inputRef={register()}
            onBlur={handleSubmit(handleFormChange)}
          />

          <FormControl margin="normal">
            <Controller
              name="isDefault"
              control={control}
              render={field => (
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
                  name={`benefits[${index}].copy`}
                  inputRef={register()}
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
