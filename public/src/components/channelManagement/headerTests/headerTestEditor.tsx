import React from 'react';
import { Region } from '../../../utils/models';

import { DeviceType, SignedInStatus, UserCohort } from '../helpers/shared';

import { Typography } from '@material-ui/core';
import HeaderTestVariantEditor from './headerTestVariantEditor';
import TestVariantsEditor from '../testVariantsEditor';
import CampaignSelector from '../CampaignSelector';

import TestEditorTargetAudienceSelector from '../testEditorTargetAudienceSelector';

import { HeaderTest, HeaderVariant } from '../../../models/header';
import { getDefaultVariant } from './utils/defaults';
import TestEditorVariantSummary from '../testEditorVariantSummary';

import { ControlProportionSettings } from '../helpers/controlProportionSettings';
import TestVariantsSplitEditor from '../testVariantsSplitEditor';
import { useStyles } from '../helpers/testEditorStyles';
import { ValidatedTestEditorProps } from '../validatedTestEditor';

const HeaderTestEditor: React.FC<ValidatedTestEditorProps<HeaderTest>> = ({
  test,
  userHasTestLocked,
  onTestChange,
  setValidationStatusForField,
}: ValidatedTestEditorProps<HeaderTest>) => {
  const classes = useStyles();

  const onVariantsSplitSettingsValidationChanged = (isValid: boolean): void =>
    setValidationStatusForField('variantsSplitSettings', isValid);

  const onCampaignChange = (campaign?: string): void => {
    onTestChange({
      ...test,
      campaignName: campaign,
    });
  };

  const onControlProportionSettingsChange = (
    controlProportionSettings?: ControlProportionSettings,
  ): void => onTestChange({ ...test, controlProportionSettings });

  const onVariantsChange = (updatedVariantList: HeaderVariant[]): void => {
    onTestChange({ ...test, variants: updatedVariantList });
  };

  const onVariantChange = (updatedVariant: HeaderVariant): void => {
    onVariantsChange(
      test.variants.map(variant =>
        variant.name === updatedVariant.name ? updatedVariant : variant,
      ),
    );
  };

  const onVariantDelete = (deletedVariantName: string): void => {
    onVariantsChange(test.variants.filter(variant => variant.name !== deletedVariantName));
  };

  const onRegionsChange = (updatedRegions: Region[]): void => {
    onTestChange({ ...test, locations: updatedRegions });
  };

  const onCohortChange = (updatedCohort: UserCohort): void => {
    onTestChange({ ...test, userCohort: updatedCohort });
  };

  const onDeviceTypeChange = (updatedDeviceType: DeviceType): void => {
    onTestChange({ ...test, deviceType: updatedDeviceType });
  };

  const onSignedInStatusChange = (signedInStatus: SignedInStatus): void => {
    onTestChange({ ...test, signedInStatus });
  };

  const renderVariantEditor = (variant: HeaderVariant): React.ReactElement => (
    <HeaderTestVariantEditor
      key={`head-${test.name}-${variant.name}`}
      variant={variant}
      onVariantChange={onVariantChange}
      onDelete={(): void => onVariantDelete(variant.name)}
      editMode={userHasTestLocked}
      onValidationChange={(isValid: boolean): void =>
        setValidationStatusForField(variant.name, isValid)
      }
    />
  );

  const renderVariantSummary = (variant: HeaderVariant): React.ReactElement => (
    <TestEditorVariantSummary
      name={variant.name}
      testName={test.name}
      testType="HEADER"
      isInEditMode={userHasTestLocked}
      // hardcoded as heads are currently not supported in AMP or Apple News
      platform="DOTCOM"
      articleType="Standard"
    />
  );

  const createVariant = (name: string): void => {
    const newVariant: HeaderVariant = {
      ...getDefaultVariant(),
      name: name,
    };
    onVariantsChange([...test.variants, newVariant]);
  };

  const onVariantClone = (originalVariant: HeaderVariant, clonedVariantName: string): void => {
    const newVariant: HeaderVariant = {
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
          selectedSignedInStatus={test.signedInStatus}
          onSignedInStatusChange={onSignedInStatusChange}
        />
      </div>
    </div>
  );
};

export default HeaderTestEditor;
