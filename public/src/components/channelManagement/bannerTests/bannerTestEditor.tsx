import React from 'react';
import { Region } from '../../../utils/models';
import { ArticlesViewedSettings, UserCohort } from '../helpers/shared';
import { articleCountTemplate } from '../helpers/copyTemplates';
import { createStyles, Theme, Typography, WithStyles, withStyles } from '@material-ui/core';
import BannerTestVariantEditor from './bannerTestVariantEditor';
import TestVariantsEditor from '../testVariantsEditor';
import TestEditorHeader from '../testEditorHeader';
import TestEditorMinArticlesViewedInput from '../testEditorMinArticlesViewedInput';
import TestEditorTargetAudienceSelector from '../testEditorTargetAudienceSelector';
import TestEditorArticleCountEditor, {
  DEFAULT_ARTICLES_VIEWED_SETTINGS,
} from '../testEditorArticleCountEditor';
import TestEditorActionButtons from '../testEditorActionButtons';
import LiveSwitch from '../../shared/liveSwitch';
import useValidation from '../hooks/useValidation';
import { BannerContent, BannerTest, BannerVariant } from '../../../models/banner';
import { getDefaultVariant } from './utils/defaults';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const styles = ({ spacing, palette }: Theme) =>
  createStyles({
    container: {
      width: '100%',
      height: 'max-content',
      background: '#FFFFFF',
      paddingTop: spacing(6),
      paddingRight: spacing(12),
      paddingLeft: spacing(3),
    },
    headerAndSwitchContainer: {
      paddingBottom: spacing(3),
      borderBottom: `1px solid ${palette.grey[500]}`,

      '& > * + *': {
        marginTop: spacing(2),
      },
    },
    sectionContainer: {
      paddingTop: spacing(1),
      paddingBottom: spacing(6),
      borderBottom: `1px solid ${palette.grey[500]}`,

      '& > * + *': {
        marginTop: spacing(4),
      },
    },
    sectionHeader: {
      fontSize: 16,
      fontWeight: 500,
      color: palette.grey[700],
    },
    buttonsContainer: {
      paddingTop: spacing(4),
      paddingBottom: spacing(12),
    },
  });

const copyHasTemplate = (content: BannerContent, template: string): boolean =>
  (content.heading && content.heading.includes(template)) || content.messageText.includes(template);
const testCopyHasTemplate = (test: BannerTest, template: string): boolean =>
  test.variants.some(
    variant =>
      (variant.bannerContent && copyHasTemplate(variant.bannerContent, template)) ||
      (variant.mobileBannerContent && copyHasTemplate(variant.mobileBannerContent, template)),
  );

interface BannerTestEditorProps extends WithStyles<typeof styles> {
  test: BannerTest;
  hasChanged: boolean;
  onChange: (updatedTest: BannerTest) => void;
  onValidationChange: (isValid: boolean) => void;
  visible: boolean;
  editMode: boolean;
  onDelete: () => void;
  onArchive: () => void;
  onTestSelected: (testName: string) => void;
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
  onArchive,
  onDelete,
  onTestSelected,
  testNames,
  testNicknames,
  createTest,
}: BannerTestEditorProps) => {
  const setValidationStatusForField = useValidation(onValidationChange);

  const onMinArticlesViewedValidationChanged = (isValid: boolean): void =>
    setValidationStatusForField('minArticlesViewed', isValid);

  const onArticlesViewedSettingsValidationChanged = (isValid: boolean): void =>
    setValidationStatusForField('articlesViewedSettings', isValid);

  const getArticlesViewedSettings = (test: BannerTest): ArticlesViewedSettings | undefined => {
    if (!!test.articlesViewedSettings) {
      return test.articlesViewedSettings;
    }
    if (testCopyHasTemplate(test, articleCountTemplate)) {
      return DEFAULT_ARTICLES_VIEWED_SETTINGS;
    }
    return undefined;
  };

  const updateTest = (updatedTest: BannerTest): void => {
    onChange({
      ...updatedTest,
      // To save dotcom from having to work this out
      articlesViewedSettings: getArticlesViewedSettings(updatedTest),
    });
  };

  const onLiveSwitchChange = (isOn: boolean): void => {
    updateTest({ ...test, isOn });
  };

  const onVariantsChange = (updatedVariantList: BannerVariant[]): void => {
    updateTest({ ...test, variants: updatedVariantList });
  };

  const onVariantChange = (updatedVariant: BannerVariant): void => {
    onVariantsChange(
      test.variants.map(variant =>
        variant.name === updatedVariant.name ? updatedVariant : variant,
      ),
    );
  };

  const onVariantDelete = (deletedVariantName: string): void => {
    onVariantsChange(test.variants.filter(variant => variant.name !== deletedVariantName));
  };

  const onMinArticlesViewedChange = (updatedMinArticles: number): void => {
    updateTest({
      ...test,
      minArticlesBeforeShowingBanner: updatedMinArticles,
    });
  };

  const onRegionsChange = (updatedRegions: Region[]): void => {
    updateTest({ ...test, locations: updatedRegions });
  };

  const onCohortChange = (updatedCohort: UserCohort): void => {
    updateTest({ ...test, userCohort: updatedCohort });
  };

  const onArticlesViewedSettingsChange = (
    updatedArticlesViewedSettings?: ArticlesViewedSettings,
  ): void => {
    updateTest({
      ...test,
      articlesViewedSettings: updatedArticlesViewedSettings,
    });
  };

  const onCopy = (name: string, nickname: string): void => {
    onTestSelected(name);
    createTest({ ...test, name: name, nickname: nickname, isOn: false });
  };

  const renderVariantEditor = (variant: BannerVariant): React.ReactElement => (
    <BannerTestVariantEditor
      key={`banner-${test.name}-${variant.name}`}
      variant={variant}
      onVariantChange={onVariantChange}
      onDelete={(): void => onVariantDelete(variant.name)}
      editMode={editMode}
      onValidationChange={(isValid: boolean): void =>
        setValidationStatusForField(variant.name, isValid)
      }
    />
  );

  const createVariant = (name: string): void => {
    const newVariant: BannerVariant = {
      ...getDefaultVariant(),
      name: name,
    };
    onVariantsChange([...test.variants, newVariant]);
  };

  if (test && visible) {
    return (
      <div className={classes.container}>
        <div className={classes.headerAndSwitchContainer}>
          <TestEditorHeader name={test.name} nickname={test.nickname} />

          <LiveSwitch
            label="Live on Guardian.com"
            isLive={test.isOn}
            isDisabled={!editMode}
            onChange={onLiveSwitchChange}
          />
        </div>

        <div className={classes.sectionContainer}>
          <Typography variant={'h3'} className={classes.sectionHeader}>
            Variants
          </Typography>
          <div>
            <TestVariantsEditor
              variants={test.variants}
              createVariant={createVariant}
              testName={test.name}
              testType="BANNER"
              editMode={editMode}
              renderVariantEditor={renderVariantEditor}
              onVariantDelete={onVariantDelete}
            />
          </div>
        </div>

        <div className={classes.sectionContainer}>
          <Typography variant={'h3'} className={classes.sectionHeader}>
            Display rules
          </Typography>

          <TestEditorMinArticlesViewedInput
            minArticles={test.minArticlesBeforeShowingBanner}
            isDisabled={!editMode}
            onValidationChange={onMinArticlesViewedValidationChanged}
            onUpdate={onMinArticlesViewedChange}
          />
        </div>

        <div className={classes.sectionContainer}>
          <Typography variant={'h3'} className={classes.sectionHeader}>
            Target audience
          </Typography>

          <TestEditorTargetAudienceSelector
            selectedRegions={test.locations}
            onRegionsUpdate={onRegionsChange}
            selectedCohort={test.userCohort}
            onCohortChange={onCohortChange}
            isDisabled={!editMode}
            showSupporterStatusSelector={true}
          />
        </div>

        <div className={classes.sectionContainer}>
          <Typography variant={'h3'} className={classes.sectionHeader}>
            Article count
          </Typography>

          <TestEditorArticleCountEditor
            articlesViewedSettings={test.articlesViewedSettings}
            onArticlesViewedSettingsChanged={onArticlesViewedSettingsChange}
            onValidationChange={onArticlesViewedSettingsValidationChanged}
            isDisabled={!editMode}
          />
        </div>
        <div className={classes.buttonsContainer}>
          <TestEditorActionButtons
            existingNames={testNames}
            existingNicknames={testNicknames}
            isDisabled={!editMode}
            onArchive={onArchive}
            onDelete={onDelete}
            onCopy={onCopy}
          />
        </div>
      </div>
    );
  }
  return null;
};

export default withStyles(styles)(BannerTestEditor);
