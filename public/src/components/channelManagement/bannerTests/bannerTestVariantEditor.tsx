import React from "react";
import {
  createStyles,
  Theme,
  Typography,
  WithStyles,
  withStyles,
} from "@material-ui/core";
import EditableTextField from "../editableTextField";
import VariantEditorButtonsEditor from "../variantEditorButtonsEditor";
import { BannerVariant } from "./bannerTestsForm";
import { getInvalidTemplateError } from "../helpers/copyTemplates";
import { getEmptyError } from "../helpers/validation";
import useValidation from "../hooks/useValidation";
import { Cta } from "../helpers/shared";

const styles = ({ palette, spacing }: Theme) =>
  createStyles({
    container: {
      width: "100%",
      paddingTop: spacing(2),
      paddingLeft: spacing(4),
      paddingRight: spacing(10),

      "& > * + *": {
        marginTop: spacing(3),
      },
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
  editMode,
  onValidationChange,
  onVariantChange,
}: BannerTestVariantEditorProps) => {
  const setValidationStatusForField = useValidation(onValidationChange);

  const getHeadingError = getInvalidTemplateError;
  const onHeadingChanged = (isValid: boolean) =>
    setValidationStatusForField("heading", isValid);
  const onHeadingSubmit = (updatedHeading: string) =>
    onVariantChange({ ...variant, heading: updatedHeading });

  const getBodyError = (text: string) =>
    getEmptyError(text) || getInvalidTemplateError(text);
  const onBodyChanged = (isValid: boolean) =>
    setValidationStatusForField("body", isValid);
  const onBodySubmit = (updatedBody: string) =>
    onVariantChange({ ...variant, body: updatedBody });

  const getHighlightedTextError = getInvalidTemplateError;
  const onHighLightedTextChange = (isValid: boolean) =>
    setValidationStatusForField("highlightedText", isValid);
  const onHighlightedTextSubmit = (updatedHighlightedText: string) =>
    onVariantChange({ ...variant, highlightedText: updatedHighlightedText });

  const updatePrimaryCta = (updatedCta?: Cta) => {
    onVariantChange({ ...variant, cta: updatedCta });
  };

  const updateSecondaryCta = (updatedCta?: Cta) => {
    onVariantChange({ ...variant, secondaryCta: updatedCta });
  };

  return (
    <div className={classes.container}>
      <EditableTextField
        text={variant.heading || ""}
        onSubmit={onHeadingSubmit}
        label="Header"
        editEnabled={editMode}
        validation={{
          getError: getHeadingError,
          onChange: onHeadingChanged,
        }}
        helperText="Assistive text"
        fullWidth
      />

      <EditableTextField
        textarea
        height={10}
        text={variant.body}
        onSubmit={onBodySubmit}
        label="Body copy"
        editEnabled={editMode}
        validation={{
          getError: getBodyError,
          onChange: onBodyChanged,
        }}
        helperText="Main Banner message, including paragraph breaks"
        fullWidth
      />

      <EditableTextField
        text={variant.highlightedText || ""}
        onSubmit={onHighlightedTextSubmit}
        label="Highlighted text"
        editEnabled={editMode}
        validation={{
          getError: getHighlightedTextError,
          onChange: onHighLightedTextChange,
        }}
        helperText="Final sentence of body copy"
        fullWidth
      />

      <div className={classes.buttonsSectionContainer}>
        <Typography className={classes.buttonsSectionHeader} variant="h4">
          Buttons
        </Typography>

        <VariantEditorButtonsEditor
          primaryCta={variant.cta}
          secondaryCta={variant.secondaryCta}
          updatePrimaryCta={updatePrimaryCta}
          updateSecondaryCta={updateSecondaryCta}
          isDisabled={!editMode}
        />
      </div>
    </div>
  );
};

export default withStyles(styles)(BannerTestVariantEditor);
