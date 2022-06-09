import React, { useState } from 'react';
import { Region } from '../../../utils/models';
import { ArticlesViewedSettings, DeviceType, setStatus, UserCohort } from '../helpers/shared';
import { ARTICLE_COUNT_TEMPLATE } from '../helpers/validation';
import { Typography } from '@material-ui/core';
import BannerTestVariantEditor from './bannerTestVariantEditor';
import TestVariantsEditor from '../testVariantsEditor';
import TestEditorMinArticlesViewedInput from '../testEditorMinArticlesViewedInput';
import TestEditorTargetAudienceSelector from '../testEditorTargetAudienceSelector';
import TestEditorArticleCountEditor, {
  DEFAULT_ARTICLES_VIEWED_SETTINGS,
} from '../testEditorArticleCountEditor';
import LiveSwitch from '../../shared/liveSwitch';
import useValidation from '../hooks/useValidation';
import { BannerContent, BannerTest, BannerVariant } from '../../../models/banner';
import { getDefaultVariant } from './utils/defaults';
import TestEditorVariantSummary from '../testEditorVariantSummary';
import BannerVariantPreview from './bannerVariantPreview';
import { ControlProportionSettings } from '../helpers/controlProportionSettings';
import TestVariantsSplitEditor from '../testVariantsSplitEditor';
import { useStyles } from '../helpers/testEditorStyles';
import { TestEditorProps } from '../testsForm';
import StickyTopBar from '../stickyTopBar/stickyTopBar';

const copyHasTemplate = (content: BannerContent, template: string): boolean =>
  (content.heading && content.heading.includes(template)) ||
  (content.paragraphs && content.paragraphs.some(para => para.includes(template))) ||
  (content.messageText != null && content.messageText.includes(template));

const testCopyHasTemplate = (test: BannerTest, template: string): boolean =>
  test.variants.some(
    variant =>
      (variant.bannerContent && copyHasTemplate(variant.bannerContent, template)) ||
      (variant.mobileBannerContent && copyHasTemplate(variant.mobileBannerContent, template)),
  );

const BannerTestEditor: React.FC<TestEditorProps<BannerTest>> = ({
  test,
  onTestChange,
  userHasTestLocked,
  onTestLock,
  onTestUnlock,
  onTestSave,
  onTestArchive,
  onTestCopy,
  existingNames,
  existingNicknames,
}: TestEditorProps<BannerTest>) => {
  const classes = useStyles();
  const [isValid, setIsValid] = useState<boolean>(true);

  const setValidationStatusForField = useValidation(setIsValid);

  const onSave = (): void => {
    if (isValid) {
      onTestSave(test.name);
    } else {
      alert('Test contains errors. Please fix any errors before saving.');
    }
  };

  const getArticlesViewedSettings = (test: BannerTest): ArticlesViewedSettings | undefined => {
    if (!!test.articlesViewedSettings) {
      return test.articlesViewedSettings;
    }
    if (testCopyHasTemplate(test, ARTICLE_COUNT_TEMPLATE)) {
      return DEFAULT_ARTICLES_VIEWED_SETTINGS;
    }
    return undefined;
  };

  const updateTest = (updatedTest: BannerTest): void => {
    onTestChange({
      ...updatedTest,
      // To save dotcom from having to work this out
      articlesViewedSettings: getArticlesViewedSettings(updatedTest),
    });
  };

  const onMinArticlesViewedValidationChanged = (isValid: boolean): void =>
    setValidationStatusForField('minArticlesViewed', isValid);

  const onArticlesViewedSettingsValidationChanged = (isValid: boolean): void =>
    setValidationStatusForField('articlesViewedSettings', isValid);

  const onVariantsSplitSettingsValidationChanged = (isValid: boolean): void =>
    setValidationStatusForField('variantsSplitSettings', isValid);

  const onControlProportionSettingsChange = (
    controlProportionSettings?: ControlProportionSettings,
  ): void => updateTest({ ...test, controlProportionSettings });

  const onLiveSwitchChange = (isOn: boolean): void => {
    updateTest({ ...test, isOn, status: setStatus(isOn) });
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

  const onDeviceTypeChange = (updatedDeviceType: DeviceType): void => {
    updateTest({ ...test, deviceType: updatedDeviceType });
  };

  const onArticlesViewedSettingsChange = (
    updatedArticlesViewedSettings?: ArticlesViewedSettings,
  ): void => {
    updateTest({
      ...test,
      articlesViewedSettings: updatedArticlesViewedSettings,
    });
  };

  const renderVariantEditor = (variant: BannerVariant): React.ReactElement => (
    <BannerTestVariantEditor
      key={`banner-${test.name}-${variant.name}`}
      variant={variant}
      onVariantChange={onVariantChange}
      onDelete={(): void => onVariantDelete(variant.name)}
      editMode={userHasTestLocked}
      onValidationChange={(isValid: boolean): void =>
        setValidationStatusForField(variant.name, isValid)
      }
    />
  );

  const renderVariantSummary = (variant: BannerVariant): React.ReactElement => (
    <TestEditorVariantSummary
      name={variant.name}
      testName={test.name}
      testType="BANNER"
      isInEditMode={userHasTestLocked}
      topButton={<BannerVariantPreview variant={variant} />}
      platform="DOTCOM" // hardcoded as banners are currently not supported in AMP or Apple News
    />
  );

  const createVariant = (name: string): void => {
    const newVariant: BannerVariant = {
      ...getDefaultVariant(),
      name: name,
    };
    onVariantsChange([...test.variants, newVariant]);
  };

  const onVariantClone = (originalVariant: BannerVariant, clonedVariantName: string): void => {
    const newVariant: BannerVariant = {
      ...originalVariant,
      name: clonedVariantName,
    };
    onVariantsChange([...test.variants, newVariant]);
  };

  if (test) {
    return (
      <div className={classes.container}>
        <StickyTopBar
          name={test.name}
          nickname={test.nickname}
          lockStatus={test.lockStatus || { locked: false }}
          userHasTestLocked={userHasTestLocked}
          existingNames={existingNames}
          existingNicknames={existingNicknames}
          testNamePrefix={undefined}
          onTestLock={onTestLock}
          onTestUnlock={onTestUnlock}
          onTestSave={onSave}
          onTestArchive={() => onTestArchive(test.name)}
          onTestCopy={onTestCopy}
        />
        <div className={classes.scrollableContainer}>
          <div className={classes.headerAndSwitchContainer}>
            <LiveSwitch
              label="Live on Guardian.com"
              isLive={test.isOn}
              isDisabled={!userHasTestLocked}
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
                editMode={userHasTestLocked}
                renderVariantEditor={renderVariantEditor}
                renderVariantSummary={renderVariantSummary}
                onVariantDelete={onVariantDelete}
                onVariantClone={onVariantClone}
              />
            </div>
          </div>

          {test.variants.length > 1 && (
            <div className={classes.sectionContainer}>
              <Typography variant={'h3'} className={classes.sectionHeader}>
                Variants split
              </Typography>
              <div>
                <TestVariantsSplitEditor
                  variants={test.variants}
                  controlProportionSettings={test.controlProportionSettings}
                  onControlProportionSettingsChange={onControlProportionSettingsChange}
                  onValidationChange={onVariantsSplitSettingsValidationChanged}
                  isDisabled={!userHasTestLocked}
                />
              </div>
            </div>
          )}

          <div className={classes.sectionContainer}>
            <Typography variant={'h3'} className={classes.sectionHeader}>
              Display rules
            </Typography>

            <TestEditorMinArticlesViewedInput
              minArticles={test.minArticlesBeforeShowingBanner}
              isDisabled={!userHasTestLocked}
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
              selectedDeviceType={test.deviceType ?? 'All'}
              onDeviceTypeChange={onDeviceTypeChange}
              isDisabled={!userHasTestLocked}
              showSupporterStatusSelector={true}
              showDeviceTypeSelector={true}
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
              isDisabled={!userHasTestLocked}
            />
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default BannerTestEditor;
