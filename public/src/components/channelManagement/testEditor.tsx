import React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import {
  fetchFrontendSettings,
  FrontendSettingsType,
  saveFrontendSettings,
  requestLock,
  requestTakeControl,
  requestUnlock,
  archiveTest,
} from "../../utils/requests";
import { LockStatus, ModifiedTests, Test } from "./helpers/shared";
import TestActionBar from "./testActionBar";

export const updateTest = <T extends Test>(
  currentTests: T[],
  updatedTest: T
): T[] =>
  currentTests.map((test) =>
    test.name === updatedTest.name ? updatedTest : test
  );

// The inner component's props must extend this type
export interface InnerComponentProps<T extends Test> {
  tests: T[];
  modifiedTests: ModifiedTests;
  selectedTestName?: string;
  onTestsChange: (updatedTests: T[], modifiedTestName?: string) => void;
  onTestDelete: (testName: string) => void;
  onTestArchive: (testName: string) => void;
  onSelectedTestName: (testName: string) => void;
  onTestErrorStatusChange: (testName: string) => (isValid: boolean) => void;
  cancel: () => void;
  save: () => void;
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
  tests: T[] | null;
  version: string | null;
  selectedTestName?: string;
  editMode: boolean;
  lockStatus: LockStatus;
  modifiedTests: ModifiedTests;
  timeoutAlertId: number | null; // A timeout for warning about being open for edit for too long
}

interface Props {}

/**
 * A stateful higher-order component for fetching/saving test data.
 * Takes care of locks
 */
const TestEditor = <T extends Test>(
  InnerComponent: React.ComponentType<InnerComponentProps<T>>,
  settingsType: FrontendSettingsType
) =>
  class extends React.Component<Props, TestFormState<T>> {
    state: TestFormState<T> = {
      tests: null,
      version: null,
      selectedTestName: undefined,
      editMode: false,
      lockStatus: { locked: false },
      modifiedTests: {},
      timeoutAlertId: null,
    };

    componentWillMount(): void {
      this.fetchStateFromServer();
    }

    fetchStateFromServer = (): void => {
      fetchFrontendSettings(settingsType).then(
        (serverData: DataFromServer<T>) => {
          const editMode = serverData.status.email === serverData.userEmail;

          this.updateWarningTimeout(editMode);

          this.setState({
            ...serverData.value,
            version: serverData.version,
            lockStatus: serverData.status,
            editMode: editMode,
            modifiedTests: {},
          });
        }
      );
    };

    // Maintains an alert if tool is left open for edit for 20 minutes
    updateWarningTimeout = (editMode: boolean): void => {
      if (editMode) {
        if (this.state.timeoutAlertId) {
          window.clearTimeout(this.state.timeoutAlertId);
        }

        const timeoutAlertId = window.setTimeout(() => {
          alert(
            "You've had this editing session open for 20 minutes - if you leave it much longer then you may lose any unsaved work!\nIf you've finished then please either save or cancel."
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
      requestUnlock(settingsType).then((response) =>
        response.ok
          ? this.fetchStateFromServer()
          : alert("Error - can't request lock!")
      );
    };

    save = (tests: T[]) => (): void => {
      const testsToArchive: T[] = tests.filter(
        (test) =>
          this.state.modifiedTests[test.name] &&
          this.state.modifiedTests[test.name].isArchived
      );

      Promise.all(
        testsToArchive.map((test) => archiveTest(test, settingsType))
      ).then((results) => {
        const notOk = results.some((result) => !result.ok);
        const numTestsToArchive = testsToArchive.length;
        if (notOk) {
          alert(
            `Failed to archive ${numTestsToArchive} test${
              numTestsToArchive !== 1 ? "s" : ""
            }`
          );
        } else {
          const updatedTests: T[] = tests.filter((test) => {
            const modifiedTestData = this.state.modifiedTests[test.name];
            return !(
              modifiedTestData &&
              (modifiedTestData.isDeleted || modifiedTestData.isArchived)
            );
          });

          const postData = {
            version: this.state.version,
            value: {
              tests: updatedTests,
            },
          };

          saveFrontendSettings(settingsType, postData)
            .then((resp) => {
              if (!resp.ok) {
                resp.text().then((msg) => alert(msg));
              }
              this.fetchStateFromServer();
            })
            .catch((resp) => {
              alert("Error while saving");
              this.fetchStateFromServer();
            });
        }
      });
    };

    onTestsChange = (updatedTests: T[], modifiedTestName?: string): void => {
      if (modifiedTestName && !this.state.modifiedTests[modifiedTestName]) {
        this.setState({
          modifiedTests: {
            ...this.state.modifiedTests,
            [modifiedTestName]: {
              isValid: true, // not already modified, assume it's valid until told otherwise
              isDeleted: false,
              isArchived: false,
              isNew: !(
                this.state.tests &&
                this.state.tests.some((test) => test.name === modifiedTestName)
              ),
            },
          },
        });
      }

      this.setState({
        tests: updatedTests,
      });
    };

    onTestErrorStatusChange = (testName: string) => (
      isValid: boolean
    ): void => {
      if (this.state.modifiedTests[testName]) {
        this.setState({
          modifiedTests: {
            ...this.state.modifiedTests,
            [testName]: {
              ...this.state.modifiedTests[testName],
              isValid,
            },
          },
        });
      }
    };

    onTestDelete = (testName: string): void => {
      const updatedState = this.state.modifiedTests[testName]
        ? { ...this.state.modifiedTests[testName], isDeleted: true }
        : {
            isValid: true,
            isDeleted: true,
            isNew: false,
            isArchived: false,
          };

      this.setState({
        modifiedTests: {
          ...this.state.modifiedTests,
          [testName]: updatedState,
        },
      });
    };

    onTestArchive = (testName: string): void => {
      const updatedState = this.state.modifiedTests[testName]
        ? { ...this.state.modifiedTests[testName], isArchived: true }
        : {
            isValid: true,
            isDeleted: false,
            isNew: false,
            isArchived: true,
          };

      this.setState({
        modifiedTests: {
          ...this.state.modifiedTests,
          [testName]: updatedState,
        },
      });
    };

    onSelectedTestName = (testName: string): void => {
      this.setState({
        selectedTestName: testName,
      });
    };

    requestTestsLock = () => {
      requestLock(settingsType).then((response) =>
        response.ok
          ? this.fetchStateFromServer()
          : alert("Error - can't request lock!")
      );
    };

    requestTestsTakeControl = () => {
      requestTakeControl(settingsType).then((response) =>
        response.ok
          ? this.fetchStateFromServer()
          : alert("Error - can't take back control!")
      );
    };

    render(): React.ReactNode {
      return (
        <>
          {this.state.tests !== null ? (
            <>
              <InnerComponent
                tests={this.state.tests}
                modifiedTests={this.state.modifiedTests}
                selectedTestName={this.state.selectedTestName}
                onTestsChange={this.onTestsChange}
                onTestDelete={this.onTestDelete}
                onTestArchive={this.onTestArchive}
                onSelectedTestName={this.onSelectedTestName}
                onTestErrorStatusChange={this.onTestErrorStatusChange}
                requestTakeControl={this.requestTestsTakeControl}
                requestLock={this.requestTestsLock}
                lockStatus={this.state.lockStatus}
                save={this.save(this.state.tests)}
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
