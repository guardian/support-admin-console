import React, { useState, useEffect } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import {
  fetchFrontendSettings,
  FrontendSettingsType,
  saveFrontendSettings,
  requestLock,
  requestTakeControl,
  requestUnlock,
  archiveTest,
} from '../../utils/requests';
import { LockStatus, Test } from './helpers/shared';

// The inner component's props must extend this type
export interface InnerComponentProps<T extends Test> {
  tests: T[];
  selectedTestName: string | null;
  selectedTestHasBeenModified: boolean;
  onTestChange: (updatedTest: T) => void;
  onTestSave: () => void;
  onTestDelete: () => void;
  onTestArchive: () => void;
  onTestCreate: (newTest: T) => void;
  onTestPriorityChange: (newPriority: number, oldPriority: number) => void;
  onTestSelected: (testName: string) => void;
  onTestErrorStatusChange: (isValid: boolean) => void;
  cancel: () => void;
  requestTakeControl: () => void;
  requestLock: () => void;
  lockStatus: LockStatus;
  editMode: boolean;
}

interface DataFromServer<T extends Test> {
  value: {
    tests: T[];
  };
  version: string;
  status: LockStatus;
  userEmail: string;
}

const useEditModeAlertTimer = (editMode: boolean): void => {
  const [timeoutId, setTimeoutId] = useState<number | undefined>(undefined);

  const clearTimeout = (): void => {
    window.clearTimeout(timeoutId);
    setTimeoutId(undefined);
  };

  useEffect(() => {
    if (editMode) {
      if (timeoutId) {
        clearTimeout();
      }
      const newTimeoutId = window.setTimeout(() => {
        alert(
          "You've had this editing session open for 20 minutes - if you leave it much longer then you may lose any unsaved work!\nIf you've finished then please either save or cancel.",
        );
        clearTimeout();
      }, 60 * 20 * 1000);

      setTimeoutId(newTimeoutId);
    } else if (timeoutId) {
      clearTimeout();
    }
  }, [editMode]);
};

/**
 * A stateful higher-order component for fetching/saving test data.
 * Takes care of locks
 */
const TestEditor = <T extends Test>(
  InnerComponent: React.ComponentType<InnerComponentProps<T>>,
  settingsType: FrontendSettingsType,
): React.FC => {
  const WrappedInnerComponent: React.FC = () => {
    const [tests, setTests] = useState<T[] | null>(null);
    const [version, setVersion] = useState<string | null>(null);
    const [editMode, setEditMode] = useState<boolean>(false);
    const [selectedTestName, setSelectedTestName] = useState<string | null>(null);
    const [selectedTestIsValid, setSelectedTestIsValid] = useState<boolean>(true);
    const [selectedTestHasBeenModified, setSelectedTestHasBeenModified] = useState<boolean>(true);
    const [lockStatus, setLockStatus] = useState<LockStatus>({ locked: false });

    useEditModeAlertTimer(editMode);

    const fetchStateFromServer = (): void => {
      fetchFrontendSettings(settingsType).then((serverData: DataFromServer<T>) => {
        const editMode = serverData.status.email === serverData.userEmail;

        setTests(serverData.value.tests);
        setVersion(serverData.version);
        setEditMode(editMode);
        setLockStatus(serverData.status);
        setSelectedTestIsValid(true);
        setSelectedTestHasBeenModified(false);
      });
    };

    useEffect(() => {
      fetchStateFromServer();
    }, []);

    const save = (updatedTests: T[]): Promise<void> => {
      const postData = {
        version: version,
        value: {
          tests: updatedTests,
        },
      };

      return saveFrontendSettings(settingsType, postData)
        .then(resp => {
          if (!resp.ok) {
            resp.text().then(msg => alert(msg));
          }
        })
        .catch(() => {
          alert('Error while saving');
        })
        .then(fetchStateFromServer);
    };

    const cancel = (): void => {
      requestUnlock(settingsType).then(response => {
        if (response.ok) {
          fetchStateFromServer();
        } else {
          alert("Error - can't request lock!");
        }
      });
    };

    const onTestSave = (): void => {
      if (!tests) {
        return;
      }

      if (!selectedTestIsValid) {
        alert('Test contains errors. Please fix any errors before saving.');
        return;
      }

      save(tests);
    };

    const onTestDelete = (): void => {
      if (!tests) {
        return;
      }

      const updatedTests = tests.filter(test => test.name !== selectedTestName);

      save(updatedTests).then(() => {
        setSelectedTestName(null);
        setSelectedTestIsValid(true);
        setSelectedTestHasBeenModified(false);
      });
    };

    const onTestArchive = (): void => {
      if (!tests) {
        return;
      }

      const selectedTest = tests.find(test => test.name === selectedTestName);

      if (!selectedTest) {
        return;
      }

      archiveTest(selectedTest, settingsType).then(result => {
        if (!result.ok) {
          alert('Failed to archive test');
        } else {
          const updatedTests = tests.filter(test => test.name !== selectedTestName);

          save(updatedTests).then(() => {
            setSelectedTestName(null);
            setSelectedTestIsValid(true);
            setSelectedTestHasBeenModified(false);
          });
        }
      });
    };

    const onTestChange = (updatedTest: T): void => {
      if (!tests) {
        return;
      }

      const updatedTests = tests.map(test => (test.name === updatedTest.name ? updatedTest : test));

      setTests(updatedTests);
      setSelectedTestHasBeenModified(true);
    };

    const onTestErrorStatusChange = (isValid: boolean): void => {
      setSelectedTestIsValid(isValid);
    };

    const onTestCreate = (newTest: T): void => {
      const updatedTests = tests ? [...tests, newTest] : [newTest];

      setTests(updatedTests);
      setSelectedTestName(newTest.name);
      setSelectedTestHasBeenModified(false);
      setSelectedTestIsValid(true);
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

    const onSelectedTestName = (testName: string): void => {
      if (selectedTestHasBeenModified) {
        alert('Please either save or discard before selecting another test.');
      } else {
        setSelectedTestName(testName);
      }
    };

    const requestTestsLock = (): void => {
      requestLock(settingsType).then(response =>
        response.ok ? fetchStateFromServer() : alert("Error - can't request lock!"),
      );
    };

    const requestTestsTakeControl = (): void => {
      requestTakeControl(settingsType).then(response =>
        response.ok ? fetchStateFromServer() : alert("Error - can't take back control!"),
      );
    };

    return (
      <>
        {!!tests ? (
          <>
            <InnerComponent
              tests={tests}
              selectedTestName={selectedTestName}
              selectedTestHasBeenModified={selectedTestHasBeenModified}
              onTestChange={onTestChange}
              onTestErrorStatusChange={onTestErrorStatusChange}
              onTestPriorityChange={onTestPriorityChange}
              onTestSave={onTestSave}
              onTestDelete={onTestDelete}
              onTestArchive={onTestArchive}
              onTestCreate={onTestCreate}
              onTestSelected={onSelectedTestName}
              requestTakeControl={requestTestsTakeControl}
              requestLock={requestTestsLock}
              lockStatus={lockStatus}
              cancel={cancel}
              editMode={editMode}
            />
          </>
        ) : (
          <CircularProgress />
        )}
      </>
    );
  };

  return WrappedInnerComponent;
};

export default TestEditor;
