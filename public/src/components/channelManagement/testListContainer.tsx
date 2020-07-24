import React from "react";
import { createStyles, Theme, withStyles, WithStyles } from "@material-ui/core";
import { ModifiedTests } from "./helpers/shared";
import { Test } from "./helpers/shared";
import TestList from "./testList";
import TestPriorityLabelList from "./testPriorityLabelList";

const styles = ({}: Theme) =>
  createStyles({
    root: {},
    testsListHeader: {
      fontSize: "14px",
    },
    listsContainer: {
      display: "flex",
      marginTop: "8px",
      paddingTop: "30px",
      "& > * + *": {
        marginLeft: "14px",
      },
    },
    priorityList: {
      marginTop: 0,
      padding: 0,
      "& > * + *": {
        marginTop: "8px",
      },
    },
    testsList: {
      marginTop: 0,
      padding: 0,
      "& > * + *": {
        marginTop: "8px",
      },
    },
  });

interface TestListContainerProps<T extends Test> {
  tests: T[];
  modifiedTests: ModifiedTests;
  selectedTestName?: string;
  onUpdate: (tests: T[], modifiedTestName?: string) => void;
  createDefaultTest: (newTestName: string, newTestNickname: string) => T;
  onSelectedTestName: (testName: string) => void;
  isInEditMode: boolean;
}

const TestListContainer = <T extends Test>({
  classes,
  tests,
  isInEditMode,
  onUpdate,
  onSelectedTestName,
}: TestListContainerProps<T> & WithStyles<typeof styles>) => {
  return (
    <div className={classes.root}>
      <div className={classes.listsContainer}>
        <TestPriorityLabelList numTests={tests.length} />
        <TestList
          tests={tests}
          isInEditMode={isInEditMode}
          onUpdate={onUpdate}
          onTestSelected={onSelectedTestName}
        />
      </div>
    </div>
  );
};

// Hack to work around material UI breaking type checking when class has type parameters - https://stackoverflow.com/q/52567697
export default function WrappedTestListContainer<T extends Test>(
  props: TestListContainerProps<T>
): React.ReactElement<TestListContainerProps<T>> {
  const wrapper = withStyles(styles)(TestListContainer) as any;

  return React.createElement(wrapper, props);
}
