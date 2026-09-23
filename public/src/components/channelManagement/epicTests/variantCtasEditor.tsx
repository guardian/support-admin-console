import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';
import VariantCtaEditor from '../../tests/variants/variantCtaEditor';
import VariantEditorSecondaryCtaEditor from '../../tests/variants/variantEditorSecondaryCtaEditor';
import { Cta, SecondaryCta } from '../helpers/shared';
import useValidation from '../hooks/useValidation';
import { DEFAULT_PRIMARY_CTA, DEFAULT_SECONDARY_CTA } from './utils/defaults';

const Container = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gridGap: theme.spacing(2),
}));

interface EpicTestVariantEditorButtonsEditorProps {
  primaryCta?: Cta;
  secondaryCta?: SecondaryCta;
  updatePrimaryCta: (updatedCta?: Cta) => void;
  updateSecondaryCta: (updatedCta?: SecondaryCta) => void;
  allowVariantCustomSecondaryCta: boolean;
  onValidationChange: (isValid: boolean) => void;
  isDisabled: boolean;
  supportSecondaryCta: boolean;
  isPrimaryCtaUrlDisabled?: boolean;
}

const EpicTestVariantEditorButtonsEditor: React.FC<EpicTestVariantEditorButtonsEditorProps> = ({
  primaryCta,
  secondaryCta,
  updatePrimaryCta,
  updateSecondaryCta,
  allowVariantCustomSecondaryCta,
  onValidationChange,
  isDisabled,
  supportSecondaryCta,
  isPrimaryCtaUrlDisabled,
}: EpicTestVariantEditorButtonsEditorProps) => {
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
        <VariantEditorSecondaryCtaEditor
          label="Secondary button"
          isDisabled={isDisabled}
          cta={secondaryCta}
          updateCta={updateSecondaryCta}
          allowVariantCustomSecondaryCta={allowVariantCustomSecondaryCta}
          defaultCta={DEFAULT_SECONDARY_CTA}
          onValidationChange={(isValid) => setValidationStatusForField('secondaryCta', isValid)}
        />
      )}
    </Container>
  );
};

export default EpicTestVariantEditorButtonsEditor;
