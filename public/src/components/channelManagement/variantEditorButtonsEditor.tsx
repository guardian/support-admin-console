import React, { useState } from "react";
import {
  Checkbox,
  createStyles,
  FormControlLabel,
  Theme,
  WithStyles,
  withStyles,
} from "@material-ui/core";
import VariantEditorButtonEditor from "./variantEditorButtonEditor";

const styles = ({ spacing }: Theme) =>
  createStyles({
    container: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gridGap: spacing(2),
    },
  });

interface VariantEditorButtonsEditorProps {
  isDisabled: boolean;
}

const VariantEditorButtonsEditor: React.FC<
  VariantEditorButtonsEditorProps & WithStyles<typeof styles>
> = ({ classes, isDisabled }) => {
  return (
    <div className={classes.container}>
      <VariantEditorButtonEditor
        label="Primary button"
        isDisabled={isDisabled}
      />
      <VariantEditorButtonEditor
        label="Secondary button"
        isDisabled={isDisabled}
      />
    </div>
  );
};

export default withStyles(styles)(VariantEditorButtonsEditor);
