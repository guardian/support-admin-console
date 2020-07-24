import React from "react";
import {
  createStyles,
  List,
  Theme,
  Typography,
  withStyles,
  WithStyles,
} from "@material-ui/core";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import { Test } from "./helpers/shared";
import TestListTest from "./testListTest";

const styles = ({}: Theme) =>
  createStyles({
    container: {
      marginTop: "-30px",
    },
    header: {
      height: "30px",
      fontSize: "14px",
    },
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
}

const TestList = <T extends Test>({
  classes,
  tests,
  isInEditMode,
}: TestListProps<T> & WithStyles<typeof styles>) => {
  return (
    <div className={classes.container}>
      <Typography className={classes.header}>
        Tests in priority order
      </Typography>
      <DragDropContext onDragEnd={() => console.log("dragEnd")}>
        <Droppable droppableId="droppable">
          {(provided) => (
            <List
              className={classes.list}
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {tests.map((test, index) =>
                isInEditMode ? (
                  <Draggable key={index} draggableId={test.name} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <TestListTest test={test} />
                      </div>
                    )}
                  </Draggable>
                ) : (
                  <TestListTest test={test} />
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
