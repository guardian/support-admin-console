import React from 'react';
import { Button } from '@mui/material';
import CopyIcon from '@mui/icons-material/CopyAll';
import { TestPlatform, TestType } from '../../channelManagement/helpers/shared';
import { getStage, Stage } from '../../../utils/stage';

export type ArticleType = 'Standard' | 'Liveblog';

const ArticlePaths: Record<ArticleType, string> = {
  Standard:
    'world/2020/may/08/commemorating-ve-day-during-coronavirus-lockdown-somehow-the-quiet-made-it-louder',
  Liveblog: 'world/live/2022/oct/07/nobel-peace-prize-2022-live-winners',
};

const getHostName = (stage: Stage): string => {
  if (stage === 'PROD') {
    return 'theguardian.com';
  } else {
    return 'm.code.dev-theguardian.com';
  }
};

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

  if (testType === 'LANDING_PAGE') {
    // link to the support site landing page
    return `https://support.${
      stage !== 'PROD' ? 'code.dev-' : ''
    }theguardian.com/contribute${queryString}`;
  } else {
    return `https://${getHostName(stage)}/${ArticlePaths[articleType]}${queryString}`;
  }
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
