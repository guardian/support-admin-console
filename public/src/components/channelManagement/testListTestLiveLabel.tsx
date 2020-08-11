import React from "react";
import {
  Typography,
  createStyles,
  withStyles,
  WithStyles,
  Theme,
} from "@material-ui/core";

const styles = ({ typography, spacing, palette }: Theme) =>
  createStyles({
    label: {
      display: "flex",
      justifyContent: "center",
      width: "35px",
      padding: "2px",
      borderRadius: "2px",
      backgroundColor: "#F2453D",
    },
    labelLive: {
      backgroundColor: "#F2453D",
    },
    labelDraft: {
      backgroundColor: `${palette.grey[700]}`,
    },
    labelText: {
      fontSize: "9px",
      fontWeight: 500,
      textTransform: "uppercase",
      color: "white",
    },
  });

interface TestListTestLiveLabelProps extends WithStyles<typeof styles> {
  isLive: boolean;
}

const TestListTestLiveLabel: React.FC<TestListTestLiveLabelProps> = ({
  isLive,
  classes,
}: TestListTestLiveLabelProps) => {
  return (
    <div
      className={`${classes.label} ${
        isLive ? classes.labelLive : classes.labelDraft
      }`}
    >
      <Typography className={classes.labelText}>
        {isLive ? "Live" : "Draft"}
      </Typography>
    </div>
  );
};

export default withStyles(styles)(TestListTestLiveLabel);
