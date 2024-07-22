import React from 'react';
import Alert from '@mui/lab/Alert';

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
