import React from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import {Radio, RadioGroup, TextField, Theme, Typography} from '@mui/material';
import { makeStyles } from '@mui/styles';
import {ChoiceCard, ChoiceCardsSettings} from "../../../models/choiceCards";
import {DEFAULT_ARTICLES_VIEWED_SETTINGS} from "../testEditorArticleCountEditor";
import {ChoiceCardEditor} from "./ChoiceCardEditor";

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

interface EpicTestChoiceCardsEditorProps {
  // showChoiceCards?: boolean;
  // updateShowChoiceCards: (showChoiceCards?: boolean) => void;
  choiceCardsSettings: ChoiceCardsSettings;
  updateChoiceCardsSettings: (choiceCardSettings: ChoiceCardsSettings) => void;
  isDisabled: boolean;
}

const ChoiceCardsEditor: React.FC<EpicTestChoiceCardsEditorProps> = ({
  // showChoiceCards,
  // updateShowChoiceCards,
  choiceCardsSettings,
  updateChoiceCardsSettings,
  isDisabled,
}: EpicTestChoiceCardsEditorProps) => {
  const classes = useStyles();

  const onRadioGroupChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (event.target.value === 'DefaultChoiceCards') {
      updateChoiceCardsSettings({type: 'DefaultChoiceCards'});
    } else if (event.target.value === 'CustomChoiceCards') {
      updateChoiceCardsSettings({
        type: 'CustomChoiceCards',
        choiceCardsOverride: [
          {
            product: {supportTier: 'Contribution', ratePlan: 'Monthly'},
            benefits: [{copy: 'B1'}, {copy: 'B2'}],
            isDefault: false,
            benefitsLabel: 'Unlock Support benefits:',
          },
          {
            product: {supportTier: 'SupporterPlus', ratePlan: 'Monthly'},
            benefits: [{copy: 'B1'}, {copy: 'B2'}],
            isDefault: false,
            benefitsLabel: 'Unlock All-access digital benefits:',
          }
        ],
      });
    } else {
      updateChoiceCardsSettings({ type: 'NoChoiceCards' });
    }
  };

  return (
    <div className={classes.container}>
      <RadioGroup
        value={choiceCardsSettings.type}
        onChange={onRadioGroupChange}
      >
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
      { choiceCardsSettings.type === 'CustomChoiceCards' && (
        choiceCardsSettings.choiceCardsOverride.map(((choiceCard, idx) =>
          (<ChoiceCardEditor
              key={`choice-card-${idx}`}
              choiceCard={choiceCard}
              onChange={updatedCard => {
                console.log({updatedCard})
                const choiceCardsOverride =
                  [
                    ...choiceCardsSettings.choiceCardsOverride.slice(0, idx),
                    updatedCard,
                    ...choiceCardsSettings.choiceCardsOverride.slice(idx+1),
                  ]
                updateChoiceCardsSettings({
                  type: 'CustomChoiceCards',
                  choiceCardsOverride,
                })
              }}
              isDisabled={isDisabled}
            />)
        )
      ))}
    </div>
  );
};

export default ChoiceCardsEditor;
