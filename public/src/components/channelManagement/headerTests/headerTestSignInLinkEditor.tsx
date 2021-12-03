import React from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

interface HeaderTestSignInLinkEditorProps {
  showSignInLink?: boolean;
  updateShowSignInLink: (showChoiceCards?: boolean) => void;
  isDisabled: boolean;
}

const HeaderTestSignInLinkEditor: React.FC<HeaderTestSignInLinkEditorProps> = ({
  showSignInLink,
  updateShowSignInLink,
  isDisabled,
}: HeaderTestSignInLinkEditorProps) => {
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

export default HeaderTestSignInLinkEditor;
