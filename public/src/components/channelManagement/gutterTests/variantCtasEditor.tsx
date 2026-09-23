import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';
import VariantCtaEditor from '../../tests/variants/variantCtaEditor';
import { Cta } from '../helpers/shared';
import { DEFAULT_PRIMARY_CTA } from './utils/defaults';

const Container = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gridGap: theme.spacing(2),
}));

interface VariantCtasEditorProps {
  primaryCta?: Cta;
  updatePrimaryCta: (updatedCta?: Cta) => void;
  onValidationChange: (isValid: boolean) => void;
  isDisabled: boolean;
  copyLength?: number;
}

const VariantCtasEditor: React.FC<VariantCtasEditorProps> = ({
  primaryCta,
  updatePrimaryCta,
  onValidationChange,
  isDisabled,
  copyLength,
}: VariantCtasEditorProps) => {
  return (
    <Container>
      <VariantCtaEditor
        label="Primary button"
        isDisabled={isDisabled}
        cta={primaryCta}
        updateCta={updatePrimaryCta}
        defaultCta={DEFAULT_PRIMARY_CTA}
        onValidationChange={onValidationChange}
        copyLength={copyLength}
      />
    </Container>
  );
};

export default VariantCtasEditor;
