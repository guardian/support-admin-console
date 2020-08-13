import TestsForm, { InnerComponentProps, updateTest } from "../testEditor";
import React from "react";
import { FrontendSettingsType } from "../../../utils/requests";
import Sidebar from "../sidebar";
import BannerTestEditor from "./bannerTestEditor";
import TestsFormLayout from "../testsFormLayout";
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

type Props = InnerComponentProps<BannerTest>;

const BannerTestsForm: React.FC<Props> = ({
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

  const selectedTest = tests.find((t) => t.name === selectedTestName);

  return (
    <TestsFormLayout
      sidebar={
        <Sidebar<BannerTest>
          tests={tests}
          modifiedTests={modifiedTests}
          selectedTestName={selectedTestName}
          onUpdate={onTestsChange}
          onSelectedTestName={onSelectedTestName}
          createTest={createTest}
          isInEditMode={editMode}
        />
      }
      testEditor={
        // needed to convince typescript neither are undefined
        selectedTestName && selectedTest ? (
          <BannerTestEditor
            test={selectedTest}
            hasChanged={!!modifiedTests[selectedTestName]}
            onChange={(updatedTest) =>
              onTestsChange(updateTest(tests, updatedTest), updatedTest.name)
            }
            onValidationChange={onTestErrorStatusChange(selectedTestName)}
            visible
            editMode={editMode}
            onDelete={onTestDelete}
            onArchive={onTestArchive}
            isDeleted={
              modifiedTests[selectedTestName] &&
              modifiedTests[selectedTestName].isDeleted
            }
            isArchived={
              modifiedTests[selectedTestName] &&
              modifiedTests[selectedTestName].isArchived
            }
            isNew={
              modifiedTests[selectedTestName] &&
              modifiedTests[selectedTestName].isNew
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
        ) : null
      }
      selectedTestName={selectedTestName}
      requestLock={requestLock}
      save={save}
      cancel={cancel}
      editMode={editMode}
    />
  );
};

export default TestsForm(BannerTestsForm, FrontendSettingsType.bannerTests);
