import { Tab, Tabs } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useState } from 'react';

const Container = styled('div')(({ theme }) => ({
  width: '100%',
  paddingLeft: theme.spacing(4),
  paddingRight: theme.spacing(4),

  '& > * + *': { marginTop: theme.spacing(2) },
}));

interface VariantEditorProps {
  variantEditor: React.ReactElement;
  variantPreview?: React.ReactElement;
}

function VariantEditorWithPreviewTab({
  variantEditor,
  variantPreview,
}: VariantEditorProps): React.ReactElement<VariantEditorProps> {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.ChangeEvent<unknown>, newValue: number): void => {
    setValue(newValue);
  };

  return (
    <Container>
      <Tabs
        value={value}
        indicatorColor="primary"
        textColor="primary"
        onChange={handleChange}
        aria-label="disabled tabs example"
      >
        <Tab label="Form" />
        {variantPreview && <Tab label="Preview" />}
      </Tabs>

      <div>
        {value === 0 && variantEditor}
        {value === 1 && variantPreview && variantPreview}
      </div>
    </Container>
  );
}

export default VariantEditorWithPreviewTab;
