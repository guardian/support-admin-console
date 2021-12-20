import React from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { FormControl, FormLabel, makeStyles, Radio, RadioGroup, Theme } from '@material-ui/core';
import { ContributionFrequency } from '../helpers/shared';

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
  showChoiceCards?: boolean;
  defaultFrequency?: ContributionFrequency;
  updateShowChoiceCards: (showChoiceCards?: boolean) => void;
  updateDefaultFrequency: (defaultFrequency: ContributionFrequency) => void;
  isDisabled: boolean;
}

const EpicTestChoiceCardsEditor: React.FC<EpicTestChoiceCardsEditorProps> = ({
  showChoiceCards,
  defaultFrequency,
  updateShowChoiceCards,
  updateDefaultFrequency,
  isDisabled,
}: EpicTestChoiceCardsEditorProps) => {
  const classes = useStyles();

  const onToggleShowChoiceCards = (): void => {
    updateShowChoiceCards(!Boolean(showChoiceCards));
  };

  const onChangeDefaultFrequency = (event: React.ChangeEvent<HTMLInputElement>): void => {
    updateDefaultFrequency(event.target.value as ContributionFrequency);
  };

  return (
    <div className={classes.container}>
      <FormControlLabel
        control={
          <Checkbox
            checked={Boolean(showChoiceCards)}
            onChange={onToggleShowChoiceCards}
            color="primary"
            disabled={isDisabled}
          />
        }
        label="Enable choice cards"
      />

      {!!showChoiceCards && (
        <div className={classes.fieldsContainer}>
          <FormControl component="fieldset">
            <FormLabel component="legend">Default contribution frequency</FormLabel>
            <RadioGroup
              value={defaultFrequency || 'MONTHLY'}
              onChange={onChangeDefaultFrequency}
              aria-label="default-choice-card-frequency"
              name="default-choice-card-frequency"
            >
              <FormControlLabel
                value={'ONE_OFF'}
                control={<Radio />}
                label="Single"
                disabled={isDisabled}
              />
              <FormControlLabel
                value={'MONTHLY'}
                control={<Radio />}
                label="Monthly"
                disabled={isDisabled}
              />
              <FormControlLabel
                value={'ANNUAL'}
                control={<Radio />}
                label="Annual"
                disabled={isDisabled}
              />
            </RadioGroup>
          </FormControl>
        </div>
      )}
    </div>
  );
};

export default EpicTestChoiceCardsEditor;
