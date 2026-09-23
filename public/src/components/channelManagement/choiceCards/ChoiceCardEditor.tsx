import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Checkbox,
  FormControl,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import { styled } from '@mui/material/styles';
import React from 'react';
import { Controller, useFieldArray, UseFormReturn } from 'react-hook-form';
import { ChoiceCard, ChoiceCardsSettings, Product } from '../../../models/choiceCards';
import { EMPTY_ERROR_HELPER_TEXT } from '../helpers/validation';
import { RichTextEditorSingleLine, RteMenuConstraints } from '../richTextEditor/richTextEditor';
import { ChoiceCardDestinationFields } from './ChoiceCardDestinationFields';

const StyledAccordion = styled(Accordion)({
  width: '100%',
});

const ProductContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
}));

const SubHeading = styled(Typography)({
  fontWeight: 700,
});

const subHeadingSx = { fontWeight: 700 };

const BenefitContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  '& > :first-child': {
    flex: 1,
  },
});

const DeleteButton = styled(Button)(({ theme }) => ({
  margin: `${theme.spacing(2)} 0 ${theme.spacing(1)} ${theme.spacing(1)}`,
}));

const AddButton = styled(Button)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const richTextEditorConfig: RteMenuConstraints = {
  enableHtml: true,
  enableBold: true,
  enableItalic: true,
  enableStrikethrough: true,
  enableCopyTemplates: true,
  enableLink: true,
  enableCurrencyTemplate: true,
};

const productDisplayName = (product: Product) => {
  if (product.supportTier === 'OneOff') {
    return 'One-off Contribution';
  } else if (product.supportTier === 'Contribution') {
    return `Recurring Contribution - ${product.ratePlan}`;
  } else if (product.supportTier === 'DigitalSubscription') {
    return `Digital Subscription - ${product.ratePlan}`;
  }
  return `Supporter Plus - ${product.ratePlan}`;
};

interface ChoiceCardEditorProps {
  choiceCard: ChoiceCard;
  onChange: (choiceCard: ChoiceCard) => void;
  isDisabled: boolean;
  index: number;
  formMethods: UseFormReturn<ChoiceCardsSettings & { hasOneDefault: boolean }>;
  hideDestination?: boolean;
  idPrefix?: string;
}
export const ChoiceCardEditor: React.FC<ChoiceCardEditorProps> = ({
  choiceCard,
  onChange,
  isDisabled,
  index,
  formMethods,
  hideDestination = false,
  idPrefix = '',
}) => {
  const { control, getValues } = formMethods;

  const {
    fields: benefits,
    append,
    remove,
  } = useFieldArray({
    control,
    name: `choiceCards.${index}.benefits`,
  });

  const handleCardChange = () => {
    const updatedState = getValues(`choiceCards.${index}`);
    onChange(updatedState);
  };

  return (
    <StyledAccordion key={`${choiceCard.product.supportTier}-${index}`}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6">
          {productDisplayName(getValues(`choiceCards.${index}.product`))}{' '}
          {getValues(`choiceCards.${index}.isDefault`) ? ' [Default]' : ''}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <ProductContainer>
          <FormControl disabled={isDisabled} margin="normal">
            <Controller
              name={`choiceCards.${index}.product.supportTier`}
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  labelId={`${idPrefix}supportTier-label-${index}`}
                  inputProps={{ id: `${idPrefix}supportTier-${index}` }}
                  onChange={(e) => {
                    const newSupportTier = e.target.value as Product['supportTier'];

                    const buildProduct = (): Product => {
                      if (newSupportTier === 'OneOff') {
                        return { supportTier: 'OneOff' };
                      } else {
                        return {
                          supportTier: newSupportTier,
                          // keep existing ratePlan if possible
                          ratePlan: getValues(`choiceCards.${index}.product.ratePlan`),
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
                  <MenuItem value="DigitalSubscription">Digital Subscription</MenuItem>
                  <MenuItem value="OneOff">One-off Contribution</MenuItem>
                </Select>
              )}
            />
          </FormControl>

          {['Contribution', 'SupporterPlus', 'DigitalSubscription'].includes(
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
                    onChange={(e) => {
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
        </ProductContainer>

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
                  onChange={(e) => {
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
                updateCopy={(value) => {
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
              onChange={(e) => {
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
              copyData={choiceCard.benefitsLabel ?? ''}
              updateCopy={(value) => {
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
          <SubHeading>Benefits</SubHeading>
          {benefits.map((benefit, benefitIndex) => (
            <BenefitContainer key={benefit.id}>
              <Controller
                name={`choiceCards.${index}.benefits.${benefitIndex}.copy`}
                control={control}
                render={({ field }) => (
                  <RichTextEditorSingleLine
                    copyData={benefit.copy}
                    updateCopy={(value) => {
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
              <DeleteButton
                onClick={() => {
                  remove(benefitIndex);
                  handleCardChange();
                }}
                disabled={isDisabled}
                variant="outlined"
                size="medium"
              >
                <CloseIcon />
              </DeleteButton>
            </BenefitContainer>
          ))}
          <AddButton
            onClick={() => {
              append({ copy: '' });
              handleCardChange();
            }}
            disabled={isDisabled || benefits.length >= 8}
            variant="outlined"
            size="medium"
          >
            <AddIcon />
          </AddButton>
        </div>

        {!hideDestination && (
          <ChoiceCardDestinationFields
            index={index}
            isDisabled={isDisabled}
            subHeadingSx={subHeadingSx}
            formMethods={formMethods}
            onDestinationSectionChange={handleCardChange}
          />
        )}
      </AccordionDetails>
    </StyledAccordion>
  );
};
