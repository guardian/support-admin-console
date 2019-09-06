import React from 'react';
import update from 'immutability-helper';
import {createStyles, Theme, withStyles, WithStyles, CssBaseline, Typography} from "@material-ui/core";
import SaveIcon from '@material-ui/icons/Save';
import LockOpenIcon from '@material-ui/icons/LockOpen'
import RefreshIcon from '@material-ui/icons/Refresh';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Button from "@material-ui/core/Button";
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

export interface EpicVariant {
  name: string,
  heading?: string,
  paragraphs: string[],
  highlightedText?: string,
  footer?: string,
  showTicker: boolean,
  backgroundImageUrl?: string,
  ctaText?: string,
  supportBaseURL?: string
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
  highPriority: boolean
}

interface EpicTests {
  tests: EpicTest[]
}

interface DataFromServer {
  value: EpicTests,
  version: string,
};

interface LockStatus {
  locked: boolean,
  email?: string,
  timestamp?: string
};

type EpicTestsFormState = EpicTests & {
  selectedTestName?: string,
  editMode: boolean,
  lockStatus: LockStatus
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
  }
});

interface EpicTestFormProps extends WithStyles<typeof styles> {}

class EpicTestsForm extends React.Component<EpicTestFormProps, EpicTestsFormState> {
  state: EpicTestsFormState;
  previousStateFromServer: DataFromServer | null;

  constructor(props: EpicTestFormProps) {
    super(props);
    this.state = {
      tests: [],
      selectedTestName: undefined,
      editMode: false,
      lockStatus: { locked: false }
    };
    this.previousStateFromServer = null;
  }

  componentWillMount(): void {
    this.fetchStateFromServer()
  }

  fetchStateFromServer(): void {
    fetchFrontendSettings(FrontendSettingsType.epicTests)
      .then(serverData => {
        this.previousStateFromServer = serverData;
        this.setState({
          ...serverData.value,
          lockStatus: serverData.status
        });
      });
  };

  cancel(): void {
    requestUnlock(FrontendSettingsType.epicTests).then( response => {
      response.ok ? this.setState({ editMode: false }) : alert("Error - can't request lock!");
        this.fetchStateFromServer();
      });
  };

  save = () => {
    const newState = update(this.previousStateFromServer, {
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
        this.setState({ editMode: false });
      })
      .catch((resp) => {
        alert('Error while saving');
        this.fetchStateFromServer();
      });
  };

  onTestsChange = (updatedTests: EpicTest[]): void => {
    this.setState({
      tests: updatedTests
    });
  };

  onSelectedTestName = (testName: string): void => {
      this.setState({
        selectedTestName: testName
      })
  }

  requestEpicTestsLock = () => {
    requestLock(FrontendSettingsType.epicTests).then(
      response => {
        response.ok ? this.setState({ editMode: true }) : alert("Error - can request lock!");
      }
    );
  }

  requestTakeControl = () => {
    requestTakeControl(FrontendSettingsType.epicTests).then(
      response => {
        response.ok ? this.setState({ editMode: true }) : alert("Error - can't take back control!");
      }
    )
  }

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
          confirmationText="Are you sure? This will replace all live tests!"
          onConfirm={this.save}
          icon={<CloudUploadIcon />}
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
    const year = timestamp.slice(0, 4);
    const month = timestamp.slice(5,7);
    const day = timestamp.slice(8,10);
    const time = timestamp.slice(11,19);
    return `${time} on ${day}/${month}/${year}`;
  }

  makeFriendlyName = (email: string): string => {
    const name = email.split('.')[0];
    const friendlyName = name[0].toUpperCase() + name.slice(1,);
    return friendlyName;
  }

  render(): React.ReactNode {
    const { classes } = this.props;

    return (
      <>
        <Typography variant={'h2'}>Epic tests</Typography>
        <div className={classes.buttons}>
          {this.renderButtonsBar()}
        </div>

        <div>
          <EpicTestsList
            tests={this.state.tests}
            selectedTestName={this.state.selectedTestName}
            onUpdate={this.onTestsChange}
            onSelectedTestName={this.onSelectedTestName}
            editMode={this.state.editMode}
          />
        </div>
      </>
    )
  }
}

export default withStyles(styles)(EpicTestsForm);
