import { Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';
import React from 'react';
import VariantCtaEditor from '../../tests/variants/variantCtaEditor';
import { Cta } from '../helpers/shared';
import useValidation from '../hooks/useValidation';
import { DEFAULT_PRIMARY_CTA, DEFAULT_SECONDARY_CTA } from './utils/defaults';

const useStyles = makeStyles(({ spacing }: Theme) => ({
  container: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gridGap: spacing(2),
  },
}));

interface HeaderTestVariantCtasEditorProps {
  primaryCta?: Cta;
  secondaryCta?: Cta;
  updatePrimaryCta: (updatedCta?: Cta) => void;
  updateSecondaryCta: (updatedCta?: Cta) => void;
  onValidationChange: (isValid: boolean) => void;
  isDisabled: boolean;
  supportSecondaryCta: boolean;
}

const HeaderTestVariantCtasEditor: React.FC<HeaderTestVariantCtasEditorProps> = ({
  primaryCta,
  secondaryCta,
  updatePrimaryCta,
  updateSecondaryCta,
  onValidationChange,
  isDisabled,
  supportSecondaryCta,
}: HeaderTestVariantCtasEditorProps) => {
  const classes = useStyles();
  const setValidationStatusForField = useValidation(onValidationChange);

  return (
    <div className={classes.container}>
      <VariantCtaEditor
        label="Primary button"
        isDisabled={isDisabled}
        cta={primaryCta}
        updateCta={updatePrimaryCta}
        defaultCta={DEFAULT_PRIMARY_CTA}
        onValidationChange={(isValid) => setValidationStatusForField('primaryCta', isValid)}
      />

      {supportSecondaryCta && (
        <VariantCtaEditor
          label="Secondary button"
          isDisabled={isDisabled}
          cta={secondaryCta}
          updateCta={updateSecondaryCta}
          defaultCta={DEFAULT_SECONDARY_CTA}
          onValidationChange={(isValid) => setValidationStatusForField('secondaryCta', isValid)}
        />
      )}
    </div>
  );
};

export default HeaderTestVariantCtasEditor;
