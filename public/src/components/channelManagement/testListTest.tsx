import React from "react";
import {
  ListItem,
  createStyles,
  withStyles,
  WithStyles,
  Theme,
} from "@material-ui/core";
import { Test } from "./helpers/shared";
import TestListTestLiveLabel from "./testListTestLiveLabel";
import TestListTestName from "./testListTestName";
import TestListTestArticleCountLabel from "./testListTestArticleCountLabel";

const styles = ({ spacing, palette }: Theme) =>
  createStyles({
    test: {
      position: "relative",
      height: "50px",
      width: "290px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      background: "white",
      borderRadius: "4px",
      padding: "0 12px",
    },
    testLive: {
      border: `1px solid #f2453d`,
    },
    testDraft: {
      border: `1px solid ${palette.grey[700]}`,
    },
    priorityLabelContainer: {
      position: "absolute",
      top: "0",
      bottom: "0",
      left: "-36px",
    },
    labelAndNameContainer: {
      display: "flex",
      alignItems: "center",
      "& > * + *": {
        marginLeft: "4px",
      },
    },
  });

interface TestListTestProps extends WithStyles<typeof styles> {
  test: Test;
}

const TestListTest: React.FC<TestListTestProps> = ({
  classes,
  test,
}: TestListTestProps) => {
  const hasArticleCount = test.articlesViewedSettings !== undefined;

  const testClasses = [
    classes.test,
    test.isOn ? classes.testLive : classes.testDraft,
  ].join(" ");

  return (
    <ListItem className={testClasses} button={true}>
      <div className={classes.labelAndNameContainer}>
        <TestListTestLiveLabel isLive={test.isOn} />
        <TestListTestName name={test.name} nickname={test.nickname} />
      </div>

      {hasArticleCount && <TestListTestArticleCountLabel />}
    </ListItem>
  );
};

export default withStyles(styles)(TestListTest);
