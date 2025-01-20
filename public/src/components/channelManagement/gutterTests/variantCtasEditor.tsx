import React from 'react';
import { Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';
import VariantCtaEditor from '../../tests/variants/variantCtaEditor';
import { Cta } from '../helpers/shared';
import { DEFAULT_PRIMARY_CTA } from './utils/defaults';

const useStyles = makeStyles(({ spacing }: Theme) => ({
  container: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gridGap: spacing(2),
  },
}));

interface VariantCtasEditorProps {
  primaryCta?: Cta;
  updatePrimaryCta: (updatedCta?: Cta) => void;
  onValidationChange: (isValid: boolean) => void;
  isDisabled: boolean;
}

const VariantCtasEditor: React.FC<VariantCtasEditorProps> = ({
  primaryCta,
  updatePrimaryCta,
  onValidationChange,
  isDisabled,
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
    </div>
  );
};

export default VariantCtasEditor;
