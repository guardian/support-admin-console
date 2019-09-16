import React from 'react';
import update from 'immutability-helper';
import {createStyles, Theme, withStyles, WithStyles, CssBaseline, Typography} from "@material-ui/core";
import EpicTestEditor from './epicTestEditor';
import LockOpenIcon from '@material-ui/icons/LockOpen'
import RefreshIcon from '@material-ui/icons/Refresh';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Button from "@material-ui/core/Button";
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
import ButtonWithConfirmationPopup from '../helpers/buttonWithConfirmationPopup';

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

export interface EpicTest {
  name: string,
  isOn: boolean,
  locations: Region[],
  tagIds: string[],
  sections: string[],
  excludedTagIds: string[],
  excludedSections: string[],
  alwaysAsk: boolean,
  userCohort?: UserCohort,
  isLiveBlog: boolean,
  hasCountryName: boolean,
  variants: EpicVariant[],
  highPriority: boolean,
  maxViewsCount: number,
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

interface LockStatus {
  locked: boolean,
  email?: string,
  timestamp?: string
};

// Stores tests which have been modified
export type ModifiedTests = {
  [testName: string]: {
    isValid: boolean
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
  container: {
    display: "block",
    outline: "2px solid green"
  },
  buttons: {
    marginTop: spacing.unit * 2,
    marginBottom: spacing.unit * 4
  },
  button: {
    marginRight: spacing.unit * 2,
    marginBottom: spacing.unit * 2
  },
  warning: {
    fontSize: typography.pxToRem(20),
  },
  testListAndEditor: {
    display: "flex"
  },
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
  }

  componentWillMount(): void {
    this.fetchStateFromServer()
  }

  fetchStateFromServer(): void {
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

  cancel(): void {
    requestUnlock(FrontendSettingsType.epicTests).then( response =>
      response.ok ? this.fetchStateFromServer() : alert("Error - can't request lock!")
    )
  };

  save = () => {
    const newState = update(this.state.previousStateFromServer, {
      value: {
        tests: { $set: this.state.tests }
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
        modifiedTests: update(this.state.modifiedTests, {
          $merge: {[modifiedTestName]: {isValid: true}}  // not already modified, assume it's valid until told otherwise
        })
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
    this.setState({
      modifiedTests: update(this.state.modifiedTests, {
        $merge: { [testName]: {isValid} }
      })
    })
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

  renderButtonsBar = () => {
    const {classes} = this.props;
    if (!this.state.editMode) {
      if (this.state.lockStatus.locked) {
        const friendlyName: string | undefined = this.state.lockStatus.email && this.makeFriendlyName(this.state.lockStatus.email);
        const friendlyTimestamp: string | undefined = this.state.lockStatus.timestamp && this.makeFriendlyDate(this.state.lockStatus.timestamp);
        return (
          <>
            <Typography className={classes.warning}>File locked for editing by {friendlyName} (<a href={"mailto:" + this.state.lockStatus.email}>{this.state.lockStatus.email}</a>) at {friendlyTimestamp}</Typography>
            <div className={classes.buttons}>
              <ButtonWithConfirmationPopup
                buttonText="Take control"
                confirmationText={`Are you sure? Please tell ${friendlyName} that their unpublished changes will be lost.`}
                onConfirm={this.requestTakeControl}
                icon={<LockOpenIcon />}
              />
            </div>
          </>
        );
      } else {
        return (
          <Button
            onClick={this.requestEpicTestsLock}
            variant="contained" color="primary"
          >Edit</Button>
        )
      }
    } else {
      return (
        <div>
          <ButtonWithConfirmationPopup
          buttonText="Publish"
          confirmationText={`Are you sure? This will update ${Object.keys(this.state.modifiedTests).length} test(s)!`}
          onConfirm={this.save}
          icon={<CloudUploadIcon />}
          disabled={
            Object.keys(this.state.modifiedTests).length === 0 ||
            Object.keys(this.state.modifiedTests).some(name => !this.state.modifiedTests[name].isValid)
          }
          />
          <ButtonWithConfirmationPopup
          buttonText="Cancel"
          confirmationText="Are you sure? All unpublished data will be lost!"
          onConfirm={() => this.cancel()}
          icon={<RefreshIcon />}
          />
        </div>
        )
    }
  }

  makeFriendlyDate = (timestamp: string): string => {
    const datetime = new Date(timestamp);
    return `${datetime.getHours()}:${datetime.getMinutes()} on ${datetime.getDate()}/${datetime.getMonth() + 1}/${datetime.getFullYear()}`;
  }

  makeFriendlyName = (email: string): string | undefined => {
    const nameArr: RegExpMatchArray | null = email.match(/^([a-z]*)\.([a-z]*).*@.*/);
    return nameArr ? `${nameArr[1][0].toUpperCase()}${nameArr[1].slice(1,)} ${nameArr[2][0].toUpperCase()}${nameArr[2].slice(1,)}` : undefined;
  }

  render(): React.ReactNode {
    const { classes } = this.props;

    return (
      <>
        <Typography variant={'h2'}>Epic tests</Typography>
        <div className={classes.buttons}>
          {
            this.state.previousStateFromServer ?
              this.renderButtonsBar() :
              <CircularProgress/>
          }
        </div>

        <div className={classes.testListAndEditor}>
          <EpicTestsList
            tests={this.state.tests}
            modifiedTests={this.state.modifiedTests}
            selectedTestName={this.state.selectedTestName}
            onUpdate={this.onTestsChange}
            onSelectedTestName={this.onSelectedTestName}
            editMode={this.state.editMode}
          />

          {this.state.tests.map(test =>
            (<EpicTestEditor
              test={this.state.tests.find(test => test.name === this.state.selectedTestName)}
              hasChanged={!!this.state.modifiedTests[test.name]}
              onChange={this.onTestChange}
              onValidationChange={this.onTestErrorStatusChange(test.name)}
              visible={test.name === this.state.selectedTestName}
              key={test.name}
              editMode={this.state.editMode}
            />)
          )}
        </div>
      </>
    )
  }
}

export default withStyles(styles)(EpicTestsForm);
