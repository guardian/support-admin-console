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

interface DataFromServer {
  value: EpicTest[],
  version: string,
}

const styles = ({ palette, spacing, mixins }: Theme) => createStyles({
});

interface Props extends WithStyles<typeof styles> {}

class EpicTestsForm extends React.Component<Props, EpicTest[]> {
  state: EpicTest[];
  previousStateFromServer: DataFromServer | null;

  constructor(props: Props) {
    super(props);
    this.state = [];
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
      value: { $set: this.state }
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

  //TODO - rendering a form
  render(): React.ReactNode {
    return (
      <div>Epic tests</div>
    )
  }
}

export default withStyles(styles)(EpicTestsForm);
