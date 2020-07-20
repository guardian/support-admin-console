import TestsForm, {InnerComponentProps, updateTest} from "../testEditor";
import React from "react";
import {FrontendSettingsType} from "../../../utils/requests";
import {createStyles, Theme, Typography, withStyles, WithStyles} from "@material-ui/core";
import TestsList from "../testsList";
import BannerTestEditor from "./bannerTestEditor";
import {ArticlesViewedSettings, Cta, Test, UserCohort} from "../helpers/shared";
import {Region} from "../../../utils/models";

export interface BannerVariant {
  name: string,
  heading?: string,
  body: string,
  highlightedText?: string,
  cta?: Cta,
  secondaryCta?: Cta,
}

export interface BannerTest extends Test {
  name: string,
  nickname?: string,
  isOn: boolean,
  minArticlesBeforeShowingBanner: number,
  userCohort: UserCohort,
  locations: Region[],
  variants: BannerVariant[],
  articlesViewedSettings?: ArticlesViewedSettings,
}

const createDefaultBannerTest = (newTestName: string, newTestNickname: string) => ({
  name: newTestName,
  nickname: newTestNickname,
  isOn: false,
  minArticlesBeforeShowingBanner: 0,
  userCohort: UserCohort.AllNonSupporters,
  locations: [],
  variants: [],
  articlesViewedSettings: undefined,
});

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
    border: 'none',
  },
  readOnlyModeBorder: {
    border: "4px solid #dcdcdc"
  },
  h2: {
    fontSize: '3rem'
  }
});

interface Props extends InnerComponentProps<BannerTest>, WithStyles<typeof styles> {}

class BannerTestsForm extends React.Component<Props> {
  render() {
    const { classes } = this.props;
    const listAndEditorClassNames = [
      classes.testListAndEditor,
      this.props.editMode && classes.editModeBorder,
      !this.props.editMode && classes.readOnlyModeBorder
    ].join(' ');

    return (
      <>
      <h3>🚧 Our Banner Tool is still under construction and is not yet ready for use. 🚧</h3>
      <div className={listAndEditorClassNames}>
        <TestsList<BannerTest>
          tests={this.props.tests}
          modifiedTests={this.props.modifiedTests}
          selectedTestName={this.props.selectedTestName}
          onUpdate={this.props.onTestsChange}
          createDefaultTest={createDefaultBannerTest}
          onSelectedTestName={this.props.onSelectedTestName}
          editMode={this.props.editMode}
        />

        {this.props.selectedTestName ? this.props.tests.map(test =>
          (<BannerTestEditor
            test={this.props.tests.find(test => test.name === this.props.selectedTestName)}
            hasChanged={!!this.props.modifiedTests[test.name]}
            onChange={updatedTest =>
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
            isDeleted={this.props.modifiedTests[test.name] && this.props.modifiedTests[test.name].isDeleted}
            isArchived={this.props.modifiedTests[test.name] && this.props.modifiedTests[test.name].isArchived}
            isNew={this.props.modifiedTests[test.name] && this.props.modifiedTests[test.name].isNew}
            createTest={(newTest: BannerTest) => {
              const newTests = [...this.props.tests, newTest];
              this.props.onTestsChange(newTests, newTest.name)
            }}
            testNames={this.props.tests.map(test => test.name)}
            testNicknames={
              this.props.tests
                .map(test => test.nickname)
                .filter(nickname => !!nickname) as string[]
            }
          />)
        ) : (
          <Typography className={classes.viewText}>Click on a test on the left to view contents.</Typography>
        )}
      </div>
      </>
    )
  }
}

const styled = withStyles(styles)(BannerTestsForm);
export default TestsForm(styled, FrontendSettingsType.bannerTests)
