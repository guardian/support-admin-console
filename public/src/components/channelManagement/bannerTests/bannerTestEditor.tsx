import React from 'react';
import {Region} from '../../../utils/models';
import {ArticlesViewedSettings, TestEditorState, UserCohort} from "../helpers/shared";
import {articleCountTemplate} from '../helpers/copyTemplates';
import {
  createStyles,
  Switch,
  Theme,
  Typography,
  WithStyles,
  withStyles,
} from "@material-ui/core";
import {onFieldValidationChange, isNumber} from '../helpers/validation';
import ButtonWithConfirmationPopup from '../buttonWithConfirmationPopup';
import DeleteSweepIcon from '@material-ui/icons/DeleteSweep';
import ArchiveIcon from '@material-ui/icons/Archive';
import {BannerTest, BannerVariant} from "./bannerTestsForm";
import TargetRegionsSelector from "../targetRegionsSelector";
import ArticlesViewedEditor, {defaultArticlesViewedSettings} from "../articlesViewedEditor";
import NewNameCreator from "../newNameCreator";
import BannerTestVariantsList from "./bannerTestVariantsList";
import UserCohortSelector from "../userCohortSelector";
import EditableTextField from "../editableTextField"


const styles = ({ spacing, typography}: Theme) => createStyles({
  container: {
    width: '100%',
    borderTop: `2px solid #999999`,
    marginLeft: spacing(2),
    marginTop: spacing(6)
  },
  formControl: {
    marginTop: spacing(2),
    marginBottom: spacing(1),
    display: 'block',
  },
  h3: {
    fontSize: typography.pxToRem(28),
    fontWeight: typography.fontWeightMedium,
    margin: '10px 0 15px'
  },
  hasChanged: {
    color: 'orange'
  },
  boldHeading: {
    fontSize: typography.pxToRem(17),
    fontWeight: typography.fontWeightBold,
    margin: '20px 0 10px'
  },
  select: {
    minWidth: "460px",
    paddingTop: "10px",
    marginBottom: "20px"
  },
  selectLabel: {
    fontSize: typography.pxToRem(22),
    color: 'black',
  },
  radio: {
    paddingTop: '20px',
    marginBottom: '10px'
  },
  visibilityIcons: {
    marginTop: spacing(1)
  },
  switchWithIcon: {
    display: 'flex'
  },
  visibilityHelperText: {
    marginTop: spacing(1),
    marginLeft: spacing(1)
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end'
  },
  button: {
    marginTop: spacing(2),
    marginLeft: spacing(2),
  },
  isDeleted: {
    color: '#ab0613'
  },
  isArchived: {
    color: '#a1845c'
  },
  switchLabel: {
    marginTop: spacing(0.6),
    marginRight: spacing(6),
    fontSize: typography.pxToRem(18),
  },
  hr: {
    width: '100%',
  }
});

const copyHasTemplate = (test: BannerTest, template: string): boolean => test.variants.some(variant =>
  variant.heading && variant.heading.includes(template) ||
  variant.body.includes(template)
);

interface BannerTestEditorProps extends WithStyles<typeof styles> {
  test?: BannerTest,
  hasChanged: boolean,
  onChange: (updatedTest: BannerTest) => void,
  onValidationChange: (isValid: boolean) => void,
  visible: boolean,
  editMode: boolean,
  onDelete: (testName: string) => void,
  onArchive: (testName: string) => void,
  isDeleted: boolean,
  isArchived: boolean,
  isNew: boolean,
  testNames: string[],
  testNicknames: string[],
  createTest: (newTest: BannerTest) => void
}

const areYouSure = `Are you sure? This can't be undone without cancelling entire edit session!`;

class BannerTestEditor extends React.Component<BannerTestEditorProps, TestEditorState> {

  state: TestEditorState = {
    validationStatus: {}
  };

  isEditable = () => {
    return this.props.editMode && !this.props.isDeleted && !this.props.isArchived;
  }

  getArticlesViewedSettings = (test: BannerTest): ArticlesViewedSettings | undefined => {
    if (!!test.articlesViewedSettings) {
      return test.articlesViewedSettings;
    }
    if (copyHasTemplate(test, articleCountTemplate)) {
      return defaultArticlesViewedSettings
    }
    return undefined;
  }

  updateTest = (update: (test: BannerTest) => BannerTest) => {
    if (this.props.test) {
      const updatedTest = update(this.props.test);

      this.props.onChange({
        ...updatedTest,
        // To save dotcom from having to work this out
        articlesViewedSettings: this.getArticlesViewedSettings(updatedTest),
      })
    }
  }

  copyTest = (newTestName: string, newTestNickname: string): void => {
    if (this.props.test) {
      const newTest: BannerTest = {
        ...this.props.test,
        name: newTestName,
        nickname: newTestNickname,
      };
      this.props.createTest(newTest)
    }
  }

  onVariantsChange = (updatedVariantList: BannerVariant[]): void => {
    if (this.props.test) {
      this.updateTest(test => ({...test, "variants": updatedVariantList}));
    }
  }

  onListChange = (fieldName: string) => (updatedString: string): void => {
    const updatedList = updatedString === '' ? [] : updatedString.split(",");
    this.updateTest(test => ({...test, [fieldName]: updatedList}));
  }

  onSwitchChange = (fieldName: string) => (event: React.ChangeEvent<HTMLInputElement>): void =>  {
    const updatedBool = event.target.checked;
    this.updateTest(test => ({...test, [fieldName]: updatedBool}));
  }

  onUserCohortChange = (selectedCohort: UserCohort): void => {
    this.updateTest(test => ({...test, "userCohort": selectedCohort}));
  }

  onTargetRegionsChange = (selectedRegions: Region[]): void => {
    this.updateTest(test => ({...test, 'locations': selectedRegions}));
  }

  renderBottomButtons = (test: BannerTest) => (
    <div className={this.props.classes.buttons}>
      <div className={this.props.classes.button}>
        <ButtonWithConfirmationPopup
          buttonText="Archive test"
          confirmationText={areYouSure}
          onConfirm={() => this.props.onArchive(test.name)}
          icon={<ArchiveIcon />}
        />
      </div>
      <div className={this.props.classes.button}>
        <ButtonWithConfirmationPopup
          buttonText="Delete test"
          confirmationText={areYouSure}
          onConfirm={() => this.props.onDelete(test.name)}
          icon={<DeleteSweepIcon />}
        />
      </div>
      <div className={this.props.classes.button}>
        <NewNameCreator
          type="test"
          action="Copy"
          existingNames={ this.props.testNames }
          existingNicknames={this.props.testNicknames}
          onValidName={this.copyTest}
          editEnabled={this.props.editMode}
          initialValue={test.name}
        />
      </div>
    </div>
  )

  renderEditor = (test: BannerTest): React.ReactNode => {
    const {classes} = this.props;

    const statusText = () => {
      if (this.props.isDeleted) return <span className={classes.isDeleted}>&nbsp;(to be deleted)</span>;
      else if (this.props.isArchived) return <span className={classes.isArchived}>&nbsp;(to be archived)</span>;
      else if (this.props.isNew) return <span className={classes.hasChanged}>&nbsp;(new)</span>;
      else if (this.props.hasChanged) return <span className={classes.hasChanged}>&nbsp;(modified)</span>;
    };

    return (
      <div className={classes.container}>
        <Typography variant={'h3'} className={classes.h3}>
          {this.props.test && this.props.test.name}
          {statusText()}
        </Typography>
        <Typography variant={'h4'} className={classes.boldHeading}>{this.props.test && this.props.test.nickname}</Typography>

        <div className={classes.switchWithIcon}>
          <Typography className={classes.switchLabel}>Live on theguardian.com</Typography>
          <Switch
            checked={test.isOn}
            onChange={this.onSwitchChange('isOn')}
            disabled={!this.isEditable()}
          />

        </div>

        <hr />

        <Typography variant={'h4'} className={classes.boldHeading}>Variants</Typography>
        <div>
            <BannerTestVariantsList
              variants={test.variants}
              onVariantsListChange={this.onVariantsChange}
              testName={test.name}
              editMode={this.isEditable()}
              onValidationChange={onFieldValidationChange(this)('variantsList')}
            />
        </div>

        <div>
          <Typography variant={'h4'} className={classes.boldHeading}>Display rules</Typography>
          <EditableTextField
            text={test.minArticlesBeforeShowingBanner.toString()}
            onSubmit={(pageViews: string) =>
              this.updateTest(test => ({ ...test, minArticlesBeforeShowingBanner: Number(pageViews)}))
            }
            label={'Show the banner on'}
            helperText="Must be a number"
            editEnabled={this.props.editMode}
            validation={
              {
                getError: (value: string) => isNumber(value) ? null : 'Must be a number',
                onChange: onFieldValidationChange(this)('minArticlesBeforeShowingBanner')
              }
            }
            isNumberField
        />
        <Typography>page views</Typography>
        </div>

        <div>
          <Typography variant={'h4'} className={classes.boldHeading}>Target audience</Typography>

          <TargetRegionsSelector
            regions={test.locations}
            onRegionsUpdate={this.onTargetRegionsChange}
            isEditable={this.isEditable()}
          />

          <UserCohortSelector
            cohort={test.userCohort}
            onCohortsUpdate={this.onUserCohortChange}
            isEditable={this.isEditable()}
          />

          <hr className={classes.hr} />
          <ArticlesViewedEditor
            articlesViewedSettings={test.articlesViewedSettings}
            editMode={this.isEditable()}
            onChange={(articlesViewedSettings?: ArticlesViewedSettings) =>
              this.updateTest(test => ({ ...test, articlesViewedSettings }))
            }
            onValidationChange={onFieldValidationChange(this)('articlesViewedEditor')}
          />

          { this.isEditable() && this.props.test && this.renderBottomButtons(this.props.test) }

        </div>
      </div>
    )
  }

  render(): React.ReactNode {
    return (
      this.props.test ? this.props.visible && this.renderEditor(this.props.test) : null
    )
  }
}

export default withStyles(styles)(BannerTestEditor);
