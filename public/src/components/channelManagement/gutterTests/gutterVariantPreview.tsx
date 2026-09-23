import { styled } from '@mui/material/styles';
import React from 'react';
import { GutterContent, GutterVariant } from '../../../models/gutter';
import { buildStorybookUrl } from '../helpers/dcrStorybook';

interface GutterProps {
  variant: GutterContent;
  enrichedUrl: string;
  onCtaClick: () => void;
}

const buildProps = (variant: GutterVariant): GutterProps => ({
  variant: {
    image: {
      mainUrl: variant.content.image.mainUrl,
      altText: variant.content.image.altText,
    },
    bodyCopy: variant.content.bodyCopy,
    cta: {
      baseUrl: variant.content.cta!.baseUrl,
      text: variant.content.cta!.text,
    },
  },
  enrichedUrl: ' ',
  onCtaClick: () => {},
});

const Iframe = styled('iframe')({
  width: '620px',
  height: '800px',
});

interface GutterVariantPreviewProps {
  variant: GutterVariant;
}
/**
 * Uses the DCR storybook to render the component, iframed.
 * Props are passed in the args parameter in the url.
 */
const GutterVariantPreview: React.FC<GutterVariantPreviewProps> = ({
  variant,
}: GutterVariantPreviewProps) => {
  const props = buildProps(variant);

  const storyName = 'components-marketing-gutterask--default';
  const storybookUrl = buildStorybookUrl(storyName, props);

  return (
    <div>
      <Iframe src={storybookUrl}></Iframe>
    </div>
  );
};

export default GutterVariantPreview;
