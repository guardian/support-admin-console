import TestsForm, { InnerComponentProps, updateTest } from "../testEditor";
import React from "react";
import { FrontendSettingsType } from "../../../utils/requests";
import {
  createStyles,
  Theme,
  Typography,
  withStyles,
  WithStyles,
} from "@material-ui/core";
import Sidebar from "../sidebar";
import BannerTestEditor from "./bannerTestEditor";
import StickyBottomBar from "../stickyBottomBar";
import {
  ArticlesViewedSettings,
  Cta,
  Test,
  UserCohort,
} from "../helpers/shared";
import { Region } from "../../../utils/models";

export interface BannerVariant {
  name: string;
  heading?: string;
  body: string;
  highlightedText?: string;
  cta?: Cta;
  secondaryCta?: Cta;
}

export interface BannerTest extends Test {
  name: string;
  nickname?: string;
  isOn: boolean;
  minArticlesBeforeShowingBanner: number;
  userCohort: UserCohort;
  locations: Region[];
  variants: BannerVariant[];
  articlesViewedSettings?: ArticlesViewedSettings;
}

const createDefaultBannerTest = (
  newTestName: string,
  newTestNickname: string
) => ({
  name: newTestName,
  nickname: newTestNickname,
  isOn: false,
  minArticlesBeforeShowingBanner: 0,
  userCohort: UserCohort.AllNonSupporters,
  locations: [],
  variants: [],
  articlesViewedSettings: undefined,
});

const styles = ({ spacing, typography }: Theme) =>
  createStyles({
    testListAndEditor: {
      display: "flex",
      padding: spacing(1),
    },
    viewTextContainer: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      marginTop: "-50px",
    },
    viewText: {
      fontSize: typography.pxToRem(16),
    },
    editModeBorder: {
      border: "none",
    },
    h2: {
      fontSize: "3rem",
    },
    body: {
      display: "flex",
      width: "100%",
      height: "100%",
    },
    leftCol: {
      height: "100%",
      background: "white",
      paddingTop: spacing(6),
      paddingLeft: spacing(6),
      paddingRight: spacing(6),
    },
    rightCol: {
      flexGrow: 1,
      display: "flex",
      justifyContent: "center",
    },
  });

interface Props
  extends InnerComponentProps<BannerTest>,
    WithStyles<typeof styles> {}

const BannerTestsForm: React.FC<Props> = ({
  classes,
  tests,
  modifiedTests,
  selectedTestName,
  onTestsChange,
  onSelectedTestName,
  onTestDelete,
  onTestArchive,
  onTestErrorStatusChange,
  requestLock,
  save,
  cancel,
  editMode,
}) => {
  const createTest = (name: string, nickname: string) => {
    const newTests = [...tests, createDefaultBannerTest(name, nickname)];
    onTestsChange(newTests, name);
  };

  return (
    <>
      <div className={classes.body}>
        <div className={classes.leftCol}>
          <Sidebar<BannerTest>
            tests={tests}
            modifiedTests={modifiedTests}
            selectedTestName={selectedTestName}
            onUpdate={onTestsChange}
            onSelectedTestName={onSelectedTestName}
            createTest={createTest}
            isInEditMode={editMode}
          />
        </div>

        <div className={classes.rightCol}>
          {selectedTestName ? (
            tests.map((test) => (
              <BannerTestEditor
                test={tests.find((test) => test.name === selectedTestName)}
                hasChanged={!!modifiedTests[test.name]}
                onChange={(updatedTest) =>
                  onTestsChange(
                    updateTest(tests, updatedTest),
                    updatedTest.name
                  )
                }
                onValidationChange={onTestErrorStatusChange(test.name)}
                visible={test.name === selectedTestName}
                key={test.name}
                editMode={editMode}
                onDelete={onTestDelete}
                onArchive={onTestArchive}
                isDeleted={
                  modifiedTests[test.name] && modifiedTests[test.name].isDeleted
                }
                isArchived={
                  modifiedTests[test.name] &&
                  modifiedTests[test.name].isArchived
                }
                isNew={
                  modifiedTests[test.name] && modifiedTests[test.name].isNew
                }
                createTest={(newTest: BannerTest) => {
                  const newTests = [...tests, newTest];
                  onTestsChange(newTests, newTest.name);
                }}
                testNames={tests.map((test) => test.name)}
                testNicknames={
                  tests
                    .map((test) => test.nickname)
                    .filter((nickname) => !!nickname) as string[]
                }
              />
            ))
          ) : (
            <div className={classes.viewTextContainer}>
              <Typography className={classes.viewText}>
                Select an existing test from the menu,
              </Typography>
              <Typography className={classes.viewText}>
                or create a new one
              </Typography>
            </div>
          )}
        </div>
      </div>

      <StickyBottomBar
        isInEditMode={editMode}
        hasTestSelected={selectedTestName !== undefined}
        requestLock={requestLock}
        save={save}
        cancel={cancel}
      />
    </>
  );
};

const styled = withStyles(styles)(BannerTestsForm);
export default TestsForm(styled, FrontendSettingsType.bannerTests);
