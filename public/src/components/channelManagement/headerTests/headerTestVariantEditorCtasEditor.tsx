import React from 'react';
import { Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';
import VariantEditorCtaEditor from '../variantEditorCtaEditor';

import { Cta } from '../helpers/shared';

import { DEFAULT_PRIMARY_CTA, DEFAULT_SECONDARY_CTA } from './utils/defaults';

const useStyles = makeStyles(({ spacing }: Theme) => ({
  container: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gridGap: spacing(2),
  },
}));

interface HeaderTestVariantEditorCtasEditorProps {
  primaryCta?: Cta;
  secondaryCta?: Cta;
  updatePrimaryCta: (updatedCta?: Cta) => void;
  updateSecondaryCta: (updatedCta?: Cta) => void;
  onValidationChange: (isValid: boolean) => void;
  isDisabled: boolean;
  supportSecondaryCta: boolean;
}

const HeaderTestVariantEditorCtasEditor: React.FC<HeaderTestVariantEditorCtasEditorProps> = ({
  primaryCta,
  secondaryCta,
  updatePrimaryCta,
  updateSecondaryCta,
  onValidationChange,
  isDisabled,
  supportSecondaryCta,
}: HeaderTestVariantEditorCtasEditorProps) => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <VariantEditorCtaEditor
        label="Primary button"
        isDisabled={isDisabled}
        cta={primaryCta}
        updateCta={updatePrimaryCta}
        defaultCta={DEFAULT_PRIMARY_CTA}
        onValidationChange={onValidationChange}
      />

      {supportSecondaryCta && (
        <VariantEditorCtaEditor
          label="Secondary button"
          isDisabled={isDisabled}
          cta={secondaryCta}
          updateCta={updateSecondaryCta}
          defaultCta={DEFAULT_SECONDARY_CTA}
          onValidationChange={onValidationChange}
        />
      )}
    </div>
  );
};

export default HeaderTestVariantEditorCtasEditor;
