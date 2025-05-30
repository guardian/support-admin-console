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
import FormControlLabel from '@mui/material/FormControlLabel';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { makeStyles } from '@mui/styles';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { ChoiceCard, Product, RatePlan } from '../../../models/choiceCards';
import { RichTextEditorSingleLine, RteMenuConstraints } from '../richTextEditor/richTextEditor';

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
}

export const ChoiceCardEditor: React.FC<ChoiceCardEditorProps> = ({
  choiceCard,
  onChange,
  isDisabled,
  index,
}) => {
  const classes = useStyles();

  const handleFieldChange = <K extends keyof ChoiceCard>(field: K, value: ChoiceCard[K]): void => {
    const updatedCard = { ...choiceCard, [field]: value };
    console.log('handleFieldChange', field, value);
    onChange(updatedCard);
  };

  const handleBenefitsChange = (index: number, value: string) => {
    const updatedBenefits = [...choiceCard.benefits];
    updatedBenefits[index] = { copy: value };
    handleFieldChange('benefits', updatedBenefits);
  };

  const addBenefit = () => {
    const updatedBenefits = [...choiceCard.benefits, { copy: '' }];
    handleFieldChange('benefits', updatedBenefits);
  };

  const removeBenefit = (index: number) => {
    const updatedBenefits = choiceCard.benefits.filter((_, i) => i !== index);
    handleFieldChange('benefits', updatedBenefits);
  };

  return (
    <Accordion key={`${choiceCard.product.supportTier}-${index}`} className={classes.container}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6">
          {productDisplayName(choiceCard.product)} {choiceCard.isDefault ? ' [Default]' : ''}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <div className={classes.productContainer}>
          <FormControl disabled={isDisabled} margin="normal">
            <InputLabel id={`supportTier-label-${index}`}>Support Tier</InputLabel>
            <Select
              value={choiceCard.product.supportTier}
              onChange={e => {
                const supportTier = e.target.value as ChoiceCard['product']['supportTier'];
                if (e.target.value === 'OneOff') {
                  handleFieldChange('product', { supportTier: 'OneOff' });
                } else {
                  const ratePlan =
                    choiceCard.product.supportTier !== 'OneOff'
                      ? choiceCard.product.ratePlan
                      : 'Monthly';
                  handleFieldChange('product', {
                    supportTier,
                    ratePlan,
                  });
                }
              }}
              labelId={`supportTier-label-${index}`}
            >
              <MenuItem value="Contribution">Recurring Contribution</MenuItem>
              <MenuItem value="SupporterPlus">Supporter Plus</MenuItem>
              <MenuItem value="OneOff">One-off Contribution</MenuItem>
            </Select>
          </FormControl>

          {choiceCard.product.supportTier !== 'OneOff' && (
            <FormControl component="fieldset" margin="normal" disabled={isDisabled}>
              <RadioGroup
                row
                value={choiceCard.product.ratePlan}
                onChange={e =>
                  handleFieldChange('product', {
                    supportTier: choiceCard.product.supportTier,
                    ratePlan: e.target.value as RatePlan,
                  })
                }
              >
                <FormControlLabel value="Monthly" control={<Radio />} label="Monthly" />
                <FormControlLabel value="Annual" control={<Radio />} label="Annual" />
              </RadioGroup>
            </FormControl>
          )}
        </div>

        <FormControlLabel
          control={
            <Checkbox
              checked={choiceCard.isDefault}
              color="primary"
              disabled={isDisabled}
              onChange={e => handleFieldChange('isDefault', e.target.checked)}
            />
          }
          label="Is default choice"
        />

        {choiceCard.product.supportTier === 'OneOff' && (
          <RichTextEditorSingleLine
            copyData={choiceCard.label}
            updateCopy={value => handleFieldChange('label', value ?? '')}
            name={`label-${index}`}
            label="Label"
            disabled={isDisabled}
            error={false}
            rteMenuConstraints={richTextEditorConfig}
          />
        )}

        <TextField
          value={choiceCard.pill?.copy || ''}
          label="Pill Copy (optional)"
          variant="filled"
          fullWidth
          margin="normal"
          disabled={isDisabled}
          onChange={e => handleFieldChange('pill', { copy: e.target.value })}
        />

        <RichTextEditorSingleLine
          copyData={choiceCard.benefitsLabel || ''}
          updateCopy={value => handleFieldChange('benefitsLabel', value ?? '')}
          name={`benefitsLabel-${index}`}
          label="Benefits Label (optional)"
          disabled={isDisabled}
          error={false}
          rteMenuConstraints={richTextEditorConfig}
        />

        <div>
          <label className={classes.benefitsHeading}>Benefits</label>
          {choiceCard.benefits.map((benefit, benefitIndex) => (
            <div className={classes.benefitContainer} key={benefitIndex}>
              <RichTextEditorSingleLine
                copyData={benefit.copy}
                updateCopy={value => handleBenefitsChange(benefitIndex, value ?? '')}
                name={`benefit-${benefitIndex}`}
                label={`Benefit ${benefitIndex + 1}`}
                disabled={isDisabled}
                error={false}
                rteMenuConstraints={richTextEditorConfig}
              />
              <Button
                className={classes.deleteButton}
                onClick={() => removeBenefit(benefitIndex)}
                disabled={isDisabled}
                variant="outlined"
                size="medium"
              >
                <CloseIcon />
              </Button>
            </div>
          ))}
          <Button
            onClick={addBenefit}
            disabled={isDisabled || choiceCard.benefits.length >= 8}
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
