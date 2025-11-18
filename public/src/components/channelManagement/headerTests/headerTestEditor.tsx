import React from 'react';

import {
  ConsentStatus,
  DeviceType,
  RegionTargeting,
  SignedInStatus,
  UserCohort,
} from '../helpers/shared';

import { Typography } from '@mui/material';
import HeaderTestVariantEditor from './headerTestVariantEditor';
import VariantsEditor from '../../tests/variants/variantsEditor';
import CampaignSelector from '../CampaignSelector';

import TestEditorTargetAudienceSelector from '../testEditorTargetAudienceSelector';

import { HeaderTest, HeaderVariant } from '../../../models/header';
import { getDefaultVariant } from './utils/defaults';
import VariantSummary from '../../tests/variants/variantSummary';

import { ControlProportionSettings } from '../helpers/controlProportionSettings';
import TestVariantsSplitEditor from '../../tests/variants/testVariantsSplitEditor';
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
    onTestChange(current => ({
      ...current,
      campaignName: campaign,
    }));
  };

  const onControlProportionSettingsChange = (
    controlProportionSettings?: ControlProportionSettings,
  ): void => onTestChange(current => ({ ...current, controlProportionSettings }));

  const onVariantsChange = (update: (current: HeaderVariant[]) => HeaderVariant[]): void => {
    onTestChange(current => {
      const updatedVariantList = update(current.variants);
      return { ...current, variants: updatedVariantList };
    });
  };

  const onVariantChange = (variantName: string) => (
    update: (current: HeaderVariant) => HeaderVariant,
  ): void => {
    onVariantsChange(current =>
      current.map(variant => {
        if (variant.name === variantName) {
          return update(variant);
        }
        return variant;
      }),
    );
  };

  const onVariantDelete = (deletedVariantName: string): void => {
    onVariantsChange(current => current.filter(variant => variant.name !== deletedVariantName));
  };

  const onRegionTargetingChange = (updatedRegionTargeting: RegionTargeting): void => {
    onTestChange(current => ({
      ...current,
      regionTargeting: updatedRegionTargeting,
      locations: [], // deprecated
    }));
  };

  const onCohortChange = (updatedCohort: UserCohort): void => {
    onTestChange(current => ({ ...current, userCohort: updatedCohort }));
  };

  const onDeviceTypeChange = (updatedDeviceType: DeviceType): void => {
    onTestChange(current => ({ ...current, deviceType: updatedDeviceType }));
  };

  const onSignedInStatusChange = (signedInStatus: SignedInStatus): void => {
    onTestChange(current => ({ ...current, signedInStatus }));
  };

  const onConsentChange = (consentStatus: ConsentStatus): void => {
    onTestChange(current => ({ ...current, consentStatus }));
  };

  const renderVariantEditor = (variant: HeaderVariant): React.ReactElement => (
    <HeaderTestVariantEditor
      key={`head-${test.name}-${variant.name}`}
      variant={variant}
      onVariantChange={onVariantChange(variant.name)}
      onDelete={(): void => onVariantDelete(variant.name)}
      editMode={userHasTestLocked}
      onValidationChange={(isValid: boolean): void =>
        setValidationStatusForField(variant.name, isValid)
      }
    />
  );

  const renderVariantSummary = (variant: HeaderVariant): React.ReactElement => (
    <VariantSummary
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
    onVariantsChange(current => [...current, newVariant]);
  };

  const onVariantClone = (originalVariant: HeaderVariant, clonedVariantName: string): void => {
    const newVariant: HeaderVariant = {
      ...originalVariant,
      name: clonedVariantName,
    };
    onVariantsChange(current => [...current, newVariant]);
  };

  return (
    <div className={classes.container}>
      <div className={classes.sectionContainer}>
        <Typography variant={'h3'} className={classes.sectionHeader}>
          Variants
        </Typography>
        <div>
          <VariantsEditor
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
          Target audience
        </Typography>

        <TestEditorTargetAudienceSelector
          regionTargeting={
            test.regionTargeting ?? {
              // For backwards compatibility with the deprecated locations field
              targetedCountryGroups: test.locations,
              targetedCountryCodes: [],
            }
          }
          onRegionTargetingUpdate={onRegionTargetingChange}
          selectedCohort={test.userCohort}
          onCohortChange={onCohortChange}
          selectedDeviceType={test.deviceType ?? 'All'}
          onDeviceTypeChange={onDeviceTypeChange}
          isDisabled={!userHasTestLocked}
          showSupporterStatusSelector={true}
          showDeviceTypeSelector={true}
          showSignedInStatusSelector={true}
          selectedSignedInStatus={test.signedInStatus}
          onSignedInStatusChange={onSignedInStatusChange}
          selectedConsentStatus={test.consentStatus}
          onConsentStatusChange={onConsentChange}
          showConsentStatusSelector={false}
          mParticleAudienceEditor={undefined}
        />
      </div>
    </div>
  );
};

export default HeaderTestEditor;
