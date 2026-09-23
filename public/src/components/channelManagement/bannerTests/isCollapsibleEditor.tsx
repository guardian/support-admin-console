import { Box, Checkbox } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import { styled } from '@mui/material/styles';
import React from 'react';

const Container = styled(Box)(({ theme }) => ({
  '& > * + *': {
    marginTop: theme.spacing(1),
  },
}));

interface IsCollapsibleEditorProps {
  isCollapsible?: boolean;
  isDisabled: boolean;
  updateIsCollapsibleSettings: (isCollapsible: boolean) => void;
}

const IsCollapsibleEditor: React.FC<IsCollapsibleEditorProps> = ({
  isCollapsible,
  isDisabled,
  updateIsCollapsibleSettings,
}: IsCollapsibleEditorProps) => {
  const onChange = (): void => {
    updateIsCollapsibleSettings(!isCollapsible);
  };

  return (
    <Container>
      <FormControlLabel
        control={
          <Checkbox
            checked={Boolean(isCollapsible)}
            onChange={onChange}
            color="primary"
            disabled={isDisabled}
          />
        }
        label="Two Step Banner"
      />
    </Container>
  );
};

export default IsCollapsibleEditor;
