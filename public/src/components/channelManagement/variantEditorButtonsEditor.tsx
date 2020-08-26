import React from "react";
import { createStyles, Theme, WithStyles, withStyles } from "@material-ui/core";
import VariantEditorButtonEditor from "./variantEditorButtonEditor";
import { Cta } from "./helpers/shared";

const styles = ({ spacing }: Theme) =>
  createStyles({
    container: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gridGap: spacing(2),
    },
  });

const DEFAULT_PRIMARY_CTA = {
  text: "Support the Guardian",
  baseUrl: "https://support.theguardian.com/contribute",
};

const DEFAULT_SECONDARY_CTA = {
  text: "Support the Guardian",
  baseUrl: "https://support.theguardian.com/contribute",
};

interface VariantEditorButtonsEditorProps {
  primaryCta?: Cta;
  secondaryCta?: Cta;
  updatePrimaryCta: (updatedCta?: Cta) => void;
  updateSecondaryCta: (updatedCta?: Cta) => void;
  isDisabled: boolean;
}

const VariantEditorButtonsEditor: React.FC<
  VariantEditorButtonsEditorProps & WithStyles<typeof styles>
> = ({
  classes,
  primaryCta,
  secondaryCta,
  updatePrimaryCta,
  updateSecondaryCta,
  isDisabled,
}) => {
  return (
    <div className={classes.container}>
      <VariantEditorButtonEditor
        label="Primary button"
        isDisabled={isDisabled}
        cta={primaryCta}
        updateCta={updatePrimaryCta}
        defaultCta={DEFAULT_PRIMARY_CTA}
      />
      <VariantEditorButtonEditor
        label="Secondary button"
        isDisabled={isDisabled}
        cta={secondaryCta}
        updateCta={updateSecondaryCta}
        defaultCta={DEFAULT_SECONDARY_CTA}
      />
    </div>
  );
};

export default withStyles(styles)(VariantEditorButtonsEditor);
