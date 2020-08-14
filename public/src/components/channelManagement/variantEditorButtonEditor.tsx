import React, { useState } from "react";
import {
  Checkbox,
  createStyles,
  FormControlLabel,
  Theme,
  WithStyles,
  withStyles,
} from "@material-ui/core";
import EditableTextField from "./editableTextField";

const styles = ({ spacing }: Theme) =>
  createStyles({
    container: {
      "& > * + *": {
        marginTop: spacing(1),
      },
    },
  });

interface VariantEditorButtonEditorProps {
  label: string;
  isDisabled: boolean;
}

const VariantEditorButtonEditor: React.FC<
  VariantEditorButtonEditorProps & WithStyles<typeof styles>
> = ({ classes, label, isDisabled }) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(event.target.checked);
  };

  return (
    <div className={classes.container}>
      <FormControlLabel
        control={
          <Checkbox
            checked={isChecked}
            onChange={handleChange}
            color="primary"
            disabled={isDisabled}
          />
        }
        label={label}
      />

      {isChecked && (
        <div>
          <EditableTextField
            text="Support the Guardian"
            onSubmit={() => null}
            label="Button copy"
            editEnabled={!isDisabled}
          />
          <EditableTextField
            text="https://support.theguardian.com/contribute"
            onSubmit={() => null}
            label="Button destination"
            editEnabled={!isDisabled}
          />
        </div>
      )}
    </div>
  );
};

export default withStyles(styles)(VariantEditorButtonEditor);
