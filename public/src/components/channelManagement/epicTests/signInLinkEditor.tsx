import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import React from 'react';

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
    updateShowSignInLink(!showSignInLink);
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
