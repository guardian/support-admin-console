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
    container: {
      padding: "3px",
      background: "#FFC107",
      borderRadius: "2px",
    },
    text: {
      fontSize: "8px",
      fontWeight: 500,
      textTransform: "uppercase",
    },
  });

interface TestListTestArticleCountLabel extends WithStyles<typeof styles> {}

const TestListTestArticleCountLabel: React.FC<TestListTestArticleCountLabel> = ({
  classes,
}: TestListTestArticleCountLabel) => {
  return (
    <div className={classes.container}>
      <Typography className={classes.text} noWrap={true}>
        AC
      </Typography>
    </div>
  );
};

export default withStyles(styles)(TestListTestArticleCountLabel);