import React from 'react';
import { Button } from '@material-ui/core';
import VisibilityIcon from '@material-ui/icons/Visibility';

// TODO: Do this properly at some point!
type Stage = 'DEV' | 'CODE' | 'PROD';

const CODE_URL_REGEX = /support.code.dev-gutools/;
const PROD_URL_REGEX = /support.gutools/;

const getStage = (): Stage => {
  const url = window.location.href;
  if (url.match(CODE_URL_REGEX)) {
    return 'CODE';
  } else if (url.match(PROD_URL_REGEX)) {
    return 'PROD';
  }
  return 'DEV';
};

const PROD_BASE_ARTICLE_URL =
  'https://theguardian.com/world/2020/may/08/commemorating-ve-day-during-coronavirus-lockdown-somehow-the-quiet-made-it-louder';

const CODE_BASE_ARTICLE_URL =
  'https://m.code.dev-theguardian.com/world/2020/may/08/commemorating-ve-day-during-coronavirus-lockdown-somehow-the-quiet-made-it-louder';

const getPreviewUrlForStage = (stage: Stage, testName: string, variantName: string): string => {
  if (stage === 'CODE') {
    return `${CODE_BASE_ARTICLE_URL}?dcr&force-banner=${testName}:${variantName}`;
  } else if (stage == 'PROD') {
    return `${PROD_BASE_ARTICLE_URL}?dcr&force-banner=${testName}:${variantName}`;
  }
  // placeholder for dev
  return '/';
};

const getPreviewUrl = (testName: string, variantName: string): string => {
  return getPreviewUrlForStage(getStage(), testName, variantName);
};

interface TestEditorVariantSummaryPreviewButtonProps {
  name: string;
  testName: string;
  isDisabled: boolean;
}

const TestEditorVariantSummaryPreviewButton: React.FC<TestEditorVariantSummaryPreviewButtonProps> = ({
  name,
  testName,
  isDisabled,
}: TestEditorVariantSummaryPreviewButtonProps) => {
  console.log(getStage());
  return (
    <Button
      startIcon={<VisibilityIcon />}
      size="small"
      onClick={(event): void => event.stopPropagation()}
      onFocus={(event): void => event.stopPropagation()}
      href={getPreviewUrl(testName, name)}
      target="_blank"
      rel="noopener noreferrer"
      disabled={isDisabled}
    >
      Preview
    </Button>
  );
};
export default TestEditorVariantSummaryPreviewButton;
