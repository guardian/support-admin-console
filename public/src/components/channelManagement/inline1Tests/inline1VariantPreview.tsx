import { styled } from '@mui/material/styles';
import React from 'react';
import { Inline1Variant } from '../../../models/inline1';
import { buildStorybookUrl } from '../helpers/dcrStorybook';

interface Inline1Props {
  variant: Inline1Variant;
}

const STORY_NAME = 'components-marketing-supporterrevenue--default';

export const buildInline1PreviewUrl = (variant: Inline1Variant): string =>
  buildStorybookUrl(STORY_NAME, { variant } satisfies Inline1Props);

const Iframe = styled('iframe')({
  width: '620px',
  height: '800px',
});

interface Inline1VariantPreviewProps {
  variant: Inline1Variant;
}

/**
 * Uses the DCR storybook to render the component, iframed.
 * Props are passed in the args parameter in the url.
 */
const Inline1VariantPreview: React.FC<Inline1VariantPreviewProps> = ({
  variant,
}: Inline1VariantPreviewProps) => {
  const storybookUrl = buildInline1PreviewUrl(variant);

  return (
    <div>
      <Iframe src={storybookUrl} title={`Inline1 ${variant.name} preview`} />
    </div>
  );
};

export default Inline1VariantPreview;
