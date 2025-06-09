import { ChoiceCard, ChoiceCardsSettings, Product } from '../../../models/choiceCards';
import React from 'react';
import {
  Checkbox,
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
import { useFieldArray, Controller, UseFormReturn } from 'react-hook-form';
import FormControlLabel from '@mui/material/FormControlLabel';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { makeStyles } from '@mui/styles';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { RichTextEditorSingleLine, RteMenuConstraints } from '../richTextEditor/richTextEditor';
import { EMPTY_ERROR_HELPER_TEXT } from '../helpers/validation';

const useStyles = makeStyles(({ spacing }: Theme) => ({
  container: {
    width: '100%',
  },
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
    alignItems: 'center',
    '& > :first-child': {
      flex: 1,
    },
  },
  deleteButton: {
    margin: `${spacing(2)} 0 ${spacing(1)} ${spacing(1)}`,
  },
}));

const richTextEditorConfig: RteMenuConstraints = {
  noHtml: false,
  noBold: false,
  noItalic: false,
  noCurrencyTemplate: false,
  noCountryNameTemplate: true,
  noArticleCountTemplate: true,
  noPriceTemplates: true,
  noDateTemplate: true,
  noDayTemplate: true,
};

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
  formMethods: UseFormReturn<ChoiceCardsSettings>;
}
export const ChoiceCardEditor: React.FC<ChoiceCardEditorProps> = ({
  choiceCard,
  onChange,
  isDisabled,
  index,
  formMethods,
}) => {
  const classes = useStyles();
  const { control, getValues } = formMethods;

  const { fields: benefits, append, remove } = useFieldArray({
    control,
    name: `choiceCards.${index}.benefits`,
  });

  const handleCardChange = () => {
    const updatedState = getValues(`choiceCards.${index}`);
    onChange(updatedState);
  };

  return (
    <Accordion key={`${choiceCard.product.supportTier}-${index}`} className={classes.container}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6">
          {productDisplayName(getValues(`choiceCards.${index}.product`))}{' '}
          {getValues(`choiceCards.${index}.isDefault`) ? ' [Default]' : ''}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <div className={classes.productContainer}>
          <FormControl disabled={isDisabled} margin="normal">
            <Controller
              name={`choiceCards.${index}.product.supportTier`}
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  labelId={`supportTier-label-${index}`}
                  onChange={e => {
                    const newSupportTier = e.target.value as Product['supportTier'];

                    const buildProduct = (): Product => {
                      if (newSupportTier === 'OneOff') {
                        return { supportTier: 'OneOff' };
                      } else {
                        return {
                          supportTier: newSupportTier,
                          // keep existing ratePlan if possible
                          ratePlan: getValues(`choiceCards.${index}.product.ratePlan`) ?? 'Monthly',
                        };
                      }
                    };
                    formMethods.setValue(`choiceCards.${index}.product`, buildProduct(), {
                      shouldValidate: true,
                    });

                    handleCardChange();
                  }}
                >
                  <MenuItem value="Contribution">Recurring Contribution</MenuItem>
                  <MenuItem value="SupporterPlus">Supporter Plus</MenuItem>
                  <MenuItem value="OneOff">One-off Contribution</MenuItem>
                </Select>
              )}
            />
          </FormControl>

          {['Contribution', 'SupporterPlus'].includes(
            getValues(`choiceCards.${index}.product.supportTier`),
          ) && (
            <FormControl component="fieldset" margin="normal" disabled={isDisabled}>
              <Controller
                name={`choiceCards.${index}.product.ratePlan`}
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    row
                    {...field}
                    onChange={e => {
                      field.onChange(e.target.value);
                      handleCardChange();
                    }}
                  >
                    <FormControlLabel value="Monthly" control={<Radio />} label="Monthly" />
                    <FormControlLabel value="Annual" control={<Radio />} label="Annual" />
                  </RadioGroup>
                )}
              />
            </FormControl>
          )}
        </div>

        <FormControlLabel
          control={
            <Controller
              name={`choiceCards.${index}.isDefault`}
              control={control}
              render={({ field }) => (
                <Checkbox
                  {...field}
                  checked={field.value}
                  color="primary"
                  disabled={isDisabled}
                  onChange={e => {
                    field.onChange(e.target.checked);
                    handleCardChange();
                  }}
                />
              )}
            />
          }
          label="Is Default"
        />

        {getValues(`choiceCards.${index}.product.supportTier`) === 'OneOff' && (
          <Controller
            name={`choiceCards.${index}.label`}
            control={control}
            rules={{
              required: EMPTY_ERROR_HELPER_TEXT,
            }}
            render={({ field, fieldState }) => (
              <RichTextEditorSingleLine
                copyData={field.value}
                updateCopy={value => {
                  field.onChange(value);
                  handleCardChange();
                }}
                name={`label-${index}`}
                label="Label"
                disabled={isDisabled}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                rteMenuConstraints={richTextEditorConfig}
              />
            )}
          />
        )}

        <Controller
          name={`choiceCards.${index}.pill.copy`}
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              required={false}
              label="Pill Copy (optional)"
              variant="filled"
              fullWidth
              margin="normal"
              disabled={isDisabled}
              onChange={e => {
                field.onChange(e);
                handleCardChange();
              }}
            />
          )}
        />

        <Controller
          name={`choiceCards.${index}.benefitsLabel`}
          control={control}
          render={({ field }) => (
            <RichTextEditorSingleLine
              copyData={choiceCard.benefitsLabel || ''}
              updateCopy={value => {
                field.onChange(value);
                handleCardChange();
              }}
              name={`benefitsLabel-${index}`}
              label="Benefits Label (optional)"
              disabled={isDisabled}
              error={false}
              rteMenuConstraints={richTextEditorConfig}
            />
          )}
        />

        <div>
          <label className={classes.benefitsHeading}>Benefits</label>
          {benefits.map((benefit, benefitIndex) => (
            <div className={classes.benefitContainer} key={benefit.id}>
              <Controller
                name={`choiceCards.${index}.benefits.${benefitIndex}.copy`}
                control={control}
                render={({ field }) => (
                  <RichTextEditorSingleLine
                    copyData={benefit.copy}
                    updateCopy={value => {
                      field.onChange(value);
                      handleCardChange();
                    }}
                    name={`benefit-${benefitIndex}`}
                    label={`Benefit ${benefitIndex + 1}`}
                    disabled={isDisabled}
                    error={false}
                    rteMenuConstraints={richTextEditorConfig}
                  />
                )}
              />
              <Button
                className={classes.deleteButton}
                onClick={() => {
                  remove(benefitIndex);
                  handleCardChange();
                }}
                disabled={isDisabled}
                variant="outlined"
                size="medium"
              >
                <CloseIcon />
              </Button>
            </div>
          ))}
          <Button
            onClick={() => {
              append({ copy: '' });
              handleCardChange();
            }}
            disabled={isDisabled || benefits.length >= 8}
            variant="outlined"
            size="medium"
          >
            <AddIcon />
          </Button>
        </div>
      </AccordionDetails>
    </Accordion>
  );
};
