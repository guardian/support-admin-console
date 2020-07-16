import React from 'react';
import update from 'immutability-helper';
import {createStyles, Theme, withStyles, WithStyles, Typography} from "@material-ui/core";
import EpicTestEditor from './epicTestEditor';
import TestActionBar from '../testActionBar';
import CircularProgress from '@material-ui/core/CircularProgress';
import {Region} from "../../../utils/models";
import {
  fetchFrontendSettings,
  FrontendSettingsType,
  saveFrontendSettings,
  requestLock,
  requestTakeControl,
  requestUnlock,
  archiveEpicTest
} from "../../../utils/requests";
import EpicTestsList from "./epicTestsList";
import {
  UserCohort,
  Cta,
  ArticlesViewedSettings,
  LockStatus,
  ModifiedTests,
} from "../helpers/shared";

export enum TickerEndType {
  unlimited = 'unlimited',
  hardstop = 'hardstop'
}
export enum TickerCountType {
  money = 'money',
  people = 'people'
}
interface TickerCopy {
  countLabel: string,
  goalReachedPrimary: string,
  goalReachedSecondary: string
}
export interface TickerSettings {
  endType: TickerEndType,
  countType: TickerCountType,
  currencySymbol: string,
  copy: TickerCopy
}
export interface EpicVariant {
  name: string,
  heading?: string,
  paragraphs: string[],
  highlightedText?: string,
  footer?: string,
  showTicker: boolean,
  tickerSettings?: TickerSettings,
  backgroundImageUrl?: string,
  cta?: Cta,
  secondaryCta?: Cta,
}

export interface MaxEpicViews {
  maxViewsCount: number,
  maxViewsDays: number,
  minDaysBetweenViews: number
}

export interface EpicTest {
  name: string,
  nickname?: string,
  isOn: boolean,
  locations: Region[],
  tagIds: string[],
  sections: string[],
  excludedTagIds: string[],
  excludedSections: string[],
  alwaysAsk: boolean,
  maxViews?: MaxEpicViews,
  userCohort?: UserCohort,
  isLiveBlog: boolean,
  hasCountryName: boolean,
  variants: EpicVariant[],
  highPriority: boolean, // has been removed from form, but might be used in future
  useLocalViewLog: boolean,
  articlesViewedSettings?: ArticlesViewedSettings
}

interface EpicTests {
  tests: EpicTest[]
}

interface DataFromServer {
  value: EpicTests,
  version: string,
  status: LockStatus,
  userEmail: string,
};

type EpicTestsFormState = EpicTests & {
  version: string | null,
  selectedTestName?: string,
  editMode: boolean,
  lockStatus: LockStatus,
  modifiedTests: ModifiedTests,
  timeoutAlertId: number | null,  // A timeout for warning about being open for edit for too long
};

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
    border: "4px solid #ffe500"
  },
  readOnlyModeBorder: {
    border: "4px solid #dcdcdc"
  },
  h2: {
    fontSize: '3rem'
  }
});

interface EpicTestFormProps extends WithStyles<typeof styles> {}

class EpicTestsForm extends React.Component<EpicTestFormProps, EpicTestsFormState> {
  state: EpicTestsFormState;

  constructor(props: EpicTestFormProps) {
    super(props);
    this.state = {
      tests: [],
      version: null,
      selectedTestName: undefined,
      editMode: false,
      lockStatus: { locked: false },
      modifiedTests: {},
      timeoutAlertId: null,
    };
  };

  componentWillMount(): void {
    this.fetchStateFromServer()
  };

  fetchStateFromServer = (): void => {
    fetchFrontendSettings(FrontendSettingsType.epicTests)
      .then((serverData: DataFromServer) => {
        const editMode = serverData.status.email === serverData.userEmail;

        this.updateWarningTimeout(editMode);

        this.setState({
          ...serverData.value,
          version: serverData.version,
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
    requestUnlock(FrontendSettingsType.epicTests).then( response =>
      response.ok ? this.fetchStateFromServer() : alert("Error - can't request lock!")
    )
  };

  save = (): void => {
    const testsToArchive: EpicTest[] = this.state.tests.filter(test =>
      this.state.modifiedTests[test.name] && this.state.modifiedTests[test.name].isArchived
    );

    Promise.all(testsToArchive.map(test => archiveEpicTest(test))).then(results => {
      const notOk = results.some(result => !result.ok);
      const numTestsToArchive = testsToArchive.length;
      if (notOk) {
        alert(`Failed to archive ${numTestsToArchive} test${numTestsToArchive !== 1 ? 's' : ''}`);
      } else {
        const updatedTests: EpicTest[] = this.state.tests.filter(test => {
          const modifiedTestData = this.state.modifiedTests[test.name];
          return !(modifiedTestData && (modifiedTestData.isDeleted || modifiedTestData.isArchived));
        });

        const postData = {
          version: this.state.version,
          value: {
            tests: updatedTests
          }
        };

        saveFrontendSettings(FrontendSettingsType.epicTests, postData)
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

  onTestsChange = (updatedTests: EpicTest[], modifiedTestName?: string): void => {
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

  onTestChange = (updatedTest: EpicTest): void => {
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

  requestEpicTestsLock = () => {
    requestLock(FrontendSettingsType.epicTests).then(response =>
      response.ok ? this.fetchStateFromServer() : alert("Error - can't request lock!")
    );
  };

  requestTakeControl = () => {
    requestTakeControl(FrontendSettingsType.epicTests).then(response =>
      response.ok ? this.fetchStateFromServer() : alert("Error - can't take back control!")
    );
  };

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
            this.state.version ?
              <>
                <TestActionBar
                  modifiedTests={this.state.modifiedTests}
                  lockStatus={this.state.lockStatus}
                  editMode={this.state.editMode}
                  requestTakeControl={this.requestTakeControl}
                  requestLock={this.requestEpicTestsLock}
                  cancel={this.cancel}
                  save={this.save}
                />
                <div className={listAndEditorClassNames}>
                  <EpicTestsList
                    tests={this.state.tests}
                    modifiedTests={this.state.modifiedTests}
                    selectedTestName={this.state.selectedTestName}
                    onUpdate={this.onTestsChange}
                    onSelectedTestName={this.onSelectedTestName}
                    editMode={this.state.editMode}
                  />

                  {this.state.selectedTestName ? this.state.tests.map(test =>
                    (<EpicTestEditor
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
                      createTest={(newTest: EpicTest) => {
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
                  ) : (<Typography className={classes.viewText}>Click on a test on the left to view contents.</Typography>)}
                </div>
              </>
               :
              <CircularProgress/>
          }
        </div>
      </>
    )
  }
}

export default withStyles(styles)(EpicTestsForm);
