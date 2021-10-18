import React from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

interface EpicTestSignInLinkEditorProps {
  showSignInLink?: boolean;
  updateShowSignInLink: (showChoiceCards?: boolean) => void;
  isDisabled: boolean;
}

const EpicTestSignInLinkEditor: React.FC<EpicTestSignInLinkEditorProps> = ({
  showSignInLink,
  updateShowSignInLink,
  isDisabled,
}: EpicTestSignInLinkEditorProps) => {
  const onChange = (): void => {
    updateShowSignInLink(!Boolean(showSignInLink));
  };

  return (
    <div>
      <FormControlLabel
        control={
          <Checkbox
            checked={Boolean(showSignInLink)}
            onChange={onChange}
            color="primary"
            disabled={isDisabled}
          />
        }
        label="Enable sign in link"
      />
    </div>
  );
};

export default EpicTestSignInLinkEditor;
