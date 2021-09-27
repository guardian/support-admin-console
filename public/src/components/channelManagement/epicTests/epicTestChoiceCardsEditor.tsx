import React from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

interface EpicTestChoiceCardsEditorProps {
  useChoiceCards?: boolean;
  updateUseChoiceCards: (useChoiceCards?: boolean) => void;
  isDisabled: boolean;
}

const EpicTestChoiceCardsEditor: React.FC<EpicTestChoiceCardsEditorProps> = ({
  useChoiceCards,
  updateUseChoiceCards,
  isDisabled,
}: EpicTestChoiceCardsEditorProps) => {
  const onChange = (): void => {
    updateUseChoiceCards(!Boolean(useChoiceCards));
  };

  return (
    <div>
      <FormControlLabel
        control={
          <Checkbox
            checked={Boolean(useChoiceCards)}
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
