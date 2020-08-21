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
import useValidation from "../hooks/useValidation";

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
  editMode,
  onValidationChange,
}: BannerTestVariantEditorProps) => {
  const setValidationStatusForField = useValidation(onValidationChange);

  const getHeadingError = getInvalidTemplateError;
  const onHeadingChanged = (isValid: boolean) =>
    setValidationStatusForField("heading", isValid);

  const getEmptyTextError = (text: string) =>
    text.trim() === "" ? "Field must not be empty" : null;

  const getBodyError = getEmptyTextError || getInvalidTemplateError;
  const onBodyChanged = (isValid: boolean) =>
    setValidationStatusForField("body", isValid);

  const getHighlightedTextError = getInvalidTemplateError;
  const onHighLightedTextChange = (isValid: boolean) =>
    setValidationStatusForField("highlightedText", isValid);

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
          validation={{
            getError: getHeadingError,
            onChange: onHeadingChanged,
          }}
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
        validation={{
          getError: getBodyError,
          onChange: onBodyChanged,
        }}
        helperText="Main Banner message, including paragraph breaks"
      />

      <EditableTextField
        text={variant.highlightedText || ""}
        onSubmit={() => null}
        label="Highlighted text"
        editEnabled={editMode}
        validation={{
          getError: getHighlightedTextError,
          onChange: onHighLightedTextChange,
        }}
        helperText="Final sentence of body copy"
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
