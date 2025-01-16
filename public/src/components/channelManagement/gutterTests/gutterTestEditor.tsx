import React from 'react';
import { GutterTest, GutterVariant } from '../../../models/gutter';
import { Region } from '../../../utils/models';
import {
  ConsentStatus,
  DeviceType,
  Methodology,
  PageContextTargeting,
  SignedInStatus,
  UserCohort,
} from '../helpers/shared';
import { ValidatedTestEditorProps } from '../validatedTestEditor';
import GutterVariantEditor from './gutterVariantEditor';
import { Typography } from '@mui/material';
import { getDefaultVariant } from './utils/defaults';
import CampaignSelector from '../CampaignSelector';
import TestEditorContextTargeting from '../testEditorContextTargeting';
import TestEditorTargetAudienceSelector from '../testEditorTargetAudienceSelector';
import { ControlProportionSettings } from '../helpers/controlProportionSettings';
import GutterVariantPreview from './gutterVariantPreview';
import { useStyles } from '../helpers/testEditorStyles';
import VariantSummary from '../../tests/variants/variantSummary';
import VariantsEditor from '../../tests/variants/variantsEditor';
import { TestMethodologyEditor } from '../TestMethodologyEditor';
import TestVariantsSplitEditor from '../../tests/variants/testVariantsSplitEditor';
import VariantEditorWithPreviewTab from '../../tests/variants/variantEditorWithPreviewTab';
import { GutterTestPreviewButton } from './gutterTestPreview';

const GutterTestEditor: React.FC<ValidatedTestEditorProps<GutterTest>> = ({
  test,
  userHasTestLocked,
  onTestChange,
  setValidationStatusForField,
}: ValidatedTestEditorProps<GutterTest>) => {
  const classes = useStyles();

  const updateTest = (updatedTest: GutterTest): void => {
    onTestChange({
      ...updatedTest,
    });
  };

  const onCampaignChange = (campaign?: string): void => {
    updateTest({
      ...test,
      campaignName: campaign,
    });
  };

  const onMethodologyChange = (methodologies: Methodology[]): void => {
    setValidationStatusForField('methodologies', methodologies.length > 0);
    updateTest({ ...test, methodologies });
  };

  const onVariantsSplitSettingsValidationChanged = (isValid: boolean): void =>
    setValidationStatusForField('variantsSplitSettings', isValid);

  const onControlProportionSettingsChange = (
    controlProportionSettings?: ControlProportionSettings,
  ): void => updateTest({ ...test, controlProportionSettings });

  const onVariantsChange = (updatedVariantList: GutterVariant[]): void => {
    updateTest({ ...test, variants: updatedVariantList });
  };

  const onVariantChange = (updatedVariant: GutterVariant): void => {
    onVariantsChange(
      test.variants.map(variant =>
        variant.name === updatedVariant.name ? updatedVariant : variant,
      ),
    );
  };

  const onVariantDelete = (deletedVariantName: string): void => {
    onVariantsChange(test.variants.filter(variant => variant.name !== deletedVariantName));
  };

  const updateContextTargeting = (contextTargeting: PageContextTargeting): void => {
    updateTest({
      ...test,
      tagIds: contextTargeting.tagIds,
      sectionIds: contextTargeting.sectionIds,
      excludedTagIds: contextTargeting.excludedTagIds,
      excludedSectionIds: contextTargeting.excludedSectionIds,
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

  const onSignedInStatusChange = (signedInStatus: SignedInStatus): void => {
    onTestChange({ ...test, signedInStatus });
  };

  const onConsentChange = (consentStatus: ConsentStatus): void => {
    onTestChange({ ...test, consentStatus });
  };
  const renderVariantEditor = (variant: GutterVariant): React.ReactElement => (
    <VariantEditorWithPreviewTab
      variantEditor={
        <GutterVariantEditor
          key={`gutter-${test.name}-${variant.name}`}
          variant={variant}
          editMode={userHasTestLocked}
          onValidationChange={(isValid: boolean): void =>
            setValidationStatusForField(variant.name, isValid)
          }
          onVariantChange={onVariantChange}
          onDelete={(): void => onVariantDelete(variant.name)}
        />
      }
      variantPreview={<GutterVariantPreview variant={variant} />}
    />
  );

  const renderVariantSummary = (variant: GutterVariant): React.ReactElement => {
    return (
      <VariantSummary
        name={variant.name}
        testName={test.name}
        testType="GUTTER"
        isInEditMode={userHasTestLocked}
        platform="DOTCOM" // hardcoded as gutters are only supported in DCR
        articleType="Liveblog"
      />
    );
  };

  const createVariant = (name: string): void => {
    const newVariant: GutterVariant = {
      ...getDefaultVariant(),
      name: name,
    };
    onVariantsChange([...test.variants, newVariant]);
  };

  const onVariantClone = (originalVariant: GutterVariant, clonedVariantName: string): void => {
    const newVariant: GutterVariant = {
      ...originalVariant,
      name: clonedVariantName,
    };
    onVariantsChange([...test.variants, newVariant]);
  };

  return (
    <div className={classes.container}>
      <div className={classes.sectionContainer}>
        <Typography variant={'h3'} className={classes.sectionHeader}>
          Variants
        </Typography>
        <div className={classes.variantsHeaderButtonsContainer}>
          <GutterTestPreviewButton test={test} />
        </div>
        <div>
          <VariantsEditor<GutterVariant>
            variants={test.variants}
            testName={test.name}
            editMode={userHasTestLocked}
            createVariant={createVariant}
            renderVariantEditor={renderVariantEditor}
            renderVariantSummary={renderVariantSummary}
            onVariantDelete={onVariantDelete}
            onVariantClone={onVariantClone}
          />
        </div>
      </div>
      {/* TODO: Do we want to remove the methodologies section to just leave AB tests? */}
      <div className={classes.sectionContainer}>
        <Typography variant={'h3'} className={classes.sectionHeader}>
          Experiment Methodology
        </Typography>
        <TestMethodologyEditor
          methodologies={test.methodologies}
          testName={test.name}
          channel={test.channel ?? ''}
          isDisabled={!userHasTestLocked || test.status === 'Live'}
          onChange={onMethodologyChange}
        />
      </div>

      {test.variants.length > 1 && (
        <div className={classes.sectionContainer}>
          <Typography variant={'h3'} className={classes.sectionHeader}>
            Variants split (applies to AB tests only)
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
          Campaign
        </Typography>
        <div>
          <CampaignSelector
            test={test}
            onCampaignChange={onCampaignChange}
            disabled={!userHasTestLocked}
          />
        </div>
      </div>

      <div className={classes.sectionContainer}>
        <Typography variant={'h3'} className={classes.sectionHeader}>
          Target context
        </Typography>

        <TestEditorContextTargeting
          contextTargeting={{
            tagIds: test.tagIds,
            sectionIds: test.sectionIds,
            excludedTagIds: test.excludedTagIds,
            excludedSectionIds: test.excludedSectionIds,
          }}
          editMode={userHasTestLocked}
          updateContextTargeting={updateContextTargeting}
          onlyShowExcludedTags={true}
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
          showDeviceTypeSelector={false}
          selectedDeviceType={test.deviceType ?? 'All'} // TODO: need to find a way to remove.
          onDeviceTypeChange={onDeviceTypeChange} // TODO: need to find a way to remove.
          isDisabled={!userHasTestLocked}
          showSupporterStatusSelector={true}
          showSignedInStatusSelector={true}
          onSignedInStatusChange={onSignedInStatusChange} // TODO: needed? If not, need to find a way to remove?
          showConsentStatusSelector={false}
          onConsentStatusChange={onConsentChange} // TODO: need to find a way to remove.
        />
      </div>
    </div>
  );
};

export default GutterTestEditor;
