import React from 'react';
import { Button } from '@mui/material';
import CopyIcon from '@mui/icons-material/CopyAll';
import { getStage } from '../../../utils/stage';

const getPreviewUrl = (testName: string, variantName: string): string => {
  const stage = getStage();
  const channelName = 'landing-page';
  const queryString = `?force-${channelName}=${testName}:${variantName}`;
  return `https://support.${
    stage !== 'PROD' ? 'code.dev-' : ''
  }theguardian.com/contribute${queryString}`;
};

interface VariantSummaryURLGeneratorButtonProps {
  name: string;
  testName: string;
  isDisabled: boolean;
}

const VariantSummaryURLGeneratorButton: React.FC<VariantSummaryURLGeneratorButtonProps> = ({
  name,
  testName,
  isDisabled,
}: VariantSummaryURLGeneratorButtonProps) => {
  const [copied, setCopied] = React.useState(false);

  const checkForDisabledButton = (): boolean => {
    return isDisabled;
  };

  const getButtonCopy = (): string => {
    return copied ? 'COPIED!' : 'COPY VARIANT URL';
  };

  const handleCopy = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const url = getPreviewUrl(testName, name);
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <Button
      startIcon={<CopyIcon />}
      size="small"
      onClick={(e: React.MouseEvent<HTMLButtonElement>) => handleCopy(e)}
      disabled={checkForDisabledButton()}
    >
      {getButtonCopy()}
    </Button>
  );
};
export default VariantSummaryURLGeneratorButton;
