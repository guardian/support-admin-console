import React from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

interface EpicTestSignInLinkEditorProps {
  showSignInLink?: boolean;
  updateShowSignInLink: (showChoiceCards?: boolean) => void;
  isDisabled: boolean;
}

const SignInLinkEditor: React.FC<EpicTestSignInLinkEditorProps> = ({
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

export default SignInLinkEditor;
