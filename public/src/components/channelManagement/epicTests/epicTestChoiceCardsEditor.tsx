import React from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

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
  const onChange = (): void => {
    updateShowChoiceCards(!Boolean(showChoiceCards));
  };

  return (
    <div>
      <FormControlLabel
        control={
          <Checkbox
            checked={Boolean(showChoiceCards)}
            onChange={onChange}
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
