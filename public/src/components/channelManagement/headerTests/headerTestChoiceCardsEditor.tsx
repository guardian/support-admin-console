import React from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

interface HeaderTestChoiceCardsEditorProps {
  showChoiceCards?: boolean;
  updateShowChoiceCards: (showChoiceCards?: boolean) => void;
  isDisabled: boolean;
}

const HeaderTestChoiceCardsEditor: React.FC<HeaderTestChoiceCardsEditorProps> = ({
  showChoiceCards,
  updateShowChoiceCards,
  isDisabled,
}: HeaderTestChoiceCardsEditorProps) => {
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

export default HeaderTestChoiceCardsEditor;
