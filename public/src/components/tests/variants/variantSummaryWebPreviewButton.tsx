import React from 'react';
import { Button } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
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

interface VariantSummaryPreviewButtonProps {
  name: string;
  testName: string;
  testType: TestType;
  platform: TestPlatform;
  isDisabled: boolean;
  articleType: ArticleType;
}

const VariantSummaryWebPreviewButton: React.FC<VariantSummaryPreviewButtonProps> = ({
  name,
  testName,
  testType,
  platform,
  isDisabled,
  articleType,
}: VariantSummaryPreviewButtonProps) => {
  const isIncompatiblePlatform = ['APPLE_NEWS'].includes(platform);

  const checkForDisabledButton = (): boolean => {
    if (isIncompatiblePlatform) {
      return true;
    }
    return isDisabled;
  };

  const getButtonCopy = (): string => {
    if (isIncompatiblePlatform) {
      return `WEB PREVIEW UNAVAILABLE FOR ${platform.replace('_', ' ')}`;
    }
    return 'WEB PREVIEW';
  };

  return (
    <Button
      startIcon={<VisibilityIcon />}
      size="small"
      onClick={(event): void => event.stopPropagation()}
      onFocus={(event): void => event.stopPropagation()}
      href={getPreviewUrl(testName, name, testType, articleType)}
      target="_blank"
      rel="noopener noreferrer"
      disabled={checkForDisabledButton()}
    >
      {getButtonCopy()}
    </Button>
  );
};
export default VariantSummaryWebPreviewButton;
