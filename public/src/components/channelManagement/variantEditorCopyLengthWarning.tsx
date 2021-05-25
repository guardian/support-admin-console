import React from 'react';
import Alert from '@material-ui/lab/Alert';

interface VariantEditorCopyLengthWarningProps {
  charLimit: number;
}

const VariantEditorCopyLengthWarning: React.FC<VariantEditorCopyLengthWarningProps> = ({
  charLimit,
}: VariantEditorCopyLengthWarningProps) => {
  return (
    <Alert severity="warning">
      This copy is longer than the recommended <strong>{charLimit}</strong> characters. Please
      preview across breakpoints before publishing.
    </Alert>
  );
};

export default VariantEditorCopyLengthWarning;
