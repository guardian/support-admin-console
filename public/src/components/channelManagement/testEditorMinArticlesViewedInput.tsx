import React from "react";
import {
  createStyles,
  withStyles,
  WithStyles,
  Theme,
  Typography,
} from "@material-ui/core";

import EditableTextField from "./editableTextField";
import { getNotNumberError } from "./helpers/validation";
import useValidation from "./hooks/useValidation";

const styles = ({ spacing }: Theme) =>
  createStyles({
    container: {
      display: "flex",
      alignItems: "center",
    },
    text: {
      marginLeft: spacing(1),
      fontSize: 14,
    },
  });

interface TestEditorMinArticlesViewedInputProps
  extends WithStyles<typeof styles> {
  minArticles: number;
  isDisabled: boolean;
  onValidationChange: (isValid: boolean) => void;
}

const TestEditorMinArticlesViewedInput: React.FC<TestEditorMinArticlesViewedInputProps> = ({
  classes,
  minArticles,
  isDisabled,
  onValidationChange,
}: TestEditorMinArticlesViewedInputProps) => {
  const setValidationStatusForField = useValidation(onValidationChange);

  const getError = getNotNumberError;
  const onChange = (isValid: boolean) =>
    setValidationStatusForField("minArticlesViewedInput", isValid);

  return (
    <div className={classes.container}>
      <EditableTextField
        text={minArticles.toString()}
        onSubmit={() => {
          null;
        }}
        label="Show the banner on"
        helperText="Must be a number"
        editEnabled={!isDisabled}
        validation={{
          getError: getError,
          onChange: onChange,
        }}
        variant="filled"
        isNumberField
      />
      <Typography className={classes.text}>page views</Typography>
    </div>
  );
};

export default withStyles(styles)(TestEditorMinArticlesViewedInput);
