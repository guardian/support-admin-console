import React from "react";
import {
  createStyles,
  List,
  Theme,
  withStyles,
  WithStyles,
} from "@material-ui/core";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";

import { Test } from "./helpers/shared";
import TestListTest from "./testListTest";

const styles = ({}: Theme) =>
  createStyles({
    container: {},
    list: {
      marginTop: 0,
      padding: 0,
      "& > * + *": {
        marginTop: "8px",
      },
    },
  });

interface TestListProps<T extends Test> {
  tests: T[];
  isInEditMode: boolean;
  onUpdate: (tests: T[], modifiedTestName?: string) => void;
  onTestSelected: (testName: string) => void;
}

const TestList = <T extends Test>({
  classes,
  tests,
  isInEditMode,
  onUpdate,
  onTestSelected,
}: TestListProps<T> & WithStyles<typeof styles>) => {
  const onDragEnd = ({ destination, source }: DropResult) => {
    if (destination) {
      const newTests = [...tests];
      const movedTest = { ...tests[source.index] };
      newTests.splice(source.index, 1);
      newTests.splice(destination.index, 0, movedTest);

      onUpdate(newTests, movedTest.name);
    }
  };

  return (
    <div className={classes.container}>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided) => (
            <List
              className={classes.list}
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {tests.map((test, index) =>
                isInEditMode ? (
                  <Draggable
                    key={test.name}
                    draggableId={test.name}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <TestListTest
                          test={test}
                          onClick={() => onTestSelected(test.name)}
                        />
                      </div>
                    )}
                  </Draggable>
                ) : (
                  <TestListTest
                    key={test.name}
                    test={test}
                    onClick={() => onTestSelected(test.name)}
                  />
                )
              )}
            </List>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

// Hack to work around material UI breaking type checking when class has type parameters - https://stackoverflow.com/q/52567697
export default function WrappedTestsList<T extends Test>(
  props: TestListProps<T>
): React.ReactElement<TestListProps<T>> {
  const wrapper = withStyles(styles)(TestList) as any;

  return React.createElement(wrapper, props);
}
