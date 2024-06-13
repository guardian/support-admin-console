import React, {useState} from 'react';
import { Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';
import VariantEditorCtaEditor from '../variantEditorCtaEditor';
import VariantEditorSecondaryCtaEditor from '../variantEditorSecondaryCtaEditor';
import { Cta, SecondaryCta } from '../helpers/shared';
import { DEFAULT_PRIMARY_CTA, DEFAULT_SECONDARY_CTA } from './utils/defaults';

const useStyles = makeStyles(({ spacing }: Theme) => ({
  container: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gridGap: spacing(2),
  },
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
}: EpicTestVariantEditorButtonsEditorProps) => {
  const classes = useStyles();
  const [isPrimaryButtonSelected, setIsPrimaryButtonSelected] = useState<boolean>(false);

  const handlePrimaryButtonChange = (isSelected: boolean): void => {
    setIsPrimaryButtonSelected(isSelected);
  };

  return (
    <div className={classes.container}>
      <VariantEditorCtaEditor
        label="Primary button"
        isDisabled={isDisabled}
        cta={primaryCta}
        updateCta={updatePrimaryCta}
        defaultCta={DEFAULT_PRIMARY_CTA}
        onValidationChange={onValidationChange}
        onPrimaryButtonChange={handlePrimaryButtonChange}  // New prop for state update
      />

      {supportSecondaryCta && isPrimaryButtonSelected && (
        <VariantEditorSecondaryCtaEditor
          label="Secondary button"
          isDisabled={isDisabled}
          cta={secondaryCta}
          updateCta={updateSecondaryCta}
          allowVariantCustomSecondaryCta={allowVariantCustomSecondaryCta}
          defaultCta={DEFAULT_SECONDARY_CTA}
          onValidationChange={onValidationChange}
        />
      )}
    </div>
  );
};

export default EpicTestVariantEditorButtonsEditor;
