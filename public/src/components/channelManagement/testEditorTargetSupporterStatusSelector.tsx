import React from "react";

import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  Theme,
  Typography,
  WithStyles,
  createStyles,
  withStyles,
} from "@material-ui/core";
import { UserCohort } from "./helpers/shared";

const styles = ({ spacing }: Theme) =>
  createStyles({
    container: {
      "& > * + *": {
        marginTop: spacing(2),
      },
    },
    indentedContainer: {
      marginLeft: spacing(3),
    },
  });

interface TestEditorTargetSupporterStatusSelectorProps
  extends WithStyles<typeof styles> {
  selectedCohort: UserCohort;
  onCohortChange: (updatedCohort: UserCohort) => void;
  isDisabled: boolean;
}
const TestEditorTargetSupporterStatusSelector: React.FC<TestEditorTargetSupporterStatusSelectorProps> = ({
  classes,
  selectedCohort,
  onCohortChange,
  isDisabled,
}: TestEditorTargetSupporterStatusSelectorProps) => {
  const onEveryoneSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    if (checked) {
      onCohortChange(UserCohort["Everyone"]);
    }
  };

  const onNonSupportersSelected = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const checked = event.target.checked;
    if (checked) {
      onCohortChange(UserCohort["Everyone"]);
    } else if (selectedCohort === UserCohort["Everyone"]) {
      onCohortChange(UserCohort["AllExistingSupporters"]);
    }
  };

  const onAllSupportersSelected = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const checked = event.target.checked;
    if (checked) {
      onCohortChange(UserCohort["Everyone"]);
    } else if (selectedCohort === UserCohort["Everyone"]) {
      onCohortChange(UserCohort["AllNonSupporters"]);
    }
  };

  return (
    <div className={classes.container}>
      <Typography>Supporter status</Typography>
      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox
              checked={selectedCohort === "Everyone"}
              onChange={onEveryoneSelected}
              disabled={isDisabled}
            />
          }
          label="Everyone"
        />
        <FormGroup className={classes.indentedContainer}>
          <FormControlLabel
            control={
              <Checkbox
                checked={
                  selectedCohort === UserCohort["Everyone"] ||
                  selectedCohort === UserCohort["AllNonSupporters"]
                }
                onChange={onNonSupportersSelected}
                disabled={isDisabled}
              />
            }
            label="Non-supporters"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={
                  selectedCohort === UserCohort["Everyone"] ||
                  selectedCohort === UserCohort["AllExistingSupporters"]
                }
                onChange={onAllSupportersSelected}
                disabled={isDisabled}
              />
            }
            label="Existing supporters"
          />
        </FormGroup>
      </FormGroup>
    </div>
  );
};

export default withStyles(styles)(TestEditorTargetSupporterStatusSelector);
