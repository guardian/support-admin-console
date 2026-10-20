import React from 'react';
import { Inline1Test, Inline1Variant } from '../../../models/inline1';
import type { Inline1MessageType } from '../../../models/inline1';
import TestVariantsSplitEditor from '../../tests/variants/testVariantsSplitEditor';
import VariantsEditor from '../../tests/variants/variantsEditor';
import VariantSummary from '../../tests/variants/variantSummary';
import CampaignSelector from '../CampaignSelector';
import { ControlProportionSettings } from '../helpers/controlProportionSettings';
import {
  ConsentStatus,
  PageContextTargeting,
  RegionTargeting,
  SignedInStatus,
  UserCohort,
} from '../helpers/shared';
import { Container, SectionContainer, SectionHeader } from '../helpers/testEditorStyles';
import ScheduleEditor from '../scheduleEditor';
import TestEditorContextTargeting from '../testEditorContextTargeting';
import TestEditorTargetAudienceSelector from '../testEditorTargetAudienceSelector';
import { ValidatedTestEditorProps } from '../validatedTestEditor';
import {
  getDefaultInline1NewsletterMessage,
  getDefaultInline1SupportMessage,
  getDefaultVariant,
} from './utils/defaults';
import Inline1VariantEditor from './variantEditor';

const getDefaultMessage = (messageType: Inline1MessageType): Inline1Variant['message'] => {
  switch (messageType) {
    case 'Inline1SupportMessage':
      return getDefaultInline1SupportMessage();
    case 'Inline1PuzzlesMessage':
      return { type: 'Inline1PuzzlesMessage' };
    case 'Inline1NewsletterMessage':
      return getDefaultInline1NewsletterMessage();
  }
};

const Inline1TestEditor: React.FC<ValidatedTestEditorProps<Inline1Test>> = ({
  test,
  userHasTestLocked,
  onTestChange,
  setValidationStatusForField,
}: ValidatedTestEditorProps<Inline1Test>) => {
  const selectedMessageType: Inline1MessageType =
    test.variants[0]?.message.type ?? 'Inline1SupportMessage';

  const onCampaignChange = (campaign?: string): void => {
    onTestChange((current) => ({ ...current, campaignName: campaign }));
  };

  const onControlProportionSettingsChange = (
    controlProportionSettings?: ControlProportionSettings,
  ): void => onTestChange((current) => ({ ...current, controlProportionSettings }));

  const onRegionTargetingChange = (regionTargeting: RegionTargeting): void =>
    onTestChange((current) => ({ ...current, regionTargeting }));

  const onCohortChange = (userCohort: UserCohort): void =>
    onTestChange((current) => ({ ...current, userCohort }));

  const onSignedInStatusChange = (signedInStatus: SignedInStatus): void =>
    onTestChange((current) => ({ ...current, signedInStatus }));

  const onConsentStatusChange = (consentStatus: ConsentStatus): void =>
    onTestChange((current) => ({ ...current, consentStatus }));

  const onMParticleAudienceChange = (mParticleAudience?: number): void =>
    onTestChange((current) => ({ ...current, mParticleAudience }));

  const onContextTargetingChange = (contextTargeting: PageContextTargeting): void =>
    onTestChange((current) => ({ ...current, contextTargeting }));

  const onVariantsChange = (update: (current: Inline1Variant[]) => Inline1Variant[]): void => {
    onTestChange((current) => ({ ...current, variants: update(current.variants) }));
  };

  const onVariantChange = (variantName: string, updatedVariant: Inline1Variant): void => {
    onVariantsChange((current) =>
      current.map((variant) => (variant.name === variantName ? updatedVariant : variant)),
    );
  };

  const onMessageTypeChange = (
    variantName: string,
    messageType: Inline1MessageType,
  ): void => {
    onVariantsChange((current) =>
      current.map((variant) =>
        variant.name !== variantName || variant.message.type === messageType
          ? variant
          : { ...variant, message: getDefaultMessage(messageType) },
      ),
    );
  };

  const onVariantDelete = (deletedVariantName: string): void => {
    onVariantsChange((current) => current.filter((variant) => variant.name !== deletedVariantName));
  };

  const createVariant = (name: string): void => {
    onVariantsChange((current) => [
      ...current,
      { ...getDefaultVariant(), name, message: getDefaultMessage(selectedMessageType) },
    ]);
  };

  const onVariantClone = (originalVariant: Inline1Variant, clonedVariantName: string): void => {
    onVariantsChange((current) => [...current, { ...originalVariant, name: clonedVariantName }]);
  };

  const renderVariantEditor = (variant: Inline1Variant): React.ReactElement => (
    <Inline1VariantEditor
      key={`inline1-${test.name}-${variant.name}`}
      variant={variant}
      onChange={(updatedVariant) => onVariantChange(variant.name, updatedVariant)}
      onValidationChange={(isValid) =>
        setValidationStatusForField(`variant-${variant.name}`, isValid)
      }
      onMessageTypeChange={(messageType) => onMessageTypeChange(variant.name, messageType)}
      isDisabled={!userHasTestLocked}
    />
  );

  const renderVariantSummary = (variant: Inline1Variant): React.ReactElement => (
    <VariantSummary
      name={variant.name}
      testName={test.name}
      testType="INLINE1"
      isInEditMode={userHasTestLocked}
      platform="DOTCOM"
      articleType="Standard"
    />
  );

  return (
    <Container>
      <SectionContainer>
        <SectionHeader variant={'h3'}>Variants</SectionHeader>
        <div>
          <VariantsEditor<Inline1Variant>
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
      </SectionContainer>

      {test.variants.length > 1 && (
        <SectionContainer>
          <SectionHeader variant={'h3'}>Variants split (applies to AB tests only)</SectionHeader>
          <div>
            <TestVariantsSplitEditor
              variants={test.variants}
              controlProportionSettings={test.controlProportionSettings}
              onControlProportionSettingsChange={onControlProportionSettingsChange}
              onValidationChange={(isValid: boolean): void =>
                setValidationStatusForField('variantsSplitSettings', isValid)
              }
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
        <SectionHeader variant={'h3'}>Target content</SectionHeader>
        <TestEditorContextTargeting
          contextTargeting={test.contextTargeting}
          editMode={userHasTestLocked}
          updateContextTargeting={onContextTargetingChange}
        />
      </SectionContainer>

      <SectionContainer>
        <SectionHeader variant={'h3'}>Target audience</SectionHeader>
        <TestEditorTargetAudienceSelector
          regionTargeting={test.regionTargeting}
          onRegionTargetingUpdate={onRegionTargetingChange}
          selectedCohort={test.userCohort ?? UserCohort.AllNonSupporters}
          onCohortChange={onCohortChange}
          selectedDeviceType={'All'}
          onDeviceTypeChange={() => undefined}
          isDisabled={!userHasTestLocked}
          showSupporterStatusSelector={true}
          showDeviceTypeSelector={false}
          showSignedInStatusSelector={true}
          selectedSignedInStatus={test.signedInStatus}
          onSignedInStatusChange={onSignedInStatusChange}
          selectedConsentStatus={test.consentStatus}
          onConsentStatusChange={onConsentStatusChange}
          showConsentStatusSelector={true}
          mParticleAudienceEditor={{
            mParticleAudience: test.mParticleAudience,
            onMParticleAudienceChange,
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

export default Inline1TestEditor;
