import React, {useState} from 'react';
import {Button, makeStyles, Typography} from '@material-ui/core';
import {LockStatus, Test} from './helpers/shared';
import TestList from './testList';
import TestPriorityLabelList from './testPriorityLabelList';
import NewTestButton from './newTestButton';
import BatchProcessTestButton from './batchProcessTestButton';

import TestListSidebarFilterSelector from './testListSidebarFilterSelector';
import { RegionsAndAll } from '../../utils/models';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';

const useStyles = makeStyles(({palette}) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: '32px',
  },
  header: {
    marginTop: '5px',
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
  buttonsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginBottom: '10px',
  },
  reorderListButton: {
    height: '48px',
    justifyContent: 'start',
  },
  buttonText: {
    fontSize: '12px',
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
}));

interface SidebarProps<T extends Test> {
  tests: T[];
  selectedTestName: string | null;
  // editedTestName: string | null;
  onTestPriorityChange: (newPriority: number, oldPriority: number) => void;
  onTestSelected: (testName: string) => void;
  testNamePrefix?: string;
  createTest: (name: string, nickname: string) => void;
  // isInEditMode: boolean;
  // regionFilter: RegionsAndAll;
  // setRegionFilter: (regionValue: RegionsAndAll) => void;
  // onBatchTestDelete: (batchTestNames: string[]) => void;
  // onBatchTestArchive: (batchTestNames: string[]) => void;
  onTestListOrderSave: () => void;
  requestTestListLock: () => void;
  requestTestListTakeControl: () => void;
  testListLockStatus: LockStatus;
  userHasTestListLocked: boolean;
}

function Sidebar<T extends Test>({
  tests,
  // isInEditMode,
  selectedTestName,
  // editedTestName,
  onTestPriorityChange,
  onTestSelected,
  testNamePrefix,
  createTest,
  // regionFilter,
  // setRegionFilter,
  // onBatchTestDelete,
  // onBatchTestArchive,
  onTestListOrderSave,
  requestTestListLock,
  requestTestListTakeControl,
  testListLockStatus,
  userHasTestListLocked,
}: SidebarProps<T>): React.ReactElement<SidebarProps<T>> {
  const classes = useStyles();
  const [regionFilter, setRegionFilter] = useState<RegionsAndAll>('ALL');

  const filterTests = function(testsToFilter: Test[]): Test[] {
    if (userHasTestListLocked || 'ALL' === regionFilter) {
      return testsToFilter;
    }
    return testsToFilter.filter(t => t.locations.indexOf(regionFilter) >= 0);
  };

  return (
    <div className={classes.root}>
      <div className={classes.buttonsContainer}>
        <NewTestButton
          existingNames={tests.map(t => t.name)}
          existingNicknames={tests.map(t => t.nickname || '')}
          testNamePrefix={testNamePrefix}
          createTest={createTest}
        />

        {/*<BatchProcessTestButton*/}
        {/*  // filter out live tests and any test currently being edited*/}
        {/*  draftTests={tests.filter(t => (!t.isOn && t.name !== selectedTestName ? true : false))}*/}
        {/*  onBatchTestDelete={onBatchTestDelete}*/}
        {/*  onBatchTestArchive={onBatchTestArchive}*/}
        {/*/>*/}

        { testListLockStatus.locked && userHasTestListLocked &&
        <>
          <Button
            variant="outlined"
            size="medium"
            startIcon={<SaveIcon />}
            className={classes.reorderListButton}
            onClick={onTestListOrderSave}
          >
            <Typography className={classes.buttonText}>Save order</Typography>
          </Button>
          <Typography className={classes.header}>EDITING: tests in priority order</Typography>
        </>
        }

        { testListLockStatus.locked && !userHasTestListLocked &&
        <>
          <Button
            variant="outlined"
            size="medium"
            startIcon={<EditIcon/>}
            className={classes.reorderListButton}
            onClick={requestTestListTakeControl}
          >
            <Typography className={classes.buttonText}>Take control</Typography>
          </Button>
          <Typography className={classes.header}>{testListLockStatus.email} has the test list locked</Typography>
        </>
        }

        { !testListLockStatus.locked &&
        <Button
          variant="outlined"
          size="medium"
          startIcon={<EditIcon/>}
          className={classes.reorderListButton}
          onClick={requestTestListLock}
        >
          <Typography className={classes.buttonText}>Reorder test list</Typography>
        </Button>
        }

        {
          !userHasTestListLocked &&
          <TestListSidebarFilterSelector
            regionFilter={regionFilter}
            handleRegionFilterChange={setRegionFilter}
          />
        }
      </div>

      <div className={classes.listsContainer}>
        <div className={classes.priorityLabelListContainer}>
          <TestPriorityLabelList numTests={tests.length} />
        </div>
        <TestList
          tests={filterTests(tests)}
          isInEditMode={userHasTestListLocked}
          selectedTestName={selectedTestName}
          editedTestName={null} //TODO
          onTestPriorityChange={onTestPriorityChange}
          onTestSelected={onTestSelected}
        />
      </div>
    </div>
  );
}

export default Sidebar;
