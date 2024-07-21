import React from 'react';
import { Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';
import VariantCtaEditor from '../../tests/variants/variantEditorCtaEditor';
import VariantSecondaryCtaEditor from '../../tests/variants/variantEditorSecondaryCtaEditor';
import { Cta, SecondaryCta } from '../helpers/shared';
import { DEFAULT_PRIMARY_CTA, DEFAULT_SECONDARY_CTA } from './utils/defaults';

const useStyles = makeStyles(({ spacing }: Theme) => ({
  container: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gridGap: spacing(2),
  },
}));

interface VariantCtasEditorProps {
  primaryCta?: Cta;
  secondaryCta?: SecondaryCta;
  updatePrimaryCta: (updatedCta?: Cta) => void;
  updateSecondaryCta: (updatedCta?: SecondaryCta) => void;
  onValidationChange: (isValid: boolean) => void;
  isDisabled: boolean;
  supportSecondaryCta: boolean;
}

const VariantCtasEditor: React.FC<VariantCtasEditorProps> = ({
  primaryCta,
  secondaryCta,
  updatePrimaryCta,
  updateSecondaryCta,
  onValidationChange,
  isDisabled,
  supportSecondaryCta,
}: VariantCtasEditorProps) => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <VariantCtaEditor
        label="Primary button"
        isDisabled={isDisabled}
        cta={primaryCta}
        updateCta={updatePrimaryCta}
        defaultCta={DEFAULT_PRIMARY_CTA}
        onValidationChange={onValidationChange}
      />

      {supportSecondaryCta && (
        <VariantSecondaryCtaEditor
          label="Secondary button"
          isDisabled={isDisabled}
          cta={secondaryCta}
          allowVariantCustomSecondaryCta={true}
          updateCta={updateSecondaryCta}
          defaultCta={DEFAULT_SECONDARY_CTA}
          onValidationChange={onValidationChange}
        />
      )}
    </div>
  );
};

export default VariantCtasEditor;
