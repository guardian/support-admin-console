import React from 'react';
import update from 'immutability-helper';
import {createStyles, Theme, withStyles, WithStyles} from "@material-ui/core";
import {Region} from "../../utils/models";
import {
  fetchFrontendSettings,
  FrontendSettingsType,
  saveSupportFrontendSettings,
  SupportFrontendSettingsType
} from "../../utils/requests";

enum UserCohort {
  OnlyExistingSupporters = 'OnlyExistingSupporters',
  OnlyNonSupporters = 'OnlyNonSupporters',
  Everyone = 'Everyone'
}

interface EpicVariant {
  name: string,
  heading: string,
  paragraphs: string[],
  highlightedText?: string,
  footer?: string,
  showTicker: boolean,
  backgroundImageUrl?: string,
  ctaText?: string,
  supportBaseURL?: string
}

interface EpicTest {
  name: string,
  locations: Region[],
  tagIds: string[],
  sections: string[],
  excludedTagIds: string[],
  excludedSections: string[],
  alwaysAsk: boolean,
  userCohort?: UserCohort,
  hasCountryName: boolean,
  variants: EpicVariant[]
}

//Wrapper for the array of tests, as React state must be an object
interface EpicTests {
  tests: EpicTest[]
}

interface DataFromServer {
  value: EpicTest[],
  version: string,
}

const styles = ({ palette, spacing, mixins }: Theme) => createStyles({
});

interface Props extends WithStyles<typeof styles> {}

class EpicTestsForm extends React.Component<Props, EpicTests> {
  state: EpicTests;
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
          tests: serverData.value
        });
      });
  }

  save = () => {
    const newState = update(this.previousStateFromServer, {
      value: { $set: this.state.tests }
    });

    saveSupportFrontendSettings(SupportFrontendSettingsType.contributionTypes, newState)
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

  renderTest(test: EpicTest): React.ReactNode {
    return (
      <div>
        <h3>{test.name}</h3>
        <ul>
          {test.variants.map(variant => <li>{variant.name}</li>)}
        </ul>
      </div>
    )
  }

  //TODO - rendering a form
  render(): React.ReactNode {
    return (
      <div>
        <h2>Epic tests</h2>
        {this.state ? this.state.tests.map(this.renderTest): null}
      </div>
    )
  }
}

export default withStyles(styles)(EpicTestsForm);
