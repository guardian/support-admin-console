import React from 'react';
import update from 'immutability-helper';
import {createStyles, Theme, withStyles, WithStyles, Typography} from "@material-ui/core";
// import EpicTestEditor from './epicTestEditor';
import EpicTestActionBar from '../epicTests/epicTestActionBar';
import CircularProgress from '@material-ui/core/CircularProgress';
import {Region} from "../../../utils/models";
import {
  fetchFrontendSettings,
  FrontendSettingsType,
  saveFrontendSettings,
  requestLock,
  requestTakeControl,
  requestUnlock,
  archiveBannerTest
} from "../../../utils/requests";
import BannerTestsList from "./BannerTestsList";
import {
  UserCohort,
  Cta,
  ArticlesViewedSettings,
  LockStatus,
  TestStatus,
  ModifiedTests,
} from "../epicTests/epicTestsForm";
import EpicTestEditor from "../epicTests/epicTestEditor";
import BannerTestEditor from "./bannerTestEditor";

interface BannerTests {
  tests: BannerTest[]
}

interface BannerDataFromServer {
  value: BannerTests,
  version: string,
  lockStatus: LockStatus,
  userEmail: string,
};
export interface BannerTest {
  name: string,
  nickname?: string,
  isOn: boolean,
  minArticlesBeforeShowingBanner: number,
  userCohort: UserCohort,
  products?: OphanProduct[],
  locations: Region[],
  variants: BannerVariant[],
  articlesViewedSettings?: ArticlesViewedSettings,
}
export interface BannerVariant {
  name: string,
  heading?: string,
  body: string,
  highlightedText: string,
  cta?: Cta,
  secondaryCta?: Cta,
  showTicker: boolean,
}

type BannerTestFormState = BannerTests & {
  previousStateFromServer: BannerDataFromServer | null,
  selectedTestName?: string,
  editMode: boolean,
  lockStatus: LockStatus,
  modifiedTests: ModifiedTests,
  timeoutAlertId: number | null,  // A timeout for warning about being open for edit for too long
};

export enum OphanProduct {
  CONTRIBUTION = 'CONTRIBUTION',
  RECURRING_CONTRIBUTION = 'RECURRING_CONTRIBUTION',
  MEMBERSHIP_SUPPORTER = 'MEMBERSHIP_SUPPORTER',
  MEMBERSHIP_PATRON = 'MEMBERSHIP_PATRON',
  MEMBERSHIP_PARTNER = 'MEMBERSHIP_PARTNER',
  DIGITAL_SUBSCRIPTION = 'DIGITAL_SUBSCRIPTION',
  PRINT_SUBSCRIPTION = 'PRINT_SUBSCRIPTION',
}

const styles = ({ spacing, typography }: Theme) => createStyles({
  testListAndEditor: {
    display: "flex",
    padding: spacing(1)
  },
  viewText: {
    marginTop: spacing(6),
    marginLeft: spacing(2),
    fontSize: typography.pxToRem(16)
  },
  editModeBorder: {
    // border: "4px solid #ffe500"
    border: 'none',
  },
  readOnlyModeBorder: {
    border: "4px solid #dcdcdc"
  },
  h2: {
    fontSize: '3rem'
  }
});

interface BannerTestFormProps extends WithStyles<typeof styles> {}


class BannerTestsForm extends React.Component<BannerTestFormProps, BannerTestFormState> {

  state: BannerTestFormState = {
    tests: [],
    previousStateFromServer: null,
    selectedTestName: undefined,
    editMode: false,
    lockStatus: { locked: false },
    modifiedTests: {},
    timeoutAlertId: null,
  }

  componentWillMount(): void {
    this.fetchStateFromServer()
  };

  fetchStateFromServer = (): void => {
    fetchFrontendSettings(FrontendSettingsType.bannerTests)
      .then(serverData => {
        const editMode = serverData.status.email === serverData.userEmail;

        this.updateWarningTimeout(editMode);

        this.setState({
          ...serverData.value,
          previousStateFromServer: serverData,
          lockStatus: serverData.status,
          editMode: editMode,
          modifiedTests: {}
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
        alert("You've had this editing session open for 20 minutes - if you leave it much longer then you may lose any unsaved work!\nIf you've finished then please either save or cancel.");
        this.setState({ timeoutAlertId: null });
      }, 60 * 20 * 1000);

      this.setState({ timeoutAlertId });

    } else if (this.state.timeoutAlertId) {
      window.clearTimeout(this.state.timeoutAlertId);
      this.setState({ timeoutAlertId: null });
    }
  };

  cancel = (): void => {
    requestUnlock(FrontendSettingsType.bannerTests).then( response =>
      response.ok ? this.fetchStateFromServer() : alert("Error - can't request lock!")
    )
  };

  save = (): void => {
    const testsToArchive: BannerTest[] = this.state.tests.filter(test =>
      this.state.modifiedTests[test.name] && this.state.modifiedTests[test.name].isArchived
    );

    Promise.all(testsToArchive.map(test => archiveBannerTest(test))).then(results => {
      const notOk = results.some(result => !result.ok);
      const numTestsToArchive = testsToArchive.length;
      if (notOk) {
        alert(`Failed to archive ${numTestsToArchive} test${numTestsToArchive !== 1 ? 's' : ''}`);
      } else {
        const updatedTests: BannerTest[] = this.state.tests.filter(test => {
          const modifiedTestData = this.state.modifiedTests[test.name];
          return !(modifiedTestData && (modifiedTestData.isDeleted || modifiedTestData.isArchived));
        });
        const newState = update(this.state.previousStateFromServer, {
          value: {
            tests: { $set: updatedTests }
          }
        });

        saveFrontendSettings(FrontendSettingsType.bannerTests, newState)
          .then(resp => {
            if (!resp.ok) {
              resp.text().then(msg => alert(msg));
            }
            this.fetchStateFromServer();
          })
          .catch((resp) => {
            alert('Error while saving');
            this.fetchStateFromServer();
          });
      }
    });
  };

  onTestsChange = (updatedTests: BannerTest[], modifiedTestName?: string): void => {
    if (modifiedTestName && !this.state.modifiedTests[modifiedTestName]) {
      this.setState({
        modifiedTests: {
          ...this.state.modifiedTests,
          [modifiedTestName]: {
            isValid: true, // not already modified, assume it's valid until told otherwise
            isDeleted: false,
            isArchived: false,
            isNew: !this.state.tests.some(test => test.name === modifiedTestName)
          }
        }
      })
    }

    this.setState({
      tests: updatedTests
    });
  };

  onTestChange = (updatedTest: BannerTest): void => {
    const updatedTests = this.state.tests.map(test => test.name === updatedTest.name ? updatedTest : test);
    this.onTestsChange(updatedTests, updatedTest.name);
  };

  onTestErrorStatusChange = (testName: string) => (isValid: boolean): void => {
    if (this.state.modifiedTests[testName]) {
      this.setState({
        modifiedTests: {
          ...this.state.modifiedTests,
          [testName]: {
            ...this.state.modifiedTests[testName],
            isValid
          }
        }
      });
    }
  };

  onTestDelete = (testName: string): void => {
    const updatedState = this.state.modifiedTests[testName] ?
      { ...this.state.modifiedTests[testName], isDeleted: true } :
      {
        isValid: true,
        isDeleted: true,
        isNew: false,
        isArchived: false
      };

    this.setState({
      modifiedTests: {
        ...this.state.modifiedTests,
        [testName]: updatedState
      }
    });
  };

  onTestArchive = (testName: string): void => {
    const updatedState = this.state.modifiedTests[testName] ?
    { ...this.state.modifiedTests[testName], isArchived: true } :
    {
      isValid: true,
      isDeleted: false,
      isNew: false,
      isArchived: true
    };

    this.setState({
      modifiedTests: {
        ...this.state.modifiedTests,
        [testName]: updatedState
      }
    });
  }

  onSelectedTestName = (testName: string): void => {
    this.setState({
      selectedTestName: testName
    })
};

requestBannerTestsLock = () => {
  requestLock(FrontendSettingsType.bannerTests).then(response =>
    response.ok ? this.fetchStateFromServer() : alert("Error - can't request lock!")
  );
};

requestTakeControl = () => {
  requestTakeControl(FrontendSettingsType.bannerTests).then(response =>
    response.ok ? this.fetchStateFromServer() : alert("Error - can't take back control!")
  );
};

  createBannerTest = () => undefined;

  render(): React.ReactNode {
    const { classes } = this.props;
    const listAndEditorClassNames = [
      classes.testListAndEditor,
      this.state.editMode && classes.editModeBorder,
      !this.state.editMode && classes.readOnlyModeBorder
    ].join(' ');

    return (
      <>
        <div>
          {
            this.state.previousStateFromServer ?
              <>

                <div className={listAndEditorClassNames}>
                  <BannerTestsList
                    tests={this.state.tests}
                    modifiedTests={this.state.modifiedTests}
                    selectedTestName={this.state.selectedTestName}
                    onUpdate={this.onTestsChange}
                    onSelectedTestName={this.onSelectedTestName}
                    editMode={this.state.editMode}
                  />

                  {this.state.selectedTestName ? this.state.tests.map(test =>
                    (<BannerTestEditor
                      test={this.state.tests.find(test => test.name === this.state.selectedTestName)}
                      hasChanged={!!this.state.modifiedTests[test.name]}
                      onChange={this.onTestChange}
                      onValidationChange={this.onTestErrorStatusChange(test.name)}
                      visible={test.name === this.state.selectedTestName}
                      key={test.name}
                      editMode={this.state.editMode}
                      onDelete={this.onTestDelete}
                      onArchive={this.onTestArchive}
                      isDeleted={this.state.modifiedTests[test.name] && this.state.modifiedTests[test.name].isDeleted}
                      isArchived={this.state.modifiedTests[test.name] && this.state.modifiedTests[test.name].isArchived}
                      isNew={this.state.modifiedTests[test.name] && this.state.modifiedTests[test.name].isNew}
                      createTest={(newTest: BannerTest) => {
                        const newTests = [...this.state.tests, newTest];
                        this.onTestsChange(newTests, newTest.name)
                      }}
                      testNames={this.state.tests.map(test => test.name)}
                      testNicknames={
                        this.state.tests
                          .map(test => test.nickname)
                          .filter(nickname => !!nickname) as string[]
                      }
                    />)
                  ) : (
                    <Typography className={classes.viewText}>Click on a test on the left to view contents.</Typography>
                  )}
                </div>
                {<EpicTestActionBar
                  modifiedTests={this.state.modifiedTests}
                  lockStatus={this.state.lockStatus}
                  editMode={this.state.editMode}
                  requestTakeControl={this.requestTakeControl}
                  requestLock={this.requestBannerTestsLock}
                  cancel={this.cancel}
                  save={this.save}
                /> }
              </>
               :
              <CircularProgress/>
          }
        </div>
      </>
    )
  }

}

export default withStyles(styles)(BannerTestsForm);
