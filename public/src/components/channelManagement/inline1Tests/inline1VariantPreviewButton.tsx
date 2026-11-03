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
}: Inline1VariantPreviewButtonProps) => (
  <Button
    startIcon={<VisibilityIcon />}
    size="small"
    onClick={(event): void => event.stopPropagation()}
    onFocus={(event): void => event.stopPropagation()}
    href={buildInline1PreviewUrl(variant)}
    target="_blank"
    rel="noopener noreferrer"
    disabled={isDisabled}
  >
    COMPONENT PREVIEW
  </Button>
);

export default Inline1VariantPreviewButton;

