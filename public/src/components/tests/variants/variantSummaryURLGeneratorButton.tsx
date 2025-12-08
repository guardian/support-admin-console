import React from 'react';
import { Button } from '@mui/material';
import CopyIcon from '@mui/icons-material/CopyAll';
import { TestPlatform, TestType } from '../../channelManagement/helpers/shared';
import { getStage } from '../../../utils/stage';

export type ArticleType = 'Standard' | 'Liveblog';

const getChannelName = (testType: TestType, articleType: ArticleType): string => {
  if (testType === 'EPIC' && articleType === 'Liveblog') {
    return 'liveblog-epic';
  } else if (testType === 'GUTTER' && articleType === 'Liveblog') {
    return 'gutter-liveblog';
  } else {
    return testType.toLowerCase().replace('_', '-');
  }
};

const getPreviewUrl = (
  testName: string,
  variantName: string,
  testType: TestType,
  articleType: ArticleType,
): string => {
  const stage = getStage();
  const channelName = getChannelName(testType, articleType);
  const queryString = `?force-${channelName}=${testName}:${variantName}`;
  return `https://support.${
    stage !== 'PROD' ? 'code.dev-' : ''
  }theguardian.com/contribute${queryString}`;
};

interface VariantSummaryURLGeneratorButtonProps {
  name: string;
  testName: string;
  testType: TestType;
  platform: TestPlatform;
  isDisabled: boolean;
  articleType: ArticleType;
}

const VariantSummaryURLGeneratorButton: React.FC<VariantSummaryURLGeneratorButtonProps> = ({
  name,
  testName,
  testType,
  platform,
  isDisabled,
  articleType,
}: VariantSummaryURLGeneratorButtonProps) => {
  const [copied, setCopied] = React.useState(false);
  const isIncompatiblePlatform = ['APPLE_NEWS'].includes(platform);

  const checkForDisabledButton = (): boolean => {
    if (isIncompatiblePlatform) {
      return true;
    }
    return isDisabled;
  };

  const getButtonCopy = (): string => {
    if (isIncompatiblePlatform) {
      return `URL IS UNAVAILABLE FOR ${platform.replace('_', ' ')}`;
    }
    return copied ? 'COPIED!' : 'COPY VARIANT URL';
  };

  if (isIncompatiblePlatform) {
    return null;
  }

  const handleCopy = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const url = getPreviewUrl(testName, name, testType, articleType);
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
