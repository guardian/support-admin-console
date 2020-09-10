import React from 'react';
import { Button } from '@material-ui/core';
import VisibilityIcon from '@material-ui/icons/Visibility';

type TestType = 'EPIC' | 'BANNER';
type Stage = 'DEV' | 'CODE' | 'PROD';

declare global {
  interface Window {
    guardian: { stage: Stage };
  }
}

const getStage = (): Stage => {
  return window.guardian.stage;
};

const PROD_BASE_ARTICLE_URL =
  'https://theguardian.com/world/2020/may/08/commemorating-ve-day-during-coronavirus-lockdown-somehow-the-quiet-made-it-louder';

const CODE_BASE_ARTICLE_URL =
  'https://m.code.dev-theguardian.com/world/2020/may/08/commemorating-ve-day-during-coronavirus-lockdown-somehow-the-quiet-made-it-louder';

const getPreviewUrl = (testName: string, variantName: string, testType: TestType): string => {
  const stage = getStage();

  const queryString = `?dcr&force-${testType.toLowerCase()}=${testName}:${variantName}`;
  if (stage === 'CODE') {
    return `${CODE_BASE_ARTICLE_URL}${queryString}`;
  } else if (stage == 'PROD') {
    return `${PROD_BASE_ARTICLE_URL}${queryString}`;
  }
  // placeholder for dev
  return '/';
};

interface TestEditorVariantSummaryPreviewButtonProps {
  name: string;
  testName: string;
  testType: TestType;
  isDisabled: boolean;
}

const TestEditorVariantSummaryPreviewButton: React.FC<TestEditorVariantSummaryPreviewButtonProps> = ({
  name,
  testName,
  testType,
  isDisabled,
}: TestEditorVariantSummaryPreviewButtonProps) => {
  return (
    <Button
      startIcon={<VisibilityIcon />}
      size="small"
      onClick={(event): void => event.stopPropagation()}
      onFocus={(event): void => event.stopPropagation()}
      href={getPreviewUrl(testName, name, testType)}
      target="_blank"
      rel="noopener noreferrer"
      disabled={isDisabled}
    >
      Preview
    </Button>
  );
};
export default TestEditorVariantSummaryPreviewButton;
