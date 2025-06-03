import React, { useEffect, useState } from 'react';
import { Theme, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import Sidebar from './sidebar';
import { LockStatus, Status, Test } from './helpers/shared';
import {
  fetchFrontendSettings,
  fetchTest,
  FrontendSettingsType,
  lockTest,
  requestTestListLock,
  requestTestListTakeControl,
  updateTest,
  saveTestListOrder,
  unlockTest,
  createTest,
  updateStatuses,
} from '../../utils/requests';
import { useParams } from 'react-router-dom';
import { addMethodologyToTestName } from './helpers/methodology';
import { hasPermission } from '../../utils/permissions';

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
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'center',
  },
}));

interface ChannelTestsResponse<T> {
  tests: T[];
  userEmail: string;
  status: LockStatus;
}

export interface TestEditorProps<T extends Test> {
  test: T;
  userHasTestLocked: boolean;
  userHasTestListLocked: boolean;
  onTestChange: (test: T) => void;
  onTestLock: (testName: string, force: boolean) => void;
  onTestUnlock: (testName: string) => void;
  onTestSave: (testName: string) => void;
  onTestArchive: (testName: string) => void;
  onTestCopy: (oldName: string, newName: string, newNickname: string) => void;
  onTestAudit: (testName: string, channel?: string) => void;
  onStatusChange: (status: Status) => void;
  existingNames: string[];
  existingNicknames: string[];
  settingsType: FrontendSettingsType;
  allowEditing: boolean;
}

/**
 * Higher-order component for the channel tests forms.
 * Renders the Sidebar and the given `TestEditor` (which is custom for each channel).
 * Holds the top-level state and takes care of all interactions with the backend.
 */
export const TestsForm = <T extends Test>(
  TestEditor: React.ComponentType<TestEditorProps<T>>,
  settingsType: FrontendSettingsType,
  createDefaultTest: (name: string, nickname: string) => T,
  testNamePrefix?: string,
): React.FC => {
  return () => {
    const classes = useStyles();
    const { testName } = useParams<{ testName?: string }>();
    const [tests, setTests] = useState<T[]>([]);
    const [selectedTestName, setSelectedTestName] = useState<string | null>(testName || null);
    const [testListLockStatus, setTestListLockStatus] = useState<LockStatus>({ locked: false });
    const [email, setEmail] = useState<string>('');
    const [savingTestList, setSavingTestList] = useState<boolean>(false);

    const fetchTests = (): void => {
      fetchFrontendSettings(settingsType).then((serverData: ChannelTestsResponse<T>) => {
        setEmail(serverData.userEmail);
        setTests(serverData.tests);
        setTestListLockStatus(serverData.status);
      });
    };

    useEffect(() => {
      fetchTests();
    }, []);

    const onTestChange = (updatedTest: T): void => {
      const updatedTests = tests.map(test => (test.name === updatedTest.name ? updatedTest : test));

      setTests(updatedTests);
    };

    const refreshTest = (testName: string): Promise<void> =>
      fetchTest<T>(settingsType, testName).then((test: T) => onTestChange(test));

    const onTestLock = (testName: string, force: boolean): void => {
      lockTest(settingsType, testName, force)
        .then(() => refreshTest(testName))
        .catch(error => {
          alert(`Error while locking test: ${error}`);
          refreshTest(testName);
        });
    };
    const onTestUnlock = (testName: string): void => {
      const test = tests.find(test => test.name === testName);
      if (test && test.isNew) {
        // if it's a new test then just drop from the in-memory list
        setTests(tests.filter(test => test.name !== testName));
      } else {
        unlockTest(settingsType, testName)
          .then(() => refreshTest(testName))
          .catch(error => {
            alert(`Error while unlocking test: ${error}`);
          });
      }
    };

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
              alert(`Error while creating new test: ${error}`);
            });
        } else {
          updateTest(settingsType, test)
            .then(() => refreshTest(testName))
            .catch(error => {
              alert(`Error while saving test: ${error}`);
            });
        }
      }
    };

    const onTestsArchive = (testNames: string[]): void => {
      updateStatuses(settingsType, testNames, 'Archived')
        .then(() => fetchTests())
        .catch(error => {
          alert(`Error while archiving test: ${error}`);
        });
    };

    const onTestArchive = (testName: string): void => {
      updateStatuses(settingsType, [testName], 'Archived')
        .then(() => setTests(tests.filter(test => test.name !== testName)))
        .catch(error => {
          alert(`Error while archiving test: ${error}`);
        });
    };

    const onTestAudit = (testName: string, channel?: string): void => {
      const redirectPathname = window.location.pathname.replace(
        window.location.pathname,
        `/audit-tests/${channel}/${testName}`,
      );
      window.location.href = redirectPathname; // Redirect to the audit page
    };

    const onStatusChange = (status: Status, testName: string): void => {
      updateStatuses(settingsType, [testName], status)
        .then(() => refreshTest(testName))
        .catch(error => {
          alert(`Error while setting test status to ${status}: ${error}`);
        });
    };

    const onTestCreate = (name: string, nickname: string, campaignName?: string): void => {
      const newTest: T = {
        ...createDefaultTest(name, nickname),
        isNew: true,
        // Set lockStatus client-side, so that the StickyTopBar knows what to render
        lockStatus: {
          locked: true,
          email: email,
          timestamp: new Date().toISOString(),
        },
        campaignName,
      };
      setTests([...tests, newTest]);
      setSelectedTestName(name);
    };

    const onTestCopy = (
      oldName: string,
      newName: string,
      newNickname: string,
      campaignName?: string,
    ): void => {
      const oldTest = tests.find(test => test.name === oldName);
      if (oldTest) {
        // Replace any testNames on the methodologies
        const methodologies = oldTest.methodologies.map(methodology => ({
          ...methodology,
          testName: methodology.testName
            ? addMethodologyToTestName(newName, methodology)
            : undefined,
        }));

        const newTest: T = {
          ...oldTest,
          name: newName,
          nickname: newNickname,
          status: 'Draft',
          // Set lockStatus client-side, so that the StickyTopBar knows what to render
          lockStatus: {
            locked: true,
            email: email,
            timestamp: new Date().toISOString(),
          },
          isNew: true,
          campaignName,
          methodologies,
        };
        setTests([...tests, newTest]);
        setSelectedTestName(newName);
      }
    };

    const onTestPriorityChange = (newPriority: number, oldPriority: number): void => {
      const updatedTests = [...tests];
      const movedTest = { ...tests[oldPriority] };
      updatedTests.splice(oldPriority, 1);
      updatedTests.splice(newPriority, 0, movedTest);

      setTests(updatedTests);
    };

    const onTestListOrderSave = (): void => {
      setSavingTestList(true);
      saveTestListOrder(
        settingsType,
        tests.map(test => test.name),
      )
        .then(() => fetchTests())
        .then(() => setSavingTestList(false))
        .catch(error => {
          alert(`Error while saving: ${error}`);
        });
    };

    const onTestListLock = (force: boolean): void => {
      // For simplicity, do not allow reordering if there are any unsaved *new* tests
      const newTest = tests.find(test => test.isNew);
      if (newTest) {
        alert(`Please save new test '${newTest.name}' before reordering`);
      } else {
        const lockAction = force ? requestTestListTakeControl : requestTestListLock;
        lockAction(settingsType)
          .then(() => fetchTests())
          .catch(error => {
            alert(`Error - can't request lock! - ${error}`);
          });
      }
    };

    const selectedTest = tests.find(test => test.name === selectedTestName);

    const userHasTestListLocked = testListLockStatus.email === email;

    // Currently only the Landing Page tool has permissioning
    const allowEditing =
      settingsType === FrontendSettingsType.supportLandingPageTests
        ? hasPermission(FrontendSettingsType.supportLandingPageTests, 'Write')
        : true;

    return (
      <div className={classes.body}>
        <div className={classes.leftCol}>
          <Sidebar<T>
            tests={tests}
            selectedTestName={selectedTestName}
            testNamePrefix={testNamePrefix}
            onTestPriorityChange={onTestPriorityChange}
            onTestSelected={setSelectedTestName}
            createTest={onTestCreate}
            onBatchTestArchive={onTestsArchive}
            onTestListOrderSave={onTestListOrderSave}
            onTestListLock={onTestListLock}
            testListLockStatus={testListLockStatus}
            userHasTestListLocked={testListLockStatus.email === email}
            savingTestList={savingTestList}
            allowEditing={allowEditing}
          />
        </div>

        <div className={classes.rightCol}>
          {selectedTest ? (
            <TestEditor
              test={selectedTest}
              userHasTestLocked={selectedTest.lockStatus?.email === email}
              userHasTestListLocked={userHasTestListLocked}
              existingNames={tests.map(test => test.name)}
              existingNicknames={tests.map(test => test.nickname || '')}
              onTestChange={onTestChange}
              onTestLock={onTestLock}
              onTestUnlock={onTestUnlock}
              onTestSave={onTestSave}
              onTestArchive={onTestArchive}
              onTestCopy={onTestCopy}
              onTestAudit={onTestAudit}
              onStatusChange={status => onStatusChange(status, selectedTest.name)}
              settingsType={settingsType}
              allowEditing={allowEditing}
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
  };
};
