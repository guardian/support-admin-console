import React from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Button, Radio, RadioGroup, Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { ChoiceCardsSettings } from '../../../models/choiceCards';
import { ChoiceCardEditor } from './ChoiceCardEditor';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import { useFieldArray, useForm } from 'react-hook-form';
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

interface ChoiceCardsEditorProps {
  showChoiceCards: boolean;
  choiceCardsSettings?: ChoiceCardsSettings;
  updateChoiceCardsSettings: (
    showChoiceCards: boolean,
    choiceCardSettings?: ChoiceCardsSettings,
  ) => void;
  isDisabled: boolean;
}

const ChoiceCardsEditor: React.FC<ChoiceCardsEditorProps> = ({
  showChoiceCards,
  choiceCardsSettings,
  updateChoiceCardsSettings,
  isDisabled,
}: ChoiceCardsEditorProps) => {
  const classes = useStyles();

  const formMethods = useForm<ChoiceCardsSettings>({
    defaultValues: {
      choiceCards: choiceCardsSettings?.choiceCards || [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: formMethods.control,
    name: 'choiceCards',
  });

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

  const choiceCardsSelection = getChoiceCardsSelection(showChoiceCards, choiceCardsSettings);

  return (
    <div className={classes.container}>
      <RadioGroup value={choiceCardsSelection} onChange={onRadioGroupChange}>
        <FormControlLabel
          value="NoChoiceCards"
          key="NoChoiceCards"
          control={<Radio />}
          label="No choice cards"
          disabled={isDisabled}
        />
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
          {!fields.some(card => card.isDefault) && (
            <Alert severity="info">One card should be set as the default</Alert>
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
