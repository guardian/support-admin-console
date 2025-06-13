import React from 'react';
import { GutterTest, GutterVariant } from '../../../models/gutter';
import {
  ConsentStatus,
  DeviceType,
  PageContextTargeting,
  RegionTargeting,
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

  const onCampaignChange = (campaign?: string): void => {
    onTestChange(current => ({
      ...current,
      campaignName: campaign,
    }));
  };

  const onVariantsSplitSettingsValidationChanged = (isValid: boolean): void =>
    setValidationStatusForField('variantsSplitSettings', isValid);

  const onControlProportionSettingsChange = (
    controlProportionSettings?: ControlProportionSettings,
  ): void => onTestChange(current => ({ ...current, controlProportionSettings }));

  const onVariantsChange = (update: (current: GutterVariant[]) => GutterVariant[]): void => {
    onTestChange(current => {
      const updatedVariantList = update(current.variants);
      return { ...current, variants: updatedVariantList };
    });
  };

  const onVariantChange = (variantName: string) => (
    update: (current: GutterVariant) => GutterVariant,
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

  const updateContextTargeting = (contextTargeting: PageContextTargeting): void => {
    onTestChange(current => ({
      ...current,
      contextTargeting,
    }));
  };

  const onRegionTargetingChange = (updatedRegionTargeting: RegionTargeting): void => {
    onTestChange(current => ({
      ...current,
      regionTargeting: updatedRegionTargeting,
      locations: [],
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
          onVariantChange={onVariantChange(variant.name)}
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
    onVariantsChange(current => [...current, newVariant]);
  };

  const onVariantClone = (originalVariant: GutterVariant, clonedVariantName: string): void => {
    const newVariant: GutterVariant = {
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
          contextTargeting={test.contextTargeting}
          editMode={userHasTestLocked}
          updateContextTargeting={updateContextTargeting}
        />
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
          showDeviceTypeSelector={false}
          selectedDeviceType={test.deviceType ?? 'All'} // can't remove but hidden anyway.
          onDeviceTypeChange={onDeviceTypeChange} // can't remove but hidden anywat.
          isDisabled={!userHasTestLocked}
          showSupporterStatusSelector={true}
          showSignedInStatusSelector={true}
          selectedSignedInStatus={test.signedInStatus}
          onSignedInStatusChange={onSignedInStatusChange}
          showConsentStatusSelector={false}
          onConsentStatusChange={onConsentChange} // can't remove but hidden anyway
        />
      </div>
    </div>
  );
};

export default GutterTestEditor;
