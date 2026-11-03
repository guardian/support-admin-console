import VisibilityIcon from '@mui/icons-material/Visibility';
import { Button } from '@mui/material';
import React from 'react';
import { Inline1Variant } from '../../../models/inline1';
import { buildInline1PreviewUrl } from './inline1VariantPreview';

interface Inline1VariantPreviewButtonProps {
  variant: Inline1Variant;
  isDisabled: boolean;
}

const Inline1VariantPreviewButton: React.FC<Inline1VariantPreviewButtonProps> = ({
  variant,
  isDisabled,
}: Inline1VariantPreviewButtonProps) => {
  const previewUrl = buildInline1PreviewUrl(variant);

  return (
    <Button
      component="a"
      startIcon={<VisibilityIcon />}
      size="small"
      onClick={(event): void => event.stopPropagation()}
      onFocus={(event): void => event.stopPropagation()}
      href={previewUrl}
      target="_blank"
      rel="noopener noreferrer"
      disabled={isDisabled || !previewUrl}
    >
      {previewUrl ? 'COMPONENT PREVIEW' : 'Will be added soon'}
    </Button>
  );
};

export default Inline1VariantPreviewButton;
