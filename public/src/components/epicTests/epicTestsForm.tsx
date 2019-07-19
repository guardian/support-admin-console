import React from 'react';
import update from 'immutability-helper';
import {createStyles, Theme, withStyles, WithStyles} from "@material-ui/core";
import {Region} from "../../utils/models";
import {
  fetchFrontendSettings,
  FrontendSettingsType,
  saveFrontendSettings,
} from "../../utils/requests";
import EpicTestsList from "./epicTestsList"
import EpicTestEditor from "./epicTestEditor"
import SaveIcon from '@material-ui/icons/Save';
import RefreshIcon from '@material-ui/icons/Refresh';
import Button from "@material-ui/core/Button";

export enum UserCohort {
  OnlyExistingSupporters = 'OnlyExistingSupporters',
  OnlyNonSupporters = 'OnlyNonSupporters',
  Everyone = 'Everyone'
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

type EpicTestsFormState = EpicTests & {
  selectedTestName?: string
}

const styles = ({ palette, spacing, mixins }: Theme) => createStyles({
  container: {
    display: "flex"
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

interface Props extends WithStyles<typeof styles> {}

class EpicTestsForm extends React.Component<Props, EpicTestsFormState> {
  state: EpicTestsFormState;
  previousStateFromServer: DataFromServer | null;

  constructor(props: Props) {
    super(props);
    this.state = {tests: []};
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
  }

  save = () => {
    const newState = update(this.previousStateFromServer, {
      value: {
        tests: { $set: this.state.tests }
      }
    });
    console.log("UPDATING", newState)

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

  onTestSelected = (testName: string): void => {
    this.setState({
      selectedTestName: testName
    })
  };

  onTestChange = (updatedTest: EpicTest): void => {
    console.log(updatedTest)
    const updatedTests = this.state.tests.map(test => test.name === updatedTest.name ? updatedTest : test);
    this.setState({
      tests: updatedTests
    });
  };

  render(): React.ReactNode {
    const { classes } = this.props;

    return (
      <div>
        <h2>Epic tests</h2>
        <div className={classes.buttons}>
          <Button variant="contained" onClick={this.save} className={classes.button}>
            <SaveIcon />
            Publish
          </Button>
          <Button variant="contained" onClick={() => this.fetchStateFromServer()} className={classes.button}>
            <RefreshIcon />
            Refresh
          </Button>
        </div>

        <div className={classes.container}>
          <EpicTestsList
            testNames={this.state.tests.map(test => test.name)}
            onTestSelected={this.onTestSelected}
            selectedTestName={this.state.selectedTestName}
          />
          <EpicTestEditor
            test={this.state.selectedTestName ? this.state.tests.find(test => test.name === this.state.selectedTestName) : undefined}
            onChange={this.onTestChange}
          />
        </div>
      </div>
    )
  }
}

export default withStyles(styles)(EpicTestsForm);
