import React from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Radio, RadioGroup, Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { ChoiceCardsSettings } from '../../../models/choiceCards';
import { ChoiceCardEditor } from './ChoiceCardEditor';

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

const defaultChoiceCardsSettings: ChoiceCardsSettings = {
  choiceCards: [
    {
      product: { supportTier: 'Contribution', ratePlan: 'Monthly' },
      label: '',
      benefits: [{ copy: 'Give to the Guardian every month with Support' }],
      isDefault: false,
    },
    {
      product: { supportTier: 'SupporterPlus', ratePlan: 'Monthly' },
      label: '',
      benefitsLabel: 'Unlock <strong>All-access digital</strong> benefits:',
      benefits: [
        { copy: 'Unlimited access to the Guardian app' },
        { copy: 'Unlimited access to our new Feast App' },
        { copy: 'Ad-free reading on all your devices' },
        {
          copy: 'Exclusive newsletter for supporters, sent every week from the Guardian newsroom',
        },
        { copy: 'Far fewer asks for support' },
      ],
      isDefault: true,
    },
    {
      product: {
        supportTier: 'OneOff',
      },
      label: `Support with another amount`,
      isDefault: false,
      benefits: [
        {
          copy: 'We welcome support of any size, any time',
        },
      ],
    },
  ],
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
      updateChoiceCardsSettings(true, defaultChoiceCardsSettings);
    } else {
      updateChoiceCardsSettings(false);
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
          <ChoiceCardEditor
            key={`choice-card-${idx}`}
            choiceCard={choiceCard}
            onChange={updatedCard => {
              console.log({ updatedCard });
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
          />
        ))}
    </div>
  );
};

export default ChoiceCardsEditor;
