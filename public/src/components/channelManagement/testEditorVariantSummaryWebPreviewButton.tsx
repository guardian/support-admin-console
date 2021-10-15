import React from 'react';
import { Button } from '@material-ui/core';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { TestPlatform, TestType } from './helpers/shared';
import { getStage } from '../../utils/stage';

const BASE_ARTICLE_URL = {
  PROD: {
    DOTCOM:
      'https://theguardian.com/world/2020/may/08/commemorating-ve-day-during-coronavirus-lockdown-somehow-the-quiet-made-it-louder',
    AMP: '',
    APPLE_NEWS: '',
  },
  CODE: {
    DOTCOM:
      'https://m.code.dev-theguardian.com/world/2020/may/08/commemorating-ve-day-during-coronavirus-lockdown-somehow-the-quiet-made-it-louder',
    AMP: '',
    APPLE_NEWS: '',
  },
  DEV: {
    DOTCOM:
      'https://m.code.dev-theguardian.com/world/2020/may/08/commemorating-ve-day-during-coronavirus-lockdown-somehow-the-quiet-made-it-louder',
    AMP: '',
    APPLE_NEWS: '',
  },
};

const getPreviewUrl = (
  testName: string,
  variantName: string,
  testType: TestType,
  platform: TestPlatform,
): string => {
  const stage = getStage();
  const queryString = `?dcr&force-${testType.toLowerCase()}=${testName}:${variantName}`;

  return stage ? `${BASE_ARTICLE_URL[stage][platform]}${queryString}` : '/';
};

interface TestEditorVariantSummaryPreviewButtonProps {
  name: string;
  testName: string;
  testType: TestType;
  platform: TestPlatform;
  isDisabled: boolean;
}

const isCompatiblePlatform = (platform: TestPlatform): boolean =>
  !['AMP', 'APPLE_NEWS'].includes(platform);

const TestEditorVariantSummaryWebPreviewButton: React.FC<TestEditorVariantSummaryPreviewButtonProps> = ({
  name,
  testName,
  testType,
  platform,
  isDisabled,
}: TestEditorVariantSummaryPreviewButtonProps) => {
  return (
    <Button
      startIcon={<VisibilityIcon />}
      size="small"
      onClick={(event): void => event.stopPropagation()}
      onFocus={(event): void => event.stopPropagation()}
      href={getPreviewUrl(testName, name, testType, platform)}
      target="_blank"
      rel="noopener noreferrer"
      disabled={isCompatiblePlatform(platform) ? isDisabled : true}
    >
      {isCompatiblePlatform
        ? 'WEB PREVIEW'
        : `WEB PREVIEW UNAVAILABLE FOR ${platform.replace('_', ' ')}`}
    </Button>
  );
};
export default TestEditorVariantSummaryWebPreviewButton;
