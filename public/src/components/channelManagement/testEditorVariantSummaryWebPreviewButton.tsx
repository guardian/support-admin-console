import React from 'react';
import { Button } from '@material-ui/core';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { TestPlatform, TestType } from './helpers/shared';
import { getStage, Stage } from '../../utils/stage';

export type ArticleType = 'Standard' | 'Liveblog';

const ArticlePaths: Record<ArticleType, string> = {
  Standard:
    'world/2020/may/08/commemorating-ve-day-during-coronavirus-lockdown-somehow-the-quiet-made-it-louder',
  Liveblog: 'uk-news/live/2022/sep/19/queen-elizabeth-ii-state-funeral-westminster-abbey-updates',
};

const getHostName = (stage: Stage, platform: TestPlatform): string => {
  if (stage === 'PROD') {
    return platform === 'AMP' ? 'amp.theguardian.com' : 'theguardian.com';
  } else {
    return platform === 'AMP' ? 'amp.code.dev-theguardian.com' : 'm.code.dev-theguardian.com';
  }
};

const getPreviewUrl = (
  testName: string,
  variantName: string,
  testType: TestType,
  platform: TestPlatform,
  articleType: ArticleType,
): string => {
  const stage = getStage();
  const queryString = `?dcr&force-${testType.toLowerCase()}=${testName}:${variantName}`;

  return `https://${getHostName(stage, platform)}/${ArticlePaths[articleType]}${queryString}`;
};

interface TestEditorVariantSummaryPreviewButtonProps {
  name: string;
  testName: string;
  testType: TestType;
  platform: TestPlatform;
  isDisabled: boolean;
  articleType: ArticleType;
}

const TestEditorVariantSummaryWebPreviewButton: React.FC<TestEditorVariantSummaryPreviewButtonProps> = ({
  name,
  testName,
  testType,
  platform,
  isDisabled,
  articleType,
}: TestEditorVariantSummaryPreviewButtonProps) => {
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
      href={getPreviewUrl(testName, name, testType, platform, articleType)}
      target="_blank"
      rel="noopener noreferrer"
      disabled={checkForDisabledButton()}
    >
      {getButtonCopy()}
    </Button>
  );
};
export default TestEditorVariantSummaryWebPreviewButton;
