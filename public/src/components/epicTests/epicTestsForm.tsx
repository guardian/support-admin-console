import React from 'react';
import update from 'immutability-helper';
import {createStyles, Theme, withStyles, WithStyles, Typography} from "@material-ui/core";
import EpicTestEditor from './epicTestEditor';
import EpicTestActionBar from './epicTestActionBar';
import CircularProgress from '@material-ui/core/CircularProgress';
import {Region} from "../../utils/models";
import {
  fetchFrontendSettings,
  FrontendSettingsType,
  saveFrontendSettings,
  requestLock,
  requestTakeControl,
  requestUnlock
} from "../../utils/requests";
import EpicTestsList from "./epicTestsList";

export enum UserCohort {
  Everyone = 'Everyone',
  AllExistingSupporters = 'AllExistingSupporters',
  AllNonSupporters = 'AllNonSupporters',
  PostAskPauseSingleContributors = 'PostAskPauseSingleContributors'
}

export interface Cta {
  text?: string,
  baseUrl?: string
}

export interface EpicVariant {
  name: string,
  heading?: string,
  paragraphs: string[],
  highlightedText?: string,
  footer?: string,
  showTicker: boolean,
  backgroundImageUrl?: string,
  cta?: Cta
}

export interface MaxViews {
  maxViewsCount: number,
  maxViewsDays: number,
  minDaysBetweenViews: number
}

export interface EpicTest {
  name: string,
  isOn: boolean,
  locations: Region[],
  tagIds: string[],
  sections: string[],
  excludedTagIds: string[],
  excludedSections: string[],
  alwaysAsk: boolean,
  maxViews?: MaxViews,
  userCohort?: UserCohort,
  isLiveBlog: boolean,
  hasCountryName: boolean,
  variants: EpicVariant[],
  highPriority: boolean,
  useLocalViewLog: boolean
}

interface EpicTests {
  tests: EpicTest[]
}

interface DataFromServer {
  value: EpicTests,
  version: string,
  lockStatus: LockStatus,
  userEmail: string,
};

export interface LockStatus {
  locked: boolean,
  email?: string,
  timestamp?: string
};

// Stores tests which have been modified
export type ModifiedTests = {
  [testName: string]: {
    isValid: boolean,
    isDeleted: boolean,
    isNew: boolean
  }
};

type EpicTestsFormState = EpicTests & {
  previousStateFromServer: DataFromServer | null,
  selectedTestName?: string,
  editMode: boolean,
  lockStatus: LockStatus,
  modifiedTests: ModifiedTests
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
      previousStateFromServer: null,
      selectedTestName: undefined,
      editMode: false,
      lockStatus: { locked: false },
      modifiedTests: {},
    };
  };

  componentWillMount(): void {
    this.fetchStateFromServer()
  };

  fetchStateFromServer = (): void => {
    fetchFrontendSettings(FrontendSettingsType.epicTests)
      .then(serverData => {
        this.setState({
          ...serverData.value,
          previousStateFromServer: serverData,
          lockStatus: serverData.status,
          editMode: serverData.status.email === serverData.userEmail,
          modifiedTests: {}
        });
      });
  };

  cancel = (): void => {
    requestUnlock(FrontendSettingsType.epicTests).then( response =>
      response.ok ? this.fetchStateFromServer() : alert("Error - can't request lock!")
    )
  };

  save = (): void => {
    const updatedTests = this.state.tests.filter(test =>
      !(this.state.modifiedTests[test.name] && this.state.modifiedTests[test.name].isDeleted));
    const newState = update(this.state.previousStateFromServer, {
      value: {
        tests: { $set: updatedTests }
      }
    });

    saveFrontendSettings(FrontendSettingsType.epicTests, newState)
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
  };

  onTestsChange = (updatedTests: EpicTest[], modifiedTestName?: string): void => {
    if (modifiedTestName && !this.state.modifiedTests[modifiedTestName]) {
      this.setState({
        modifiedTests: {
          ...this.state.modifiedTests,
          [modifiedTestName]: {
            isValid: true, // not already modified, assume it's valid until told otherwise
            isDeleted: false,
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
      { isValid: true, isDeleted: true, isNew: false};

    this.setState({
      modifiedTests: {
        ...this.state.modifiedTests,
        [testName]: updatedState
      }
    });
  };

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
        <Typography className={classes.h2} variant={'h2'}>Epic tests</Typography>
        <div>
          {
            this.state.previousStateFromServer ?
              <>
                <EpicTestActionBar
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
                      isDeleted={this.state.modifiedTests[test.name] && this.state.modifiedTests[test.name].isDeleted}
                      isNew={this.state.modifiedTests[test.name] && this.state.modifiedTests[test.name].isNew}
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
