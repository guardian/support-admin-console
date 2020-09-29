import React from 'react';
import { createStyles, Typography, withStyles, WithStyles } from '@material-ui/core';
import { ModifiedTests } from './helpers/shared';
import { Test } from './helpers/shared';
import TestList from './testList';
import TestPriorityLabelList from './testPriorityLabelList';
import NewTestButton from './newTestButton';

const styles = createStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: '32px',
  },
  header: {
    marginTop: '32px',
    fontSize: '14px',
  },
  listsContainer: {
    position: 'relative',
    display: 'flex',
    marginTop: '8px',
  },
  priorityLabelListContainer: {
    position: 'absolute',
    left: '-32px',
  },
});

interface SidebarProps<T extends Test> {
  tests: T[];
  modifiedTests: ModifiedTests;
  selectedTestName?: string;
  onUpdate: (tests: T[], modifiedTestName?: string) => void;
  onSelectedTestName: (testName: string) => void;
  createTest: (name: string, nickname: string) => void;
  isInEditMode: boolean;
}

function Sidebar<T extends Test>({
  classes,
  tests,
  isInEditMode,
  selectedTestName,
  onUpdate,
  onSelectedTestName,
  createTest,
}: SidebarProps<T> & WithStyles<typeof styles>): React.ReactElement<SidebarProps<T>> {
  return (
    <div className={classes.root}>
      {isInEditMode && (
        <NewTestButton
          existingNames={tests.map(t => t.name)}
          existingNicknames={tests.map(t => t.nickname || '')}
          createTest={createTest}
        />
      )}
      <Typography className={classes.header}>Tests in priority order</Typography>
      <div className={classes.listsContainer}>
        <div className={classes.priorityLabelListContainer}>
          <TestPriorityLabelList numTests={tests.length} />
        </div>
        <TestList
          tests={tests}
          isInEditMode={isInEditMode}
          selectedTestName={selectedTestName}
          onUpdate={onUpdate}
          onTestSelected={onSelectedTestName}
        />
      </div>
    </div>
  );
}

// Hack to work around material UI breaking type checking when class has type parameters - https://stackoverflow.com/q/52567697
export default function WrappedTestListContainer<T extends Test>(
  props: SidebarProps<T>,
): React.ReactElement<SidebarProps<T>> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const wrapper = withStyles(styles)(Sidebar) as any;

  return React.createElement(wrapper, props);
}
