import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';
import { Inline1Variant } from '../../../models/inline1';
import { buildStorybookUrl } from '../helpers/dcrStorybook';

interface Inline1Props {
  variant: Inline1Variant;
}

type SupportMessage = Extract<Inline1Variant['message'], { type: 'Inline1SupportMessage' }>;

type SupporterRevenueProps = SupportMessage & {
  variant: Inline1Variant;
  message: SupportMessage;
};

const SUPPORTER_REVENUE_STORY = 'components-marketing-supporterrevenue--default';

const buildProps = (variant: Inline1Variant): Inline1Props | SupporterRevenueProps => {
  if (variant.message.type === 'Inline1SupportMessage') {
    return {
      variant,
    };
  }

  return { variant } satisfies Inline1Props;
};

export const buildInline1PreviewUrl = (variant: Inline1Variant): string | undefined => {
  if (variant.message.type !== 'Inline1SupportMessage') {
    return undefined;
  }

  return buildStorybookUrl(SUPPORTER_REVENUE_STORY, buildProps(variant));
};

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

  if (!storybookUrl) {
    return <Typography>Will be added soon</Typography>;
  }

  return (
    <div>
      <Iframe src={storybookUrl} title={`Inline1 ${variant.name} preview`} />
    </div>
  );
};

export default Inline1VariantPreview;
