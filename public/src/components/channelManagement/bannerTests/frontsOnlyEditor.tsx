import React from 'react';
import { FormControlLabel, Switch } from '@mui/material';

interface FrontsOnlyEditorProps {
  frontsOnly?: boolean;
  onFrontsOnlyChange: (frontsOnly: boolean) => void;
  isDisabled: boolean;
}

const FrontsOnlyEditor: React.FC<FrontsOnlyEditorProps> = ({
  frontsOnly,
  onFrontsOnlyChange,
  isDisabled,
}: FrontsOnlyEditorProps) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    onFrontsOnlyChange(event.target.checked);
  };

  return (
    <FormControlLabel
      control={
        <Switch checked={frontsOnly ?? false} onChange={handleChange} disabled={isDisabled} />
      }
      label="Enable targeting for fronts ONLY (where sticky ad slot does not appear)"
    />
  );
};

export { FrontsOnlyEditor };
