import React from 'react';
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
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const TestEditor = <T extends Test>(
  InnerComponent: React.ComponentType<InnerComponentProps<T>>,
  settingsType: FrontendSettingsType,
) =>
  class extends React.Component<{}, TestFormState<T>> {
    state: TestFormState<T> = {
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

    UNSAFE_componentWillMount(): void {
      this.fetchStateFromServer();
    }

    fetchStateFromServer = (): void => {
      fetchFrontendSettings(settingsType).then((serverData: DataFromServer<T>) => {
        const editMode = serverData.status.email === serverData.userEmail;

        this.updateWarningTimeout(editMode);

        this.setState({
          ...serverData.value,
          selectedTestIsValid: true,
          selectedTestHasBeenModified: false,
          version: serverData.version,
          lockStatus: serverData.status,
          editMode: editMode,
          modifiedTests: {},
        });
      });
    };

    // Maintains an alert if tool is left open for edit for 20 minutes
    updateWarningTimeout = (editMode: boolean): void => {
      if (editMode) {
        if (this.state.timeoutAlertId) {
          window.clearTimeout(this.state.timeoutAlertId);
        }

        const timeoutAlertId = window.setTimeout(() => {
          alert(
            "You've had this editing session open for 20 minutes - if you leave it much longer then you may lose any unsaved work!\nIf you've finished then please either save or cancel.",
          );
          this.setState({ timeoutAlertId: null });
        }, 60 * 20 * 1000);

        this.setState({ timeoutAlertId });
      } else if (this.state.timeoutAlertId) {
        window.clearTimeout(this.state.timeoutAlertId);
        this.setState({ timeoutAlertId: null });
      }
    };

    cancel = (): void => {
      requestUnlock(settingsType).then(response => {
        if (response.ok) {
          this.fetchStateFromServer();
        } else {
          alert("Error - can't request lock!");
        }
      });
    };

    onTestSave = (): void => {
      if (!this.state.tests) {
        return;
      }

      if (!this.state.selectedTestIsValid) {
        alert('Test contains errors. Please fix any errors before saving.');
        return;
      }

      this.save();
    };

    onTestDelete = (): void => {
      if (!this.state.tests) {
        return;
      }

      const updatedTests = this.state.tests.filter(
        test => test.name !== this.state.selectedTestName,
      );

      this.setState(
        {
          tests: updatedTests,
          selectedTestName: undefined,
          selectedTestIsValid: true,
          selectedTestHasBeenModified: false,
        },
        () => {
          this.save();
        },
      );
    };

    onTestArchive = (): void => {
      if (!this.state.tests) {
        return;
      }

      const selectedTest = this.state.tests.find(test => test.name === this.state.selectedTestName);

      if (!selectedTest) {
        return;
      }

      archiveTest(selectedTest, settingsType).then(result => {
        if (!result.ok) {
          alert('Failed to archive test');
        } else {
          const updatedTests = this.state.tests?.filter(
            test => test.name !== this.state.selectedTestName,
          );

          this.setState(
            {
              tests: updatedTests,
              selectedTestName: undefined,
              selectedTestIsValid: true,
              selectedTestHasBeenModified: false,
            },
            () => {
              this.save();
            },
          );
        }
      });
    };

    save = (): void => {
      const postData = {
        version: this.state.version,
        value: {
          tests: this.state.tests,
        },
      };

      saveFrontendSettings(settingsType, postData)
        .then(resp => {
          if (!resp.ok) {
            resp.text().then(msg => alert(msg));
          }
        })
        .catch(() => {
          alert('Error while saving');
        })
        .then(this.fetchStateFromServer);
    };

    onTestsChange = (updatedTests: T[], modifiedTestName?: string): void => {
      debugger;
      if (modifiedTestName && !this.state.modifiedTests[modifiedTestName]) {
        this.setState({
          modifiedTests: {
            ...this.state.modifiedTests,
            [modifiedTestName]: {
              isValid: true, // not already modified, assume it's valid until told otherwise
              isDeleted: false,
              isArchived: false,
              isNew: !(
                this.state.tests && this.state.tests.some(test => test.name === modifiedTestName)
              ),
            },
          },
        });
      }

      this.setState({
        tests: updatedTests,
      });
    };

    onTestChange = (updatedTest: T): void => {
      if (!this.state.tests) {
        return;
      }

      const updatedTests = this.state.tests?.map(test =>
        test.name === updatedTest.name ? updatedTest : test,
      );
      this.setState({ tests: updatedTests, selectedTestHasBeenModified: true });
    };

    onTestErrorStatusChange = (isValid: boolean): void => {
      this.setState({ selectedTestIsValid: isValid });
    };

    onSelectedTestName = (testName: string): void => {
      if (this.state.selectedTestHasBeenModified) {
        alert('Please either save or discard before selecting another test.');
      } else {
        this.setState({
          selectedTestName: testName,
        });
      }
    };

    requestTestsLock = (): void => {
      requestLock(settingsType).then(response =>
        response.ok ? this.fetchStateFromServer() : alert("Error - can't request lock!"),
      );
    };

    requestTestsTakeControl = (): void => {
      requestTakeControl(settingsType).then(response =>
        response.ok ? this.fetchStateFromServer() : alert("Error - can't take back control!"),
      );
    };

    render(): React.ReactNode {
      return (
        <>
          {!!this.state.tests ? (
            <>
              <InnerComponent
                tests={this.state.tests}
                modifiedTests={this.state.modifiedTests}
                selectedTestName={this.state.selectedTestName}
                onTestsChange={this.onTestsChange} // TODO: delete this
                onTestChange={this.onTestChange}
                onTestSave={this.onTestSave}
                onTestDelete={this.onTestDelete}
                onTestArchive={this.onTestArchive}
                onSelectedTestName={this.onSelectedTestName}
                onTestErrorStatusChange={this.onTestErrorStatusChange}
                requestTakeControl={this.requestTestsTakeControl}
                requestLock={this.requestTestsLock}
                lockStatus={this.state.lockStatus}
                cancel={this.cancel}
                editMode={this.state.editMode}
              />
            </>
          ) : (
            <CircularProgress />
          )}
        </>
      );
    }
  };

export default TestEditor;
