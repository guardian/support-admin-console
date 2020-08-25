import React from "react";
import { Region } from "../../../utils/models";
import { ArticlesViewedSettings, UserCohort } from "../helpers/shared";
import { articleCountTemplate } from "../helpers/copyTemplates";
import {
  createStyles,
  Theme,
  Typography,
  WithStyles,
  withStyles,
} from "@material-ui/core";
import { BannerTest, BannerVariant } from "./bannerTestsForm";
import TargetRegionsSelector from "../targetRegionsSelector";
import ArticlesViewedEditor, {
  defaultArticlesViewedSettings,
} from "../articlesViewedEditor";
import BannerTestVariantsEditor from "./bannerTestVariantsEditor";
import UserCohortSelector from "../userCohortSelector";
import TestEditorHeader from "../testEditorHeader";
import TestEditorLiveSwitch from "../testEditorLiveSwitch";
import TestEditorMinArticlesViewedInput from "../testEditorMinArticlesViewedInput";
import useValidation from "../hooks/useValidation";

const styles = ({ spacing, palette, typography }: Theme) =>
  createStyles({
    container: {
      width: "100%",
      height: "max-content",
      background: "#FFFFFF",
      paddingTop: spacing(6),
      paddingRight: spacing(12),
    },
    headerAndSwitchContainer: {
      paddingBottom: spacing(3),
      borderBottom: `1px solid ${palette.grey[500]}`,

      "& > * + *": {
        marginTop: spacing(2),
      },
    },
    sectionContainer: {
      paddingTop: spacing(1),
      paddingBottom: spacing(6),
      borderBottom: `1px solid ${palette.grey[500]}`,

      "& > * + *": {
        marginTop: spacing(4),
      },
    },
    sectionHeader: {
      fontSize: 16,
      fontWeight: 500,
      color: palette.grey[700],
    },
  });

const copyHasTemplate = (test: BannerTest, template: string): boolean =>
  test.variants.some(
    (variant) =>
      (variant.heading && variant.heading.includes(template)) ||
      variant.body.includes(template)
  );

interface BannerTestEditorProps extends WithStyles<typeof styles> {
  test: BannerTest;
  hasChanged: boolean;
  onChange: (updatedTest: BannerTest) => void;
  onValidationChange: (isValid: boolean) => void;
  visible: boolean;
  editMode: boolean;
  onDelete: (testName: string) => void;
  onArchive: (testName: string) => void;
  isDeleted: boolean;
  isArchived: boolean;
  isNew: boolean;
  testNames: string[];
  testNicknames: string[];
  createTest: (newTest: BannerTest) => void;
}

const BannerTestEditor: React.FC<BannerTestEditorProps> = ({
  classes,
  test,
  onChange,
  onValidationChange,
  visible,
  editMode,
  isDeleted,
  isArchived,
  createTest,
}: BannerTestEditorProps) => {
  const isEditable = () => {
    return editMode && !isDeleted && !isArchived;
  };

  const setValidationStatusForField = useValidation(onValidationChange);

  const onVariantsListValidationChange = (isValid: boolean) =>
    setValidationStatusForField("variantsList", isValid);

  const onMinArticlesViewedValidationChanged = (isValid: boolean) =>
    setValidationStatusForField("minArticlesViewed", isValid);

  const getArticlesViewedSettings = (
    test: BannerTest
  ): ArticlesViewedSettings | undefined => {
    if (!!test.articlesViewedSettings) {
      return test.articlesViewedSettings;
    }
    if (copyHasTemplate(test, articleCountTemplate)) {
      return defaultArticlesViewedSettings;
    }
    return undefined;
  };

  const updateTest = (updatedTest: BannerTest) => {
    onChange({
      ...updatedTest,
      // To save dotcom from having to work this out
      articlesViewedSettings: getArticlesViewedSettings(updatedTest),
    });
  };

  const copyTest = (newTestName: string, newTestNickname: string): void => {
    if (test) {
      const newTest: BannerTest = {
        ...test,

        name: newTestName,
        nickname: newTestNickname,
      };
      createTest(newTest);
    }
  };

  const onVariantsChange = (updatedVariantList: BannerVariant[]): void => {
    updateTest({ ...test, variants: updatedVariantList });

    // if (test) {

    //   updateTest((test) => ({ ...test, variants: updatedVariantList }));
    // }
  };

  const onListChange = (fieldName: string) => (updatedString: string): void => {
    const updatedList = updatedString === "" ? [] : updatedString.split(",");
    // updateTest((test) => ({ ...test, [fieldName]: updatedList }));
  };

  const onLiveSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // updateTest((test) => ({ ...test, isOn: event.target.checked }));
  };

  const onUserCohortChange = (selectedCohort: UserCohort): void => {
    // updateTest((test) => ({ ...test, userCohort: selectedCohort }));
  };

  const onTargetRegionsChange = (selectedRegions: Region[]): void => {
    // updateTest((test) => ({ ...test, locations: selectedRegions }));
  };

  if (test && visible) {
    return (
      <div className={classes.container}>
        <div className={classes.headerAndSwitchContainer}>
          <TestEditorHeader name={test.name} nickname={test.nickname} />

          <TestEditorLiveSwitch
            isChecked={test.isOn}
            isDisabled={!isEditable()}
            onChange={onLiveSwitchChange}
          />
        </div>

        <div className={classes.sectionContainer}>
          <Typography variant={"h3"} className={classes.sectionHeader}>
            Variants
          </Typography>
          <div>
            <BannerTestVariantsEditor
              variants={test.variants}
              onVariantsListChange={onVariantsChange}
              testName={test.name}
              editMode={isEditable()}
              onValidationChange={onVariantsListValidationChange}
            />
          </div>
        </div>

        <div className={classes.sectionContainer}>
          <Typography variant={"h3"} className={classes.sectionHeader}>
            Display rules
          </Typography>

          <TestEditorMinArticlesViewedInput
            minArticles={test.minArticlesBeforeShowingBanner}
            isDisabled={!isEditable()}
            onValidationChange={onMinArticlesViewedValidationChanged}
          />
        </div>

        <div>
          <Typography variant={"h4"} className={classes.sectionHeader}>
            Target audience
          </Typography>

          <TargetRegionsSelector
            regions={test.locations}
            onRegionsUpdate={onTargetRegionsChange}
            isEditable={isEditable()}
          />

          <UserCohortSelector
            cohort={test.userCohort}
            onCohortsUpdate={onUserCohortChange}
            isEditable={isEditable()}
          />

          <ArticlesViewedEditor
            articlesViewedSettings={test.articlesViewedSettings}
            editMode={isEditable()}
            onChange={() => null}
            // onChange={(articlesViewedSettings?: ArticlesViewedSettings) =>
            //   updateTest((test) => ({ ...test, articlesViewedSettings }))
            // }
            // onValidationChange={onFieldValidationChange(this)('articlesViewedEditor')}
            onValidationChange={() => null}
          />
        </div>
      </div>
    );
  }
  return null;
};

export default withStyles(styles)(BannerTestEditor);
