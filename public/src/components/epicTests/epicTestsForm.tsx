import React, { ReactElement } from 'react';
import update from 'immutability-helper';
import { createStyles, Theme, withStyles, WithStyles, Typography } from "@material-ui/core";
import EpicTestEditor from './epicTestEditor';
import LockOpenIcon from '@material-ui/icons/LockOpen'
import RefreshIcon from '@material-ui/icons/Refresh';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Button from "@material-ui/core/Button";
import CircularProgress from '@material-ui/core/CircularProgress';
import { Region } from "../../utils/models";
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
  useLocalViewLog: boolean,
  audience: number,
  audienceOffset: number
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
    padding: spacing.unit
  },
  actionBar: {
    marginTop: spacing.unit * 2,
    marginBottom: spacing.unit * 2,
    borderRadius: "5px",
    paddingTop: spacing.unit * 2,
    display: "flex",
    justifyContent: "space-between",
    minHeight: spacing.unit * 9
  },
  actionBarText: {
    fontSize: typography.pxToRem(18),
    marginLeft: spacing.unit * 2,
    marginTop: spacing.unit
  },
  actionBarButtons: {
    marginLeft: spacing.unit * 2,
    marginRight: spacing.unit * 2
  },
  editModeColour: {
    backgroundColor: "#ffe500"
  },
  readOnlyModeColour: {
    backgroundColor: "#dcdcdc"
  },
  modeTag: {
    marginLeft: spacing.unit * 2,
    marginBottom: spacing.unit * 2,
    padding: spacing.unit,
    borderRadius: "5px"
  },
  editModeTagColour: {
    backgroundColor: "#ffbb50"
  },
  readOnlyModeTagColour: {
    backgroundColor: "#f6f6f6"
  },
  modeTagText: {
    fontSize: typography.pxToRem(18),
    fontWeight: typography.fontWeightMedium
  },
  viewText: {
    marginTop: spacing.unit * 6,
    marginLeft: spacing.unit * 2,
    fontSize: typography.pxToRem(16)
  },
  editModeBorder: {
    border: "4px solid #ffe500"
  },
  readOnlyModeBorder: {
    border: "4px solid #dcdcdc"
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

  buildConfirmationText = (modifiedTests: ModifiedTests): ReactElement<any> => {
    const counts = {
      deleted: 0,
      created: 0,
      modified: 0
    };
    Object.keys(modifiedTests).forEach(key => {
      if (modifiedTests[key].isDeleted) counts.deleted++;
      else if (modifiedTests[key].isNew) counts.created++;
      else counts.modified++;
    });

    const statusLine = (status: 'deleted' | 'created' | 'modified') => counts[status] > 0 &&
      <span>
        <br />&bull; {`${counts[status]} test${counts[status] !== 1 ? "s" : ""} ${status}`}
      </span>;

    return (
      <div>Are you sure you want to save these changes?
        {statusLine('deleted')}
        {statusLine('created')}
        {statusLine('modified')}
      </div>
    );
  };

  makeFriendlyDate = (timestamp: string): string => {
    const datetime = new Date(timestamp);
    const hours = `${datetime.getHours() < 10 ? "0" : ""}${datetime.getHours()}`;
    const minutes = `${datetime.getMinutes() < 10 ? "0": ""}${datetime.getMinutes()}`;
    const date = datetime.getDate();
    const month = datetime.getMonth() + 1;
    const year = datetime.getFullYear();

    return `${hours}:${minutes} on ${date}/${month}/${year}`;
  }

  makeFriendlyName = (email: string): string | undefined => {
    const nameArr: RegExpMatchArray | null = email.match(/^([a-z]*)\.([a-z]*).*@.*/);
    return nameArr ? `${nameArr[1][0].toUpperCase()}${nameArr[1].slice(1,)} ${nameArr[2][0].toUpperCase()}${nameArr[2].slice(1,)}` : undefined;
  }

  renderLockedMessageAndButton = () => {
    const friendlyName: string | undefined = this.state.lockStatus.email && this.makeFriendlyName(this.state.lockStatus.email);
    const friendlyTimestamp: string | undefined = this.state.lockStatus.timestamp && this.makeFriendlyDate(this.state.lockStatus.timestamp);
    const {classes} = this.props;
    return (
      <>
        <div className={`${classes.modeTag} ${classes.readOnlyModeTagColour}`}><Typography className={classes.modeTagText}>Read-only (locked)</Typography></div>
        <Typography className={classes.actionBarText}>File locked for editing by {friendlyName} (<a href={"mailto:" + this.state.lockStatus.email}>{this.state.lockStatus.email}</a>) at {friendlyTimestamp}.</Typography>
        <div className={classes.actionBarButtons}>
          <ButtonWithConfirmationPopup
            buttonText="Take control"
            confirmationText={`Are you sure? Please tell ${friendlyName} that their unpublished changes will be lost.`}
            onConfirm={this.requestTakeControl}
            icon={<LockOpenIcon />}
            color={'primary'}
          />
        </div>
      </>
    )
  };

  renderEditButton = () => {
    const {classes} = this.props;

    return (
      <>
        <div className={`${classes.modeTag} ${classes.readOnlyModeTagColour}`}><Typography className={classes.modeTagText}>Read-only mode</Typography></div>
        <Typography className={classes.actionBarText}>Click the button on the right to create and edit tests.</Typography>
        <div className={classes.actionBarButtons}>
          <Button
            onClick={this.requestEpicTestsLock}
            variant="contained"
            color="primary"
          >
            Create & edit tests
          </Button>
        </div>
      </>
    );
  };

  renderPublishButtons = () => {
    const {classes} = this.props;
    return (
    <>
      <div className={`${classes.modeTag} ${classes.editModeTagColour}`}><Typography className={classes.modeTagText}>Edit mode</Typography></div>
      <div><Typography className={classes.actionBarText}>WARNING: Any changes you make will be lost if you refresh the page.</Typography></div>
      <div className={classes.actionBarButtons}>
        <ButtonWithConfirmationPopup
        buttonText="Save all"
        confirmationText={this.buildConfirmationText(this.state.modifiedTests)}
        onConfirm={this.save}
        icon={<CloudUploadIcon />}
        disabled={
          Object.keys(this.state.modifiedTests).length === 0 ||
          Object.keys(this.state.modifiedTests).some(name =>
            !this.state.modifiedTests[name].isValid && !this.state.modifiedTests[name].isDeleted
          )
        }
        color={'primary'}
        />
        <ButtonWithConfirmationPopup
        buttonText="Discard all"
        confirmationText="Are you sure? All new, modified and deleted tests will be lost!"
        onConfirm={() => this.cancel()}
        icon={<RefreshIcon />}
        color={'primary'}
        />
      </div>
    </>
  );
  };


  renderActionBar = () => {
    const {classes} = this.props;
    const classNames = [
      classes.actionBar,
      this.state.editMode && classes.editModeColour,
      !this.state.editMode && classes.readOnlyModeColour
    ].join(' ');

    return (
      <div className={classNames}>
        {!this.state.editMode ? (
          this.state.lockStatus.locked ? this.renderLockedMessageAndButton() : this.renderEditButton()
        ) : this.renderPublishButtons()}
      </div>
    )
  }

  render(): React.ReactNode {
    const { classes } = this.props;
    const listAndEditorClassNames = [
      classes.testListAndEditor,
      this.state.editMode && classes.editModeBorder,
      !this.state.editMode && classes.readOnlyModeBorder
    ].join(' ');

    return (
      <>
        <Typography variant={'h2'}>Epic tests</Typography>
        <div>
          {
            this.state.previousStateFromServer ?
              this.renderActionBar() :
              <CircularProgress/>
          }
        </div>

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
    )
  }
}

export default withStyles(styles)(EpicTestsForm);
