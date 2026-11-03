import { styled } from '@mui/material/styles';
import React from 'react';
import { Inline1Variant } from '../../../models/inline1';
import { getPreviewUrl } from '../../tests/variants/variantSummaryWebPreviewButton';

export const buildInline1PreviewUrl = (testName: string, variant: Inline1Variant): string =>
  getPreviewUrl(testName, variant.name, 'INLINE1', 'Standard');

const Iframe = styled('iframe')({
  width: '620px',
  height: '800px',
});

interface Inline1VariantPreviewProps {
  testName: string;
  variant: Inline1Variant;
}

/**
 * Previews the saved Inline1 test variant in an article.
 */
const Inline1VariantPreview: React.FC<Inline1VariantPreviewProps> = ({
  testName,
  variant,
}: Inline1VariantPreviewProps) => {
  const previewUrl = buildInline1PreviewUrl(testName, variant);

  return (
    <div>
      <Iframe src={previewUrl} title={`Inline1 ${variant.name} preview`} />
    </div>
  );
};

export default Inline1VariantPreview;
