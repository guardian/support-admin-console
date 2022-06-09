import React from 'react';
import { List, makeStyles } from '@material-ui/core';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

import { Test } from './helpers/shared';
import TestListTest from './testListTest';

const useStyles = makeStyles(() => ({
  container: {},
  list: {
    marginTop: 0,
    padding: 0,
    '& > * + *': {
      marginTop: '8px',
    },
  },
}));

interface TestListProps<T extends Test> {
  tests: T[];
  isInEditMode: boolean;
  selectedTestName: string | null;
  onTestPriorityChange: (newPriority: number, oldPriority: number) => void;
  onTestSelected: (testName: string) => void;
}

const TestList = <T extends Test>({
  tests,
  isInEditMode,
  selectedTestName,
  onTestPriorityChange,
  onTestSelected,
}: TestListProps<T>): React.ReactElement => {
  const classes = useStyles();

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
                          isEdited={!!test.lockStatus?.locked}
                          onClick={(): void => {}}  // Cannot select a test while reordering
                        />
                      </div>
                    )}
                  </Draggable>
                ) : (
                  <TestListTest
                    key={test.name}
                    test={test}
                    isSelected={test.name === selectedTestName}
                    isEdited={!!test.lockStatus?.locked}
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

export default TestList;
