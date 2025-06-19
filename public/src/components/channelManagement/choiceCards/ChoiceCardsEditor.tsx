import React from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Button, Radio, RadioGroup, Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { ChoiceCard, ChoiceCardsSettings } from '../../../models/choiceCards';
import { ChoiceCardEditor } from './ChoiceCardEditor';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import Alert from '@mui/lab/Alert';

const useStyles = makeStyles(({ spacing }: Theme) => ({
  container: {
    '& > * + *': {
      marginTop: spacing(1),
    },
  },
  fieldsContainer: {
    '& > * + *': {
      marginTop: spacing(3),
    },
  },
  choiceCardContainer: {
    display: 'flex',
  },
  deleteButton: {
    height: '100%',
    padding: `${spacing(2)} ${spacing(1)}`,
    marginLeft: spacing(1),
  },
}));

type ChoiceCardsSelection = 'NoChoiceCards' | 'DefaultChoiceCards' | 'CustomChoiceCards';
const getChoiceCardsSelection = (
  showChoiceCards: boolean,
  choiceCardsSettings?: ChoiceCardsSettings,
): ChoiceCardsSelection => {
  if (showChoiceCards) {
    if (choiceCardsSettings) {
      return 'CustomChoiceCards';
    } else {
      return 'DefaultChoiceCards';
    }
  } else {
    return 'NoChoiceCards';
  }
};

const countDefaultCards = (choiceCards: ChoiceCard[]): number =>
  choiceCards.filter(card => card.isDefault).length;

interface ChoiceCardsEditorProps {
  showChoiceCards: boolean;
  allowNoChoiceCards: boolean;
  choiceCardsSettings?: ChoiceCardsSettings;
  updateChoiceCardsSettings: (
    showChoiceCards: boolean,
    choiceCardSettings?: ChoiceCardsSettings,
  ) => void;
  isDisabled: boolean;
  onValidationChange: (isValid: boolean) => void;
}

const ChoiceCardsEditor: React.FC<ChoiceCardsEditorProps> = ({
  showChoiceCards,
  choiceCardsSettings,
  updateChoiceCardsSettings,
  allowNoChoiceCards,
  isDisabled,
  onValidationChange,
}: ChoiceCardsEditorProps) => {
  const classes = useStyles();

  const formMethods = useForm<ChoiceCardsSettings & { hasOneDefault: boolean }>({
    defaultValues: {
      choiceCards: choiceCardsSettings?.choiceCards || [],
      hasOneDefault: countDefaultCards(choiceCardsSettings?.choiceCards || []) === 1,
    },
    mode: 'onChange',
  });

  const { fields, append, remove } = useFieldArray({
    control: formMethods.control,
    name: 'choiceCards',
  });

  // Watch the choiceCards array for updates in order to update the hasOneDefault field
  const choiceCards = useWatch({
    control: formMethods.control,
    name: 'choiceCards',
  });

  const choiceCardsSelection = getChoiceCardsSelection(showChoiceCards, choiceCardsSettings);
  const defaultCardCount = countDefaultCards(choiceCards || []);

  React.useEffect(() => {
    if (choiceCardsSelection === 'CustomChoiceCards') {
      if (defaultCardCount !== 1) {
        formMethods.setError('hasOneDefault', {
          type: 'custom',
          message:
            defaultCardCount === 0
              ? 'One card must be set as the default'
              : 'Only one card can be set as the default',
        });
        onValidationChange(false);
      } else {
        formMethods.clearErrors('hasOneDefault');
        onValidationChange(true);
      }
    } else {
      onValidationChange(true);
    }
  }, [fields, choiceCardsSelection, formMethods, defaultCardCount]);

  const onRadioGroupChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (event.target.value === 'DefaultChoiceCards') {
      updateChoiceCardsSettings(true);
    } else if (event.target.value === 'CustomChoiceCards') {
      updateChoiceCardsSettings(true, { choiceCards: [] });
    } else {
      updateChoiceCardsSettings(false);
      formMethods.setValue('choiceCards', []);
    }
  };

  const handleFieldChange = formMethods.handleSubmit(updatedSettings => {
    // special handling of pill field, because react-hook-form may give us an undefined nested copy field - `pill: { copy: undefined }`
    const choiceCards = updatedSettings.choiceCards.map(card => ({
      ...card,
      pill: card.pill?.copy ? card.pill : undefined,
    }));

    updateChoiceCardsSettings(showChoiceCards, { choiceCards });
  });

  return (
    <div className={classes.container}>
      <RadioGroup value={choiceCardsSelection} onChange={onRadioGroupChange}>
        {allowNoChoiceCards && (
          <FormControlLabel
            value="NoChoiceCards"
            key="NoChoiceCards"
            control={<Radio />}
            label="No choice cards"
            disabled={isDisabled}
          />
        )}
        <FormControlLabel
          value="DefaultChoiceCards"
          key="DefaultChoiceCards"
          control={<Radio />}
          label="Choice cards with default settings"
          disabled={isDisabled}
        />
        <FormControlLabel
          value="CustomChoiceCards"
          key="CustomChoiceCards"
          control={<Radio />}
          label="Choice cards with custom settings"
          disabled={isDisabled}
        />
      </RadioGroup>
      {choiceCardsSelection === 'CustomChoiceCards' && (
        <>
          {formMethods.formState.errors?.hasOneDefault && (
            <Alert severity="error">{formMethods.formState.errors.hasOneDefault.message}</Alert>
          )}
          {fields.map((choiceCard, idx) => (
            <div className={classes.choiceCardContainer} key={choiceCard.id}>
              <ChoiceCardEditor
                choiceCard={choiceCard}
                onChange={updatedCard => {
                  formMethods.setValue(`choiceCards.${idx}`, updatedCard);
                  handleFieldChange();
                }}
                isDisabled={isDisabled}
                index={idx}
                formMethods={formMethods}
              />
              <Button
                className={classes.deleteButton}
                onClick={() => remove(idx)}
                disabled={isDisabled}
                variant="outlined"
                size="small"
                startIcon={<CloseIcon />}
              >
                Delete
              </Button>
            </div>
          ))}
          <Button
            onClick={() => {
              append({
                product: { supportTier: 'Contribution', ratePlan: 'Monthly' },
                label: '',
                benefits: [],
                isDefault: false,
              });
              handleFieldChange();
            }}
            disabled={isDisabled || fields.length >= 3}
            variant="contained"
            size="medium"
            startIcon={<AddIcon />}
          >
            Create new choice card
          </Button>
        </>
      )}
    </div>
  );
};

export default ChoiceCardsEditor;
