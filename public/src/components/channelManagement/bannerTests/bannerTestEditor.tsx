import React from 'react';
import { Region } from '../../../utils/models';
import { ArticlesViewedSettings, UserCohort } from '../helpers/shared';
import { articleCountTemplate } from '../helpers/copyTemplates';
import { createStyles, Theme, Typography, WithStyles, withStyles } from '@material-ui/core';
import { defaultArticlesViewedSettings } from '../articlesViewedEditor';
import BannerTestVariantEditor from './bannerTestVariantEditor';
import TestVariantsEditor from '../testVariantsEditor';
import TestEditorHeader from '../testEditorHeader';
import TestEditorLiveSwitch from '../testEditorLiveSwitch';
import TestEditorMinArticlesViewedInput from '../testEditorMinArticlesViewedInput';
import TestEditorTargetAudienceSelector from '../testEditorTargetAudienceSelector';
import TestEditorArticleCountEditor from '../testEditorArticleCountEditor';
import TestEditorActionButtons from '../testEditorActionButtons';
import useValidation from '../hooks/useValidation';
import { BannerTest, BannerVariant, BannerTemplate } from '../../../models/banner';
import { defaultCta } from '../helpers/shared';

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

const copyHasTemplate = (test: BannerTest, template: string): boolean =>
  test.variants.some(
    variant =>
      (variant.heading && variant.heading.includes(template)) || variant.body.includes(template),
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
  onSelectedTestName: (testName: string) => void;
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
  onArchive,
  onDelete,
  onSelectedTestName,
  testNames,
  testNicknames,
  createTest,
}: BannerTestEditorProps) => {
  const isEditable = (): boolean => {
    return editMode && !isDeleted && !isArchived;
  };

  const setValidationStatusForField = useValidation(onValidationChange);

  const onMinArticlesViewedValidationChanged = (isValid: boolean): void =>
    setValidationStatusForField('minArticlesViewed', isValid);

  const onArticlesViewedSettingsValidationChanged = (isValid: boolean): void =>
    setValidationStatusForField('articlesViewedSettings', isValid);

  const getArticlesViewedSettings = (test: BannerTest): ArticlesViewedSettings | undefined => {
    if (!!test.articlesViewedSettings) {
      return test.articlesViewedSettings;
    }
    if (copyHasTemplate(test, articleCountTemplate)) {
      return defaultArticlesViewedSettings;
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

  const onLiveSwitchChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    updateTest({ ...test, isOn: event.target.checked });
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
    onSelectedTestName(name);
    createTest({ ...test, name: name, nickname: nickname, isOn: false });
  };

  const variantEditors = test.variants.map(variant => (
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
  ));

  const createVariant = (name: string): void => {
    const newVariant: BannerVariant = {
      name: name,
      template: BannerTemplate.ContributionsBanner,
      heading: undefined,
      body: '',
      highlightedText:
        'Support the Guardian from as little as %%CURRENCY_SYMBOL%%1 – and it only takes a minute. Thank you.',
      cta: defaultCta,
    };
    onVariantsChange([...test.variants, newVariant]);
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
          <Typography variant={'h3'} className={classes.sectionHeader}>
            Variants
          </Typography>
          <div>
            <TestVariantsEditor
              variants={test.variants}
              createVariant={createVariant}
              testName={test.name}
              editMode={isEditable()}
              variantEditors={variantEditors}
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
            isDisabled={!isEditable()}
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
            isDisabled={!isEditable()}
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
            isDisabled={!isEditable()}
          />
        </div>
        <div className={classes.buttonsContainer}>
          <TestEditorActionButtons
            existingNames={testNames}
            existingNicknames={testNicknames}
            isDisabled={!isEditable()}
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
