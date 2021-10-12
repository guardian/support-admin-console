import React from 'react';
import { Button } from '@material-ui/core';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { TestPlatform, TestType } from './helpers/shared';
import { getStage } from '../../utils/stage';

const BASE_ARTICLE_URL = {
  PROD: {
    AMP:
      'https://amp.theguardian.com/world/2020/may/08/commemorating-ve-day-during-coronavirus-lockdown-somehow-the-quiet-made-it-louder',
    DOTCOM:
      'https://theguardian.com/world/2020/may/08/commemorating-ve-day-during-coronavirus-lockdown-somehow-the-quiet-made-it-louder',
  },
  CODE: {
    AMP:
      'https://amp.code.dev-theguardian.com/world/2020/may/08/commemorating-ve-day-during-coronavirus-lockdown-somehow-the-quiet-made-it-louder',
    DOTCOM:
      'https://m.code.dev-theguardian.com/world/2020/may/08/commemorating-ve-day-during-coronavirus-lockdown-somehow-the-quiet-made-it-louder',
  },
  DEV: {
    AMP:
      'https://amp.code.dev-theguardian.com/world/2020/may/08/commemorating-ve-day-during-coronavirus-lockdown-somehow-the-quiet-made-it-louder',
    DOTCOM:
      'https://m.code.dev-theguardian.com/world/2020/may/08/commemorating-ve-day-during-coronavirus-lockdown-somehow-the-quiet-made-it-louder',
  },
};

const getPreviewUrl = (
  testName: string,
  variantName: string,
  testType: TestType,
  platform?: TestPlatform,
): string => {
  const stage = getStage();
  const queryString = `?dcr&force-${testType.toLowerCase()}=${testName}:${variantName}`;

  return stage ? `${BASE_ARTICLE_URL[stage][platform || 'DOTCOM']}${queryString}` : '/';
};

interface TestEditorVariantSummaryPreviewButtonProps {
  name: string;
  testName: string;
  testType: TestType;
  platform?: TestPlatform;
  isDisabled: boolean;
}

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
      disabled={isDisabled}
    >
      Web preview
    </Button>
  );
};
export default TestEditorVariantSummaryWebPreviewButton;
