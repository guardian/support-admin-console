import React from "react";
import { Region } from "../../../utils/models";
import {
  ArticlesViewedSettings,
  TestEditorState,
  UserCohort,
} from "../helpers/shared";
import { articleCountTemplate } from "../helpers/copyTemplates";
import {
  createStyles,
  Switch,
  Theme,
  Typography,
  WithStyles,
  withStyles,
} from "@material-ui/core";
import { isNumber } from "../helpers/validation";
import ButtonWithConfirmationPopup from "../buttonWithConfirmationPopup";
import DeleteSweepIcon from "@material-ui/icons/DeleteSweep";
import ArchiveIcon from "@material-ui/icons/Archive";
import { BannerTest, BannerVariant } from "./bannerTestsForm";
import TargetRegionsSelector from "../targetRegionsSelector";
import ArticlesViewedEditor, {
  defaultArticlesViewedSettings,
} from "../articlesViewedEditor";
import NewNameCreator from "../newNameCreator";
import BannerTestVariantsEditor from "./bannerTestVariantsEditor";
import UserCohortSelector from "../userCohortSelector";
import EditableTextField from "../editableTextField";
import TestEditorHeader from "../testEditorHeader";
import TestEditorLiveSwitch from "../testEditorLiveSwitch";
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
    variantsContainer: {
      paddingTop: spacing(1),
      paddingBottom: spacing(6),
      borderBottom: `1px solid ${palette.grey[500]}`,

      "& > * + *": {
        marginTop: spacing(4),
      },
    },
    formControl: {
      marginTop: spacing(2),
      marginBottom: spacing(1),
      display: "block",
    },
    h3: {
      fontSize: typography.pxToRem(28),
      fontWeight: typography.fontWeightMedium,
      margin: "10px 0 15px",
    },
    hasChanged: {
      color: "orange",
    },
    sectionHeader: {
      fontSize: 16,
      fontWeight: 500,
      color: palette.grey[700],
    },
    select: {
      minWidth: "460px",
      paddingTop: "10px",
      marginBottom: "20px",
    },
    selectLabel: {
      fontSize: typography.pxToRem(22),
      color: "black",
    },
    radio: {
      paddingTop: "20px",
      marginBottom: "10px",
    },
    visibilityIcons: {
      marginTop: spacing(1),
    },
    switchWithIcon: {
      display: "flex",
    },
    visibilityHelperText: {
      marginTop: spacing(1),
      marginLeft: spacing(1),
    },
    buttons: {
      display: "flex",
      justifyContent: "flex-end",
    },
    button: {
      marginTop: spacing(2),
      marginLeft: spacing(2),
    },
    isDeleted: {
      color: "#ab0613",
    },
    isArchived: {
      color: "#a1845c",
    },
    switchLabel: {
      marginTop: spacing(0.6),
      marginRight: spacing(6),
      fontSize: typography.pxToRem(18),
    },
    hr: {
      width: "100%",
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

const areYouSure = `Are you sure? This can't be undone without cancelling entire edit session!`;

const BannerTestEditor: React.FC<BannerTestEditorProps> = (
  props: BannerTestEditorProps
) => {
  const isEditable = () => {
    return props.editMode && !props.isDeleted && !props.isArchived;
  };

  const setValidationStatusForField = useValidation(props.onValidationChange);

  const onVariantsListValidationChange = (isValid: boolean) =>
    setValidationStatusForField("variantsList", isValid);

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
    props.onChange({
      ...updatedTest,
      // To save dotcom from having to work this out
      articlesViewedSettings: getArticlesViewedSettings(updatedTest),
    });
  };

  const copyTest = (newTestName: string, newTestNickname: string): void => {
    if (props.test) {
      const newTest: BannerTest = {
        ...props.test,
        name: newTestName,
        nickname: newTestNickname,
      };
      props.createTest(newTest);
    }
  };

  const onVariantsChange = (updatedVariantList: BannerVariant[]): void => {
    updateTest({ ...props.test, variants: updatedVariantList });
    // if (props.test) {
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

  interface BottomButtonsProps {
    test: BannerTest;
  }

  const BottomButtons = ({ test }: BottomButtonsProps) => (
    <div className={props.classes.buttons}>
      <div className={props.classes.button}>
        <ButtonWithConfirmationPopup
          buttonText="Archive test"
          confirmationText={areYouSure}
          onConfirm={() => props.onArchive(test.name)}
          icon={<ArchiveIcon />}
        />
      </div>
      <div className={props.classes.button}>
        <ButtonWithConfirmationPopup
          buttonText="Delete test"
          confirmationText={areYouSure}
          onConfirm={() => props.onDelete(test.name)}
          icon={<DeleteSweepIcon />}
        />
      </div>
      <div className={props.classes.button}>
        <NewNameCreator
          type="test"
          action="Copy"
          existingNames={props.testNames}
          existingNicknames={props.testNicknames}
          onValidName={copyTest}
          editEnabled={props.editMode}
          initialValue={test.name}
        />
      </div>
    </div>
  );

  interface EditorProps {
    test: BannerTest;
  }

  const Editor = ({ test }: EditorProps) => {
    const { classes } = props;

    const statusText = () => {
      if (props.isDeleted)
        return <span className={classes.isDeleted}>&nbsp;(to be deleted)</span>;
      else if (props.isArchived)
        return (
          <span className={classes.isArchived}>&nbsp;(to be archived)</span>
        );
      else if (props.isNew)
        return <span className={classes.hasChanged}>&nbsp;(new)</span>;
      else if (props.hasChanged)
        return <span className={classes.hasChanged}>&nbsp;(modified)</span>;
    };

    return (
      <div className={classes.container}>
        <div className={classes.headerAndSwitchContainer}>
          <TestEditorHeader
            name={props.test.name}
            nickname={props.test.nickname}
          />

          <TestEditorLiveSwitch
            isChecked={test.isOn}
            isDisabled={!isEditable()}
            onChange={onLiveSwitchChange}
          />
        </div>

        <div className={classes.variantsContainer}>
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

        <div>
          <Typography variant={"h4"} className={classes.sectionHeader}>
            Display rules
          </Typography>
          <EditableTextField
            text={test.minArticlesBeforeShowingBanner.toString()}
            onSubmit={() => {
              null;
            }}
            // onSubmit={(pageViews: string) =>
            //   updateTest((test) => ({
            //     ...test,
            //     minArticlesBeforeShowingBanner: Number(pageViews),
            //   }))
            // }
            label={"Show the banner on"}
            helperText="Must be a number"
            editEnabled={props.editMode}
            validation={{
              getError: (value: string) =>
                isNumber(value) ? null : "Must be a number",
              // onChange: onFieldValidationChange(this)('minArticlesBeforeShowingBanner')
              onChange: () => null,
            }}
            isNumberField
          />
          <Typography>page views</Typography>
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

          <hr className={classes.hr} />
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

          {isEditable() && props.test && <BottomButtons test={props.test} />}
        </div>
      </div>
    );
  };

  if (props.test && props.visible) {
    return <Editor test={props.test} />;
  }
  return null;
};

export default withStyles(styles)(BannerTestEditor);
