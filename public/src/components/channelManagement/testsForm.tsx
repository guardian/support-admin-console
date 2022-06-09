import React, {useEffect, useState} from 'react';
import {makeStyles, Theme, Typography} from '@material-ui/core';
import Sidebar from './newSidebar';
import {LockStatus, Test} from './helpers/shared';
import {
  fetchFrontendSettings, fetchTest,
  FrontendSettingsType, lockTest,
  requestLock,
  requestTakeControl, updateTest,
  saveTestListOrder, unlockTest, archiveTests, createTest
} from '../../utils/requests';

const useStyles = makeStyles(({ spacing, typography }: Theme) => ({
  viewTextContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '-50px',
  },
  viewText: {
    fontSize: typography.pxToRem(16),
  },
  body: {
    display: 'flex',
    overflow: 'hidden',
    flexGrow: 1,
    width: '100%',
    height: '100%',
  },
  leftCol: {
    height: '100%',
    flexShrink: 0,
    overflowY: 'auto',
    background: 'white',
    paddingTop: spacing(6),
    paddingLeft: spacing(6),
    paddingRight: spacing(6),
  },
  rightCol: {
    // overflowY: 'auto',
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'center',
  },
}));

interface DataFromServer<T> {
  value: { tests: T[] };
  userEmail: string;
  status: LockStatus;
}

export interface TestEditorProps<T extends Test> {
  test: T;
  userHasTestLocked: boolean;
  onTestChange: (test: T) => void;
  onTestLock: (testName: string, force: boolean) => void;
  onTestUnlock: (testName: string) => void;
  onTestSave: (testName: string) => void;
  onTestArchive: (testName: string) => void;
  onTestCopy: (oldName: string, newName: string, newNickname: string) => void;
  existingNames: string[];
  existingNicknames: string[];
}

/**
 * NOTES
 *
 * - if we do not re-fetch the data when a user click lock, they may be editing stale data.
 * - re-fetching all data would clear any unsaved data
 *
 * Solution:
 * - TestsForm has top-level tests state
 * - HeaderTestEditor receives a Test
 *   - POSTs to /test/update
 *   - updates go to top-level state (so that user can move between tests without losing changes)
 *   - clicking "edit test" fetches state of that test again, in case it's stale, and updates it in the top-level state
 * - Sidebar receives list of tests
 *   - POSTs to /reorder
 *   - updates go to top-level state
 *   - clicking "edit test" and "save test" trigger re-fetch of tests list?
 *
 *
 *
 * - TestsForm (HOC)
 *   - Sidebar
 *   - HeaderTestEditor
 */

export const TestsForm = <T extends Test>(
  TestEditor: React.ComponentType<TestEditorProps<T>>,
  settingsType: FrontendSettingsType,
  createDefaultTest: (name: string, nickname: string) => T,
): React.FC => {
  return () => {
    const classes = useStyles();
    const [tests, setTests] = useState<T[]>([]);
    const [selectedTestName, setSelectedTestName] = useState<string | null>(null);
    const [testListLockStatus, setTestListLockStatus] = useState<LockStatus>({ locked: false });
    const [email, setEmail] = useState<string>('');

    const fetchTests = (): void => {
      fetchFrontendSettings(settingsType).then((serverData: DataFromServer<T>) => {
        setEmail(serverData.userEmail);
        setTests(serverData.value.tests);
        setTestListLockStatus(serverData.status);
      });
    }

    useEffect(() => {
      fetchTests();
    }, []);

    const onTestChange = (updatedTest: T): void => {
      if (!tests) {
        return;
      }

      const updatedTests = tests.map(test => (test.name === updatedTest.name ? updatedTest : test));

      setTests(updatedTests);
    };

    const refreshTest = (testName: string): Promise<void> =>
      fetchTest(settingsType, testName)
        .then((test: T) => onTestChange(test))

    const onTestLock = (testName: string, force: boolean): void => {
      lockTest(settingsType, testName, force)
        .then(() => refreshTest(testName))
        .catch(error => {
          alert(`Error while locking test: ${error}`)
        })
    }
    const onTestUnlock = (testName: string): void => {
      unlockTest(settingsType, testName)
        .then(() => refreshTest(testName))
        .catch(error => {
          alert(`Error while unlocking test: ${error}`)
        })
    }

    const onTestSave = (testName: string): void => {
      const test = tests.find(test => test.name === testName);
      if (test) {
        if (test.isNew) {
          const unlocked = {
            ...test,
            lockStatus: undefined,
          };
          createTest(settingsType, unlocked)
            .then(() => refreshTest(testName))
            .catch(error => {
              alert(`Error while creating new test: ${error}`)
            })
        } else {
          updateTest(settingsType, test)
            .then(() => refreshTest(testName))
            .catch(error => {
              alert(`Error while saving test: ${error}`)
            })
        }
      }
    }

    const onTestArchive = (testName: string): void => {
      archiveTests(settingsType, [testName])
        .then(() => setTests(tests.filter(test => test.name !== testName)))
        .catch(error => {
          alert(`Error while archiving test: ${error}`)
        })
    }

    const onTestCreate = (name: string, nickname: string): void => {
      const newTest: T = {
        ...createDefaultTest(name, nickname),
        isNew: true,
        lockStatus: {
          locked: true,
          email: email,
          timestamp: (new Date).toISOString(),
        },
      };
      setTests([...tests, newTest]);
      setSelectedTestName(name);
    };

    const onTestCopy = (oldName: string, newName: string, newNickname: string): void => {
      const oldTest = tests.find(test => test.name === oldName);
      if (oldTest) {
        const newTest: T = {
          ...oldTest,
          name: newName,
          nickname: newNickname,
          isOn: false,
          status: 'Draft',
          lockStatus: {
            locked: true,
            email: email,
            timestamp: (new Date).toISOString(),
          },
          isNew: true,
        };
        setTests([...tests, newTest]);
        setSelectedTestName(newName);
      }
    };

    const onTestPriorityChange = (newPriority: number, oldPriority: number): void => {
      if (!tests) {
        return;
      }

      const updatedTests = [...tests];
      const movedTest = { ...tests[oldPriority] };
      updatedTests.splice(oldPriority, 1);
      updatedTests.splice(newPriority, 0, movedTest);

      setTests(updatedTests);
    };

    const onTestListOrderSave = (): void => {
      if (tests) {
        saveTestListOrder(settingsType, tests.map(test => test.name))
          .then(resp => {
            // setSaving(false);
            if (!resp.ok) {
              resp.text().then(msg => alert(msg));
            }
          })
          .catch(() => {
            alert('Error while saving');
          })
          .then(_ => fetchTests());
      }
    }

    const requestTestListLock = (): void => {
      requestLock(settingsType).then(response =>
        response.ok ? fetchTests() : alert("Error - can't request lock!"),
      );
    };

    const requestTestListTakeControl = (): void => {
      requestTakeControl(settingsType).then(response =>
        response.ok ? fetchTests() : alert("Error - can't take back control!"),
      );
    };

    const selectedTest = tests.find(test => test.name === selectedTestName)

    return (
      <div className={classes.body}>
        <div className={classes.leftCol}>
          <Sidebar<T>
            tests={tests}
            selectedTestName={selectedTestName}
            onTestPriorityChange={onTestPriorityChange}
            onTestSelected={setSelectedTestName}
            createTest={onTestCreate}
            // onBatchTestDelete={onBatchTestDelete}
            // onBatchTestArchive={onBatchTestArchive}
            onTestListOrderSave={onTestListOrderSave}
            requestTestListLock={requestTestListLock}
            requestTestListTakeControl={requestTestListTakeControl}
            testListLockStatus={testListLockStatus}
            userHasTestListLocked={testListLockStatus.email === email}
          />
        </div>

        <div className={classes.rightCol}>
          {selectedTest ? (
            <TestEditor
              test={selectedTest}
              userHasTestLocked={selectedTest.lockStatus?.email === email}
              existingNames={tests.map(test => test.name)}
              existingNicknames={tests.map(test => test.nickname || '')}
              onTestChange={onTestChange}
              onTestLock={onTestLock}
              onTestUnlock={onTestUnlock}
              onTestSave={onTestSave}
              onTestArchive={onTestArchive}
              onTestCopy={onTestCopy}
            />
          ) : (
            <div className={classes.viewTextContainer}>
              <Typography className={classes.viewText}>
                Select an existing test from the menu,
              </Typography>
              <Typography className={classes.viewText}>or create a new one</Typography>
            </div>
          )}
        </div>
      </div>
    );
  }
}
