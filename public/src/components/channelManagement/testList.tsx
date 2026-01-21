import React from 'react';
import { List } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { closestCenter, DragEndEvent, DndContext, useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { SortableContext, useSortable } from '@dnd-kit/sortable';

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

interface TestListItemProps<T extends Test> {
  test: T;
  isSelected: boolean;
  isInEditMode: boolean;
  onTestSelected: (testName: string) => void;
}

const TestListItem = <T extends Test>({
  test,
  isSelected,
  isInEditMode,
  onTestSelected,
}: TestListItemProps<T>) => {
  const { setNodeRef, attributes, listeners, transform, transition } = useSortable({
    id: test.name,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  return isInEditMode ? (
    <div key={test.name} ref={setNodeRef} {...attributes} {...listeners} style={style}>
      <TestListTest
        test={test}
        isSelected={isSelected}
        isEdited={!!test.lockStatus?.locked}
        onClick={(): void => onTestSelected(test.name)}
      />
    </div>
  ) : (
    <TestListTest
      key={test.name}
      test={test}
      isSelected={isSelected}
      isEdited={!!test.lockStatus?.locked}
      onClick={(): void => onTestSelected(test.name)}
    />
  );
};

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
  const { setNodeRef: setDroppableNodeRef } = useDroppable({
    id: 'droppable',
  });

  const onDragEnd = (event: DragEndEvent): void => {
    // active is the item being dragged, over is the other item we're dragging onto
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = tests.findIndex((test) => test.name === active.id);
      const newIndex = tests.findIndex((test) => test.name === over.id);
      onTestPriorityChange(newIndex, oldIndex);
    }
  };

  return (
    <div className={classes.container}>
      <DndContext onDragEnd={onDragEnd} collisionDetection={closestCenter}>
        <SortableContext items={tests.map((test) => test.name)}>
          <div ref={setDroppableNodeRef}>
            <List className={classes.list}>
              {tests.map((test) => {
                return (
                  <TestListItem
                    key={`TestListItem-${test.name}`}
                    test={test}
                    isSelected={selectedTestName === test.name}
                    isInEditMode={isInEditMode}
                    onTestSelected={onTestSelected}
                  />
                );
              })}
            </List>
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default TestList;
