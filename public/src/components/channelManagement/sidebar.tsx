import React from 'react';
import { createStyles, Typography, withStyles, WithStyles } from '@material-ui/core';
import { Test } from './helpers/shared';
import TestList from './testList';
import TestPriorityLabelList from './testPriorityLabelList';
import NewTestButton from './newTestButton';
import BatchProcessTestButton from './batchProcessTestButton';

import TestListSidebarFilterSelector from './testListSidebarFilterSelector';
import { RegionsAndAll } from '../../utils/models';

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
  selectedTestName: string | null;
  onTestPriorityChange: (newPriority: number, oldPriority: number) => void;
  onTestSelected: (testName: string) => void;
  testNamePrefix?: string;
  createTest: (name: string, nickname: string) => void;
  isInEditMode: boolean;
  regionFilter: RegionsAndAll;
  setRegionFilter: (regionValue: RegionsAndAll) => void;
  onBatchTestDelete: (batchTestNames: string[]) => void;
  onBatchTestArchive: (batchTestNames: string[]) => void;
}

function Sidebar<T extends Test>({
  classes,
  tests,
  isInEditMode,
  selectedTestName,
  onTestPriorityChange,
  onTestSelected,
  testNamePrefix,
  createTest,
  regionFilter,
  setRegionFilter,
  onBatchTestDelete,
  onBatchTestArchive,
}: SidebarProps<T> & WithStyles<typeof styles>): React.ReactElement<SidebarProps<T>> {
  const filterTests = function(testsToFilter: Test[]): Test[] {
    if (isInEditMode || 'ALL' === regionFilter) {
      return testsToFilter;
    }
    return testsToFilter.filter(t => t.locations.indexOf(regionFilter) >= 0);
  };

  return (
    <div className={classes.root}>
      {isInEditMode ? (
        <>
          <NewTestButton
            existingNames={tests.map(t => t.name)}
            existingNicknames={tests.map(t => t.nickname || '')}
            testNamePrefix={testNamePrefix}
            createTest={createTest}
          />
          <BatchProcessTestButton
            // filter out live tests and any test currently being edited
            tests={tests}
            draftTests={tests.filter(t => (!t.isOn && t.name !== selectedTestName ? true : false))}
            onBatchTestDelete={onBatchTestDelete}
            onBatchTestArchive={onBatchTestArchive}
          />
          <Typography className={classes.header}>EDITING: tests in priority order</Typography>
        </>
      ) : (
        <TestListSidebarFilterSelector
          regionFilter={regionFilter}
          handleRegionFilterChange={setRegionFilter}
        ></TestListSidebarFilterSelector>
      )}
      <div className={classes.listsContainer}>
        <div className={classes.priorityLabelListContainer}>
          <TestPriorityLabelList numTests={tests.length} />
        </div>
        <TestList
          tests={filterTests(tests)}
          isInEditMode={isInEditMode}
          selectedTestName={selectedTestName}
          onTestPriorityChange={onTestPriorityChange}
          onTestSelected={onTestSelected}
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
