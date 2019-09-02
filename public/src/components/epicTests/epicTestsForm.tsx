import React from 'react';
import update from 'immutability-helper';
import {createStyles, Theme, withStyles, WithStyles, CssBaseline, Typography} from "@material-ui/core";
import SaveIcon from '@material-ui/icons/Save';
import RefreshIcon from '@material-ui/icons/Refresh';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Button from "@material-ui/core/Button";
import {Region} from "../../utils/models";
import {
  fetchFrontendSettings,
  FrontendSettingsType,
  saveFrontendSettings,
} from "../../utils/requests";
import EpicTestsList from "./epicTestsList";
import ButtonWithConfirmationPopup from '../helpers/buttonWithConfirmationPopup';

export enum UserCohort {
  'Everyone' = 'Everyone',
  'Non-supporters' = 'OnlyNonSupporters',
  'Existing supporters' = 'OnlyExistingSupporters'
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
  variants: EpicVariant[]
}

interface EpicTests {
  tests: EpicTest[]
}

interface DataFromServer {
  value: EpicTests,
  version: string,
}

type EpicTestsFormState = EpicTests;

const styles = ({ spacing }: Theme) => createStyles({
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
  }
});

interface EpicTestFormProps extends WithStyles<typeof styles> {}

class EpicTestsForm extends React.Component<EpicTestFormProps, EpicTestsFormState> {
  state: EpicTestsFormState;
  previousStateFromServer: DataFromServer | null;

  constructor(props: EpicTestFormProps) {
    super(props);
    this.state = {
      tests: []
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
          ...serverData.value
        });
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

  render(): React.ReactNode {
    const { classes } = this.props;

    return (
      <>
        <Typography variant={'h2'}>Epic tests</Typography>
        <div className={classes.buttons}>
          <ButtonWithConfirmationPopup
            buttonText="Publish"
            confirmationText="Are you sure? This will replace all live tests!"
            onConfirm={this.save}
            icon={<CloudUploadIcon />}
          />

          <ButtonWithConfirmationPopup
            buttonText="Reload data"
            confirmationText="Are you sure? All unpublished data will be lost!"
            onConfirm={() => this.fetchStateFromServer()}
            icon={<RefreshIcon />}
          />
        </div>

        <div>
          <EpicTestsList
            tests={this.state.tests}
            onUpdate={this.onTestsChange}
          />
        </div>
      </>
    )
  }
}

export default withStyles(styles)(EpicTestsForm);
