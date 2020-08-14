import React from "react";
import {
  createStyles,
  Theme,
  Typography,
  WithStyles,
  withStyles,
} from "@material-ui/core";
import EditableTextField from "../editableTextField";
import ButtonWithConfirmationPopup from "../buttonWithConfirmationPopup";
import VariantEditorButtonsEditor from "../variantEditorButtonsEditor";
import DeleteSweepIcon from "@material-ui/icons/DeleteSweep";
import {
  onFieldValidationChange,
  ValidationStatus,
} from "../helpers/validation";
import { BannerVariant } from "./bannerTestsForm";
import CtaEditor from "../ctaEditor";
import { Cta, defaultCta } from "../helpers/shared";
import { getInvalidTemplateError } from "../helpers/copyTemplates";

const styles = ({ palette, spacing }: Theme) =>
  createStyles({
    container: {
      width: "100%",
      marginLeft: "15px",
    },
    hook: {
      maxWidth: "400px",
    },
    buttonsSectionContainer: {
      marginTop: spacing(5),
      "& > * + *": {
        marginTop: spacing(3),
      },
    },
    buttonsSectionHeader: {
      fontSize: 16,
      color: palette.grey[900],
    },
  });

interface BannerTestVariantEditorProps extends WithStyles<typeof styles> {
  variant: BannerVariant;
  onVariantChange: (updatedVariant: BannerVariant) => void;
  editMode: boolean;
  onDelete: () => void;
  onValidationChange: (isValid: boolean) => void;
}

const BannerTestVariantEditor: React.FC<BannerTestVariantEditorProps> = ({
  classes,
  variant,
  onVariantChange,
  editMode,
  onDelete,
  onValidationChange,
}: BannerTestVariantEditorProps) => {
  return (
    <div className={classes.container}>
      <EditableTextField
        text={variant.name}
        onSubmit={() => null}
        label="Variant name"
        editEnabled={editMode}
      />

      <div className={classes.hook}>
        <EditableTextField
          text={variant.heading || ""}
          onSubmit={() => null}
          label="Header"
          editEnabled={editMode}
          helperText="Format: 'control' or 'v1_name'"
        />
      </div>

      <EditableTextField
        required
        textarea
        height={10}
        text={variant.body}
        onSubmit={() => null}
        label="Body copy"
        editEnabled={editMode}
        helperText="Main Banner message, including paragraph breaks"
      />

      <EditableTextField
        text={variant.highlightedText || ""}
        onSubmit={() => null}
        label="Highlighted text"
        helperText="Final sentence of body copy"
        editEnabled={editMode}
      />

      <div className={classes.buttonsSectionContainer}>
        <Typography className={classes.buttonsSectionHeader} variant="h4">
          Buttons
        </Typography>

        <VariantEditorButtonsEditor isDisabled={!editMode} />
      </div>
    </div>
  );
};

export default withStyles(styles)(BannerTestVariantEditor);
