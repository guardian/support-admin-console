import Alert from '@mui/material/Alert';
import React from 'react';

interface VariantCopyLengthWarningProps {
  charLimit: number;
}

const VariantCopyLengthWarning: React.FC<VariantCopyLengthWarningProps> = ({
  charLimit,
}: VariantCopyLengthWarningProps) => {
  return (
    <Alert severity="warning">
      This copy is longer than the recommended <strong>{charLimit}</strong> characters. Please
      preview across breakpoints before publishing.
    </Alert>
  );
};

export default VariantCopyLengthWarning;
