import React, { useEffect, useRef } from 'react';
import { HeaderTest, HeaderVariant } from '../../../models/header';
import TestVariantsSplitEditor from '../../tests/variants/testVariantsSplitEditor';
import VariantsEditor from '../../tests/variants/variantsEditor';
import VariantSummary from '../../tests/variants/variantSummary';
import CampaignSelector from '../CampaignSelector';
import { ControlProportionSettings } from '../helpers/controlProportionSettings';
import {
  ConsentStatus,
  DeviceType,
  RegionTargeting,
  SignedInStatus,
  UserCohort,
} from '../helpers/shared';
import { Container, SectionContainer, SectionHeader } from '../helpers/testEditorStyles';
import { MParticleAudienceEditor } from '../mParticleAudienceEditor';
import ScheduleEditor from '../scheduleEditor';
import TestEditorTargetAudienceSelector from '../testEditorTargetAudienceSelector';
import { ValidatedTestEditorProps } from '../validatedTestEditor';
import HeaderTestVariantEditor from './headerTestVariantEditor';
import { getDefaultVariant } from './utils/defaults';

const HeaderTestEditor: React.FC<ValidatedTestEditorProps<HeaderTest>> = ({
  test,
  userHasTestLocked,
  onTestChange,
  setValidationStatusForField,
}: ValidatedTestEditorProps<HeaderTest>) => {
  const onVariantsSplitSettingsValidationChanged = (isValid: boolean): void =>
    setValidationStatusForField('variantsSplitSettings', isValid);

  const onCampaignChange = (campaign?: string): void => {
    onTestChange((current) => ({
      ...current,
      campaignName: campaign,
    }));
  };

  const onControlProportionSettingsChange = (
    controlProportionSettings?: ControlProportionSettings,
  ): void => onTestChange((current) => ({ ...current, controlProportionSettings }));

  const onVariantsChange = (update: (current: HeaderVariant[]) => HeaderVariant[]): void => {
    onTestChange((current) => {
      const updatedVariantList = update(current.variants);
      return { ...current, variants: updatedVariantList };
    });
  };

  const onVariantDelete = (deletedVariantName: string): void => {
    onVariantsChange((current) => current.filter((variant) => variant.name !== deletedVariantName));
  };

  const onRegionTargetingChange = (updatedRegionTargeting: RegionTargeting): void => {
    onTestChange((current) => ({
      ...current,
      regionTargeting: updatedRegionTargeting,
      locations: [], // deprecated
    }));
  };

  const onCohortChange = (updatedCohort: UserCohort): void => {
    onTestChange((current) => ({ ...current, userCohort: updatedCohort }));
  };

  const onDeviceTypeChange = (updatedDeviceType: DeviceType): void => {
    onTestChange((current) => ({ ...current, deviceType: updatedDeviceType }));
  };

  const onSignedInStatusChange = (signedInStatus: SignedInStatus): void => {
    onTestChange((current) => ({ ...current, signedInStatus }));
  };

  const onConsentChange = (consentStatus: ConsentStatus): void => {
    onTestChange((current) => ({ ...current, consentStatus }));
  };

  const renderVariantEditor = (variant: HeaderVariant): React.ReactElement => (
    <HeaderTestVariantEditor
      key={`head-${test.name}-${variant.name}`}
      variant={variant}
      onVariantChange={getVariantChangeCallback(variant.name)}
      onDelete={(): void => onVariantDelete(variant.name)}
      editMode={userHasTestLocked}
      onValidationChange={getValidationCallback(variant.name)}
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
    onVariantsChange((current) => [...current, newVariant]);
  };

  const onVariantClone = (originalVariant: HeaderVariant, clonedVariantName: string): void => {
    const newVariant: HeaderVariant = {
      ...originalVariant,
      name: clonedVariantName,
    };
    onVariantsChange((current) => [...current, newVariant]);
  };

  // Memoize callbacks by variant name to prevent infinite render loops
  // Using refs to store callbacks to avoid dependency issues with useCallback
  const validationCallbacksRef = useRef<Map<string, (isValid: boolean) => void>>(new Map());
  const variantChangeCallbacksRef = useRef<
    Map<string, (update: (current: HeaderVariant) => HeaderVariant) => void>
  >(new Map());
  const setValidationStatusRef = useRef(setValidationStatusForField);
  const onVariantsChangeRef = useRef(onVariantsChange);

  // Keep refs up to date without triggering re-renders
  useEffect(() => {
    setValidationStatusRef.current = setValidationStatusForField;
    onVariantsChangeRef.current = onVariantsChange;
  });

  const getValidationCallback = (variantName: string): ((isValid: boolean) => void) => {
    if (!validationCallbacksRef.current.has(variantName)) {
      validationCallbacksRef.current.set(variantName, (isValid: boolean): void =>
        setValidationStatusRef.current(variantName, isValid),
      );
    }
    return validationCallbacksRef.current.get(variantName)!;
  };

  const getVariantChangeCallback = (
    variantName: string,
  ): ((update: (current: HeaderVariant) => HeaderVariant) => void) => {
    if (!variantChangeCallbacksRef.current.has(variantName)) {
      variantChangeCallbacksRef.current.set(
        variantName,
        (update: (current: HeaderVariant) => HeaderVariant): void => {
          onVariantsChangeRef.current((current) =>
            current.map((variant) => {
              if (variant.name === variantName) {
                return update(variant);
              }
              return variant;
            }),
          );
        },
      );
    }
    return variantChangeCallbacksRef.current.get(variantName)!;
  };

  return (
    <Container>
      <SectionContainer>
        <SectionHeader variant={'h3'}>Variants</SectionHeader>
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
      </SectionContainer>

      {test.variants.length > 1 && (
        <SectionContainer>
          <SectionHeader variant={'h3'}>Variants split (applies to AB tests only)</SectionHeader>
          <div>
            <TestVariantsSplitEditor
              variants={test.variants}
              controlProportionSettings={test.controlProportionSettings}
              onControlProportionSettingsChange={onControlProportionSettingsChange}
              onValidationChange={onVariantsSplitSettingsValidationChanged}
              isDisabled={!userHasTestLocked}
            />
          </div>
        </SectionContainer>
      )}

      <SectionContainer>
        <SectionHeader variant={'h3'}>Campaign</SectionHeader>
        <div>
          <CampaignSelector
            test={test}
            onCampaignChange={onCampaignChange}
            disabled={!userHasTestLocked}
          />
        </div>
      </SectionContainer>

      <SectionContainer>
        <SectionHeader variant={'h3'}>Target audience</SectionHeader>

        <TestEditorTargetAudienceSelector
          regionTargeting={test.regionTargeting}
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
        />

        <SectionHeader variant={'h4'} style={{ marginTop: '20px' }}>
          mParticle Audience
        </SectionHeader>

        <MParticleAudienceEditor
          mParticleAudience={test.mParticleAudience}
          disabled={!userHasTestLocked}
          onChange={(mParticleAudience) => {
            onTestChange((current) => ({
              ...current,
              mParticleAudience,
            }));
          }}
        />
      </SectionContainer>

      <SectionContainer>
        <SectionHeader variant={'h3'}>Schedule</SectionHeader>
        <ScheduleEditor
          scheduler={test.scheduler}
          disabled={!userHasTestLocked}
          onChange={(scheduler) => onTestChange((current) => ({ ...current, scheduler }))}
          onValidationChange={(isValid) => setValidationStatusForField('schedule', isValid)}
        />
      </SectionContainer>
    </Container>
  );
};

export default HeaderTestEditor;
