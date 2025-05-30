import React from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Button, Radio, RadioGroup, Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { ChoiceCard, ChoiceCardsSettings } from '../../../models/choiceCards';
import { ChoiceCardEditor } from './ChoiceCardEditor';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
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

interface EpicTestChoiceCardsEditorProps {
  showChoiceCards: boolean;
  choiceCardsSettings?: ChoiceCardsSettings;
  updateChoiceCardsSettings: (
    showChoiceCards: boolean,
    choiceCardSettings?: ChoiceCardsSettings,
  ) => void;
  isDisabled: boolean;
}

const ChoiceCardsEditor: React.FC<EpicTestChoiceCardsEditorProps> = ({
  showChoiceCards,
  choiceCardsSettings,
  updateChoiceCardsSettings,
  isDisabled,
}) => {
  const classes = useStyles();

  const choiceCardsSelection = getChoiceCardsSelection(showChoiceCards, choiceCardsSettings);

  const handleRadioGroupChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const value = event.target.value as ChoiceCardsSelection;
    if (value === 'DefaultChoiceCards') {
      updateChoiceCardsSettings(true);
    } else if (value === 'CustomChoiceCards') {
      updateChoiceCardsSettings(true, { choiceCards: [] });
    } else {
      updateChoiceCardsSettings(false);
    }
  };

  const handleChoiceCardChange = (index: number, updatedCard: ChoiceCard): void => {
    if (choiceCardsSettings) {
      const updatedCards = [...choiceCardsSettings.choiceCards];
      updatedCards[index] = updatedCard;
      updateChoiceCardsSettings(showChoiceCards, { choiceCards: updatedCards });
    }
  };

  const handleAddChoiceCard = (): void => {
    if (choiceCardsSettings) {
      const updatedCards: ChoiceCard[] = [
        ...choiceCardsSettings.choiceCards,
        {
          product: { supportTier: 'Contribution', ratePlan: 'Monthly' },
          label: '',
          benefits: [],
          isDefault: false,
        },
      ];
      updateChoiceCardsSettings(showChoiceCards, { choiceCards: updatedCards });
    }
  };

  const handleRemoveChoiceCard = (index: number): void => {
    if (choiceCardsSettings) {
      const updatedCards = choiceCardsSettings.choiceCards.filter((_, i) => i !== index);
      updateChoiceCardsSettings(showChoiceCards, { choiceCards: updatedCards });
    }
  };

  return (
    <div className={classes.container}>
      <RadioGroup value={choiceCardsSelection} onChange={handleRadioGroupChange}>
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
      {choiceCardsSelection === 'CustomChoiceCards' && choiceCardsSettings && (
        <>
          {!choiceCardsSettings.choiceCards.some(card => card.isDefault) && (
            <Alert severity="info">One card should be set as the default</Alert>
          )}
          {choiceCardsSettings.choiceCards.map((choiceCard, idx) => (
            <div className={classes.choiceCardContainer} key={idx}>
              <ChoiceCardEditor
                choiceCard={choiceCard}
                onChange={updatedCard => handleChoiceCardChange(idx, updatedCard)}
                isDisabled={isDisabled}
                index={idx}
              />
              <Button
                className={classes.deleteButton}
                onClick={() => handleRemoveChoiceCard(idx)}
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
            onClick={handleAddChoiceCard}
            disabled={isDisabled || choiceCardsSettings.choiceCards.length >= 3}
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
