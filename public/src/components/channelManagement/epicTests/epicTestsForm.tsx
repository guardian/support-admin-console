import React from "react";
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles,
  Typography,
} from "@material-ui/core";
import EpicTestEditor from "./epicTestEditor";
import { Region } from "../../../utils/models";

import TestsList from "../testList";
import {
  UserCohort,
  Cta,
  ArticlesViewedSettings,
  Test,
} from "../helpers/shared";
import { InnerComponentProps, updateTest } from "../testEditor";
import TestsForm from "../testEditor";
import { FrontendSettingsType } from "../../../utils/requests";
import { MaxEpicViewsDefaults } from "./maxEpicViewsEditor";

export enum TickerEndType {
  unlimited = "unlimited",
  hardstop = "hardstop",
}
export enum TickerCountType {
  money = "money",
  people = "people",
}
interface TickerCopy {
  countLabel: string;
  goalReachedPrimary: string;
  goalReachedSecondary: string;
}
export interface TickerSettings {
  endType: TickerEndType;
  countType: TickerCountType;
  currencySymbol: string;
  copy: TickerCopy;
}
export interface EpicVariant {
  name: string;
  heading?: string;
  paragraphs: string[];
  highlightedText?: string;
  footer?: string;
  showTicker: boolean;
  tickerSettings?: TickerSettings;
  backgroundImageUrl?: string;
  cta?: Cta;
  secondaryCta?: Cta;
}

export interface MaxEpicViews {
  maxViewsCount: number;
  maxViewsDays: number;
  minDaysBetweenViews: number;
}

export interface EpicTest extends Test {
  name: string;
  nickname?: string;
  isOn: boolean;
  locations: Region[];
  tagIds: string[];
  sections: string[];
  excludedTagIds: string[];
  excludedSections: string[];
  alwaysAsk: boolean;
  maxViews?: MaxEpicViews;
  userCohort?: UserCohort;
  isLiveBlog: boolean;
  hasCountryName: boolean;
  variants: EpicVariant[];
  highPriority: boolean; // has been removed from form, but might be used in future
  useLocalViewLog: boolean;
  articlesViewedSettings?: ArticlesViewedSettings;
}

const createDefaultEpicTest = (
  newTestName: string,
  newTestNickname: string
): EpicTest => ({
  name: newTestName,
  nickname: newTestNickname,
  isOn: false,
  locations: [],
  tagIds: [],
  sections: [],
  excludedTagIds: [],
  excludedSections: [],
  alwaysAsk: false,
  maxViews: MaxEpicViewsDefaults,
  userCohort: UserCohort.AllNonSupporters, // matches the default in dotcom
  isLiveBlog: false,
  hasCountryName: false,
  variants: [],
  highPriority: false, // has been removed from form, but might be used in future
  useLocalViewLog: false,
});

const styles = ({ spacing, typography }: Theme) =>
  createStyles({
    testListAndEditor: {
      display: "flex",
      padding: spacing(1),
    },
    viewText: {
      marginTop: spacing(6),
      marginLeft: spacing(2),
      fontSize: typography.pxToRem(16),
    },
    editModeBorder: {
      border: "4px solid #ffe500",
    },
    readOnlyModeBorder: {
      border: "4px solid #dcdcdc",
    },
    h2: {
      fontSize: "3rem",
    },
  });

interface Props
  extends InnerComponentProps<EpicTest>,
    WithStyles<typeof styles> {}

class EpicTestsForm extends React.Component<Props> {
  render(): React.ReactNode {
    const { classes } = this.props;
    const listAndEditorClassNames = [
      classes.testListAndEditor,
      this.props.editMode && classes.editModeBorder,
      !this.props.editMode && classes.readOnlyModeBorder,
    ].join(" ");

    return (
      <div className={listAndEditorClassNames}>
        <TestsList<EpicTest>
          tests={this.props.tests}
          isInEditMode={this.props.editMode}
        />

        {this.props.selectedTestName ? (
          this.props.tests.map((test) => (
            <EpicTestEditor
              test={this.props.tests.find(
                (test) => test.name === this.props.selectedTestName
              )}
              hasChanged={!!this.props.modifiedTests[test.name]}
              onChange={(updatedTest) =>
                this.props.onTestsChange(
                  updateTest(this.props.tests, updatedTest),
                  updatedTest.name
                )
              }
              onValidationChange={this.props.onTestErrorStatusChange(test.name)}
              visible={test.name === this.props.selectedTestName}
              key={test.name}
              editMode={this.props.editMode}
              onDelete={this.props.onTestDelete}
              onArchive={this.props.onTestArchive}
              isDeleted={
                this.props.modifiedTests[test.name] &&
                this.props.modifiedTests[test.name].isDeleted
              }
              isArchived={
                this.props.modifiedTests[test.name] &&
                this.props.modifiedTests[test.name].isArchived
              }
              isNew={
                this.props.modifiedTests[test.name] &&
                this.props.modifiedTests[test.name].isNew
              }
              createTest={(newTest: EpicTest) => {
                const newTests = [...this.props.tests, newTest];
                this.props.onTestsChange(newTests, newTest.name);
              }}
              testNames={this.props.tests.map((test) => test.name)}
              testNicknames={
                this.props.tests
                  .map((test) => test.nickname)
                  .filter((nickname) => !!nickname) as string[]
              }
            />
          ))
        ) : (
          <Typography className={classes.viewText}>
            Click on a test on the left to view contents.
          </Typography>
        )}
      </div>
    );
  }
}

const styled = withStyles(styles)(EpicTestsForm);
export default TestsForm(styled, FrontendSettingsType.epicTests);
