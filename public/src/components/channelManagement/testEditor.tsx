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
import { LockStatus, ModifiedTests, Test } from './helpers/shared';

export const updateTest = <T extends Test>(currentTests: T[], updatedTest: T): T[] =>
  currentTests.map(test => (test.name === updatedTest.name ? updatedTest : test));

// The inner component's props must extend this type
export interface InnerComponentProps<T extends Test> {
  tests: T[];
  modifiedTests: ModifiedTests;
  selectedTestName?: string;
  onTestsChange: (updatedTests: T[], modifiedTestName?: string) => void;
  onTestChange: (updatedTest: T) => void;
  onTestSave: () => void;
  onTestDelete: () => void;
  onTestArchive: () => void;
  onSelectedTestName: (testName: string) => void;
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

interface TestFormState<T extends Test> {
  tests?: T[];
  version: string | null;
  selectedTestName?: string;
  selectedTestHasBeenModified: boolean;
  selectedTestIsValid: boolean;
  editMode: boolean;
  lockStatus: LockStatus;
  modifiedTests: ModifiedTests;
  timeoutAlertId: number | null; // A timeout for warning about being open for edit for too long
}

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
    const [selectedTestName, setSelectedTestName] = useState<string>('');
    const [selectedTestIsValid, setSelectedTestIsValid] = useState<boolean>(true);
    const [selectedTestHasBeenModified, setSelectedTestHasBeenModified] = useState<boolean>(true);
    const [lockStatus, setLockStatus] = useState<LockStatus>({ locked: false });

    const state: TestFormState<T> = {
      tests: undefined,
      version: null,
      selectedTestName: undefined,
      selectedTestHasBeenModified: false,
      selectedTestIsValid: true,
      editMode: false,
      lockStatus: { locked: false },
      modifiedTests: {},
      timeoutAlertId: null,
    };

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

    const onTestsChange = (updatedTests: T[], modifiedTestName?: string): void => {
      if (modifiedTestName && !state.modifiedTests[modifiedTestName]) {
        // setState({
        //   modifiedTests: {
        //     ...state.modifiedTests,
        //     [modifiedTestName]: {
        //       isValid: true, // not already modified, assume it's valid until told otherwise
        //       isDeleted: false,
        //       isArchived: false,
        //       isNew: !(state.tests && state.tests.some(test => test.name === modifiedTestName)),
        //     },
        //   },
        // });
      }
      // setState({
      //   tests: updatedTests,
      // });
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
        setSelectedTestName('');
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
            setSelectedTestName('');
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
              modifiedTests={state.modifiedTests}
              selectedTestName={selectedTestName}
              onTestsChange={onTestsChange} // TODO: delete this
              onTestChange={onTestChange}
              onTestSave={onTestSave}
              onTestDelete={onTestDelete}
              onTestArchive={onTestArchive}
              onSelectedTestName={onSelectedTestName}
              onTestErrorStatusChange={onTestErrorStatusChange}
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
