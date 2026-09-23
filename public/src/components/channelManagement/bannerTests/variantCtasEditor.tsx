import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';
import VariantCtaEditor from '../../tests/variants/variantCtaEditor';
import VariantSecondaryCtaEditor from '../../tests/variants/variantEditorSecondaryCtaEditor';
import { Cta, SecondaryCta } from '../helpers/shared';
import useValidation from '../hooks/useValidation';
import { DEFAULT_PRIMARY_CTA, DEFAULT_SECONDARY_CTA } from './utils/defaults';

const Container = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gridGap: theme.spacing(2),
}));

interface VariantCtasEditorProps {
  primaryCta?: Cta;
  secondaryCta?: SecondaryCta;
  updatePrimaryCta: (updatedCta?: Cta) => void;
  updateSecondaryCta: (updatedCta?: SecondaryCta) => void;
  onValidationChange: (isValid: boolean) => void;
  isDisabled: boolean;
  supportSecondaryCta: boolean;
  isPrimaryCtaUrlDisabled?: boolean;
}

const VariantCtasEditor: React.FC<VariantCtasEditorProps> = ({
  primaryCta,
  secondaryCta,
  updatePrimaryCta,
  updateSecondaryCta,
  onValidationChange,
  isDisabled,
  supportSecondaryCta,
  isPrimaryCtaUrlDisabled,
}: VariantCtasEditorProps) => {
  const setValidationStatusForField = useValidation(onValidationChange);

  return (
    <Container>
      <VariantCtaEditor
        label="Primary button"
        isDisabled={isDisabled}
        cta={primaryCta}
        updateCta={updatePrimaryCta}
        defaultCta={DEFAULT_PRIMARY_CTA}
        onValidationChange={(isValid) => setValidationStatusForField('primaryCta', isValid)}
        isPrimaryCtaUrlDisabled={isPrimaryCtaUrlDisabled}
      />

      {supportSecondaryCta && (
        <VariantSecondaryCtaEditor
          label="Secondary button"
          isDisabled={isDisabled}
          cta={secondaryCta}
          allowVariantCustomSecondaryCta={true}
          updateCta={updateSecondaryCta}
          defaultCta={DEFAULT_SECONDARY_CTA}
          onValidationChange={(isValid) => setValidationStatusForField('secondaryCta', isValid)}
        />
      )}
    </Container>
  );
};

export default VariantCtasEditor;
