import React from "react";
import {
  Typography,
  createStyles,
  withStyles,
  WithStyles,
  Theme,
} from "@material-ui/core";

const styles = ({}: Theme) =>
  createStyles({
    testName: {
      maxWidth: "190px",
      fontSize: "12px",
      fontWeight: 500,
      lineHeight: "24px",
      textTransform: "uppercase",
    },
  });

interface TestListTestNameProps extends WithStyles<typeof styles> {
  name: string;
  nickname?: string;
}

const TEST_NAME_CHARACTERS_TO_STRIP_REGEX = /^\d{4}-\d{2}-\d{2}_(contribs*_|moment_)*/;

const TestListTestName: React.FC<TestListTestNameProps> = ({
  classes,
  name,
  nickname,
}: TestListTestNameProps) => {
  return (
    <Typography className={classes.testName} noWrap={true}>
      {nickname
        ? nickname
        : name.replace(TEST_NAME_CHARACTERS_TO_STRIP_REGEX, "")}
    </Typography>
  );
};

export default withStyles(styles)(TestListTestName);
