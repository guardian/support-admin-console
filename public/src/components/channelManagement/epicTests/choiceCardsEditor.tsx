import React from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';

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

const ChoiceCardsEditor: React.FC<EpicTestChoiceCardsEditorProps> = ({
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

export default ChoiceCardsEditor;
