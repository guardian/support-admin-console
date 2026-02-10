import React from 'react';
import { Button } from '@mui/material';
import CopyIcon from '@mui/icons-material/CopyAll';

interface URLGeneratorCopyButtonProps {
  url: string;
}

const URLGeneratorCopyButton: React.FC<URLGeneratorCopyButtonProps> = ({
  url,
}: URLGeneratorCopyButtonProps) => {
  const [copied, setCopied] = React.useState(false);

  const getButtonCopy = (): string => {
    return copied ? 'COPIED!' : 'COPY URL';
  };

  const handleCopy = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <Button
      startIcon={<CopyIcon />}
      size="medium"
      onClick={(e: React.MouseEvent<HTMLButtonElement>) => handleCopy(e)}
    >
      {getButtonCopy()}
    </Button>
  );
};
export default URLGeneratorCopyButton;
