import React from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { makeStyles, Theme } from '@material-ui/core';

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
  updateShowChoiceCards: (showChoiceCards?: boolean) => void;
  isDisabled: boolean;
}

const EpicTestChoiceCardsEditor: React.FC<EpicTestChoiceCardsEditorProps> = ({
  showChoiceCards,
  updateShowChoiceCards,
  isDisabled,
}: EpicTestChoiceCardsEditorProps) => {
  const classes = useStyles();

  const onToggleShowChoiceCards = (): void => {
    updateShowChoiceCards(!Boolean(showChoiceCards));
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
    </div>
  );
};

export default EpicTestChoiceCardsEditor;
