import React from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Button, Radio, RadioGroup, Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { ChoiceCard, ChoiceCardsSettings } from '../../../models/choiceCards';
import { ChoiceCardEditor } from './ChoiceCardEditor';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';

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
}: EpicTestChoiceCardsEditorProps) => {
  const classes = useStyles();

  const onRadioGroupChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (event.target.value === 'DefaultChoiceCards') {
      updateChoiceCardsSettings(true);
    } else if (event.target.value === 'CustomChoiceCards') {
      updateChoiceCardsSettings(true, { choiceCards: [] });
    } else {
      updateChoiceCardsSettings(false);
    }
  };

  const handleDelete = (index: number): void => {
    if (choiceCardsSettings) {
      const updatedChoiceCards = choiceCardsSettings.choiceCards.filter((_, idx) => idx !== index);
      updateChoiceCardsSettings(true, { choiceCards: updatedChoiceCards });
    }
  };

  const handleCreate = (): void => {
    if (choiceCardsSettings) {
      const newChoiceCard: ChoiceCard = {
        product: { supportTier: 'Contribution', ratePlan: 'Monthly' },
        label: '',
        benefits: [],
        isDefault: false,
      };
      const updatedChoiceCards = [...choiceCardsSettings.choiceCards, newChoiceCard];
      updateChoiceCardsSettings(true, { choiceCards: updatedChoiceCards });
    }
  };

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
      {choiceCardsSelection === 'CustomChoiceCards' &&
        choiceCardsSettings?.choiceCards.map((choiceCard, idx) => (
          <div className={classes.choiceCardContainer} key={`choice-card-${idx}`}>
            <ChoiceCardEditor
              choiceCard={choiceCard}
              onChange={updatedCard => {
                const choiceCards = [
                  ...choiceCardsSettings.choiceCards.slice(0, idx),
                  updatedCard,
                  ...choiceCardsSettings.choiceCards.slice(idx + 1),
                ];
                updateChoiceCardsSettings(true, {
                  choiceCards,
                });
              }}
              isDisabled={isDisabled}
              index={idx}
            />
            <Button
              className={classes.deleteButton}
              onClick={() => handleDelete(idx)}
              disabled={isDisabled}
              variant="outlined"
              size="small"
              startIcon={<CloseIcon />}
            >
              Delete
            </Button>
          </div>
        ))}
      {choiceCardsSelection === 'CustomChoiceCards' && (
        <Button
          onClick={handleCreate}
          disabled={
            isDisabled ||
            (choiceCardsSettings?.choiceCards && choiceCardsSettings.choiceCards.length >= 3)
          }
          variant="contained"
          size="medium"
          startIcon={<AddIcon />}
        >
          Create new choice card
        </Button>
      )}
    </div>
  );
};

export default ChoiceCardsEditor;
