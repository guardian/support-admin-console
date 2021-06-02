import React from 'react';
import { createStyles, Theme, WithStyles, withStyles } from '@material-ui/core';
import VariantEditorCtaEditor from '../variantEditorCtaEditor';
import VariantEditorSecondaryCtaEditor from '../variantEditorSecondaryCtaEditor';
import { Cta, SecondaryCta } from '../helpers/shared';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const styles = ({ spacing }: Theme) =>
  createStyles({
    container: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gridGap: spacing(2),
    },
  });

const DEFAULT_PRIMARY_CTA = {
  text: 'Support the Guardian',
  baseUrl: 'https://support.theguardian.com/contribute',
};

const DEFAULT_SECONDARY_CTA = {
  text: 'Support the Guardian',
  baseUrl: 'https://support.theguardian.com/contribute',
};

interface BannerTestVariantEditorCtasEditorProps extends WithStyles<typeof styles> {
  primaryCta?: Cta;
  secondaryCta?: SecondaryCta;
  updatePrimaryCta: (updatedCta?: Cta) => void;
  updateSecondaryCta: (updatedCta?: SecondaryCta) => void;
  onValidationChange: (isValid: boolean) => void;
  isDisabled: boolean;
  supportSecondaryCta: boolean;
}

const BannerTestVariantEditorCtasEditor: React.FC<BannerTestVariantEditorCtasEditorProps> = ({
  classes,
  primaryCta,
  secondaryCta,
  updatePrimaryCta,
  updateSecondaryCta,
  onValidationChange,
  isDisabled,
  supportSecondaryCta,
}: BannerTestVariantEditorCtasEditorProps) => {
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
        <VariantEditorSecondaryCtaEditor
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

export default withStyles(styles)(BannerTestVariantEditorCtasEditor);
