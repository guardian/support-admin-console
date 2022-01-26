import React from 'react';
import { createStyles, List, withStyles, WithStyles } from '@material-ui/core';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

import { Test } from './helpers/shared';
import TestListTest from './testListTest';

const styles = createStyles({
  container: {},
  list: {
    marginTop: 0,
    padding: 0,
    '& > * + *': {
      marginTop: '8px',
    },
  },
});

interface TestListProps<T extends Test> {
  tests: T[];
  isInEditMode: boolean;
  selectedTestName: string | null;
  onTestPriorityChange: (newPriority: number, oldPriority: number) => void;
  onTestSelected: (testName: string) => void;
}

const TestList = <T extends Test>({
  classes,
  tests,
  isInEditMode,
  selectedTestName,
  onTestPriorityChange,
  onTestSelected,
}: TestListProps<T> & WithStyles<typeof styles>): React.ReactElement => {
  const onDragEnd = ({ destination, source }: DropResult): void => {
    if (destination) {
      onTestPriorityChange(destination.index, source.index);
    }
  };

  return (
    <div className={classes.container}>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided): React.ReactElement => (
            <List className={classes.list} ref={provided.innerRef} {...provided.droppableProps}>
              {tests.map((test, index) =>
                isInEditMode ? (
                  <Draggable key={test.name} draggableId={test.name} index={index}>
                    {(provided): React.ReactElement => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <TestListTest
                          test={test}
                          isSelected={test.name === selectedTestName}
                          onClick={(): void => onTestSelected(test.name)}
                        />
                      </div>
                    )}
                  </Draggable>
                ) : (
                  <TestListTest
                    key={test.name}
                    test={test}
                    isSelected={test.name === selectedTestName}
                    onClick={(): void => onTestSelected(test.name)}
                  />
                ),
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
  props: TestListProps<T>,
): React.ReactElement<TestListProps<T>> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const wrapper = withStyles(styles)(TestList) as any;

  return React.createElement(wrapper, props);
}
