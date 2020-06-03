import React from 'react';
// import update from 'immutability-helper';
import {createStyles, Theme, withStyles, WithStyles, Typography} from "@material-ui/core";
// import EpicTestEditor from './epicTestEditor';
// import EpicTestActionBar from './epicTestActionBar';
// import CircularProgress from '@material-ui/core/CircularProgress';
import {Region} from "../../utils/models";
// import {
//   fetchFrontendSettings,
//   FrontendSettingsType,
//   saveFrontendSettings,
//   requestLock,
//   requestTakeControl,
//   requestUnlock,
//   archiveEpicTest
// } from "../../utils/requests";
import BannerTestsList from "./BannerTestsList";
import { UserCohort, Cta, ArticlesViewedSettings} from ".././epicTests/epicTestsForm";
import NewNameCreator from '.././epicTests/newNameCreator';



export interface BannerVariant {
  name: string,
  headline?: string,
  body: string,
  highlightedText: string,
  cta?: Cta,
  secondaryCta?: Cta,
  hasTicker: boolean,
}

export enum OphanProduct {
  CONTRIBUTION = 'CONTRIBUTION',
  RECURRING_CONTRIBUTION = 'RECURRING_CONTRIBUTION',
  MEMBERSHIP_SUPPORTER = 'MEMBERSHIP_SUPPORTER',
  MEMBERSHIP_PATRON = 'MEMBERSHIP_PATRON',
  MEMBERSHIP_PARTNER = 'MEMBERSHIP_PARTNER',
  DIGITAL_SUBSCRIPTION = 'DIGITAL_SUBSCRIPTION',
  PRINT_SUBSCRIPTION = 'PRINT_SUBSCRIPTION',
}

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


class BannerTestsForm extends React.Component {

  createBannerTest = () => undefined;

  render(): React.ReactNode {

    return (
      <NewNameCreator
        text="test"
        existingNames={[]}
        onValidName={this.createBannerTest}
      />
    );
  }

}

// export default withStyles(styles)(BannerTestsForm);
export default BannerTestsForm;
