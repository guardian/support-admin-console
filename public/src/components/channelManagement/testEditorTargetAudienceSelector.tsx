import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';
import { Region } from '../../utils/models';
import {
  ConsentStatus,
  ContributionsOnlyCountriesTargeting,
  DeviceType,
  RegionTargeting,
  SignedInStatus,
  TestPlatform,
  UserCohort,
} from './helpers/shared';
import { MParticleAudienceEditor } from './mParticleAudienceEditor';
import MultiSelectCountryEditor from './MultiSelectCountryEditor';
import TestEditorTargetRegionsSelector from './testEditorTargetRegionsSelector';
import TypedRadioGroup from './TypedRadioGroup';

const Container = styled('div')({
  display: 'flex',
  flexWrap: 'wrap',
});
const Heading = styled(Typography)(({ theme }) => ({
  fontSize: 16,
  color: theme.palette.grey[900],
  fontWeight: 500,
}));
const ContainerSection = styled('div')(({ theme }) => ({
  display: 'inline',
  gap: theme.spacing(12),
  flexWrap: 'wrap',
  marginRight: theme.spacing(12),
  marginBottom: theme.spacing(4),
}));
const MParticleContainer = styled('div')({
  display: 'block',
  width: '100%',
});

interface TestEditorTargetAudienceSelectorProps {
  regionTargeting?: RegionTargeting;
  onRegionTargetingUpdate: (regionTargeting: RegionTargeting) => void;
  selectedCohort: UserCohort;
  onCohortChange: (updatedCohort: UserCohort) => void;
  supportedRegions?: Region[];
  selectedDeviceType: DeviceType;
  onDeviceTypeChange: (deviceType: DeviceType) => void;
  isDisabled: boolean;
  showSupporterStatusSelector: boolean;
  showDeviceTypeSelector: boolean;
  showSignedInStatusSelector: boolean;
  selectedSignedInStatus?: SignedInStatus;
  onSignedInStatusChange: (signedInStatus: SignedInStatus) => void;
  selectedConsentStatus?: ConsentStatus;
  onConsentStatusChange: (consentStatus: ConsentStatus) => void;
  showConsentStatusSelector: boolean;
  platform?: TestPlatform;
  mParticleAudienceEditor?: {
    mParticleAudience?: number;
    onMParticleAudienceChange: (mParticleAudience?: number) => void;
  };
  mParticleAudienceValidation?: boolean;
}
const TestEditorTargetAudienceSelector: React.FC<TestEditorTargetAudienceSelectorProps> = ({
  regionTargeting,
  onRegionTargetingUpdate,
  selectedCohort,
  onCohortChange,
  supportedRegions,
  selectedDeviceType,
  onDeviceTypeChange,
  isDisabled,
  showSupporterStatusSelector,
  showDeviceTypeSelector,
  showSignedInStatusSelector,
  selectedSignedInStatus,
  onSignedInStatusChange,
  selectedConsentStatus,
  onConsentStatusChange,
  showConsentStatusSelector,
  platform,
  mParticleAudienceEditor,
  mParticleAudienceValidation,
}: TestEditorTargetAudienceSelectorProps) => {
  const regionTargetingOrDefault: RegionTargeting = regionTargeting ?? {
    targetedCountryGroups: [],
    targetedCountryCodes: [],
    contributionsOnlyCountriesTargeting: 'Exclude',
  };

  return (
    <Container>
      <ContainerSection>
        <Heading>Region</Heading>
        <TestEditorTargetRegionsSelector
          regionTargeting={regionTargetingOrDefault}
          onRegionTargetingUpdate={onRegionTargetingUpdate}
          supportedRegions={supportedRegions}
          isDisabled={isDisabled}
          platform={platform}
        />
        {platform !== 'APPLE_NEWS' && (
          <MultiSelectCountryEditor
            disabled={isDisabled}
            regionTargeting={regionTargetingOrDefault}
            onRegionTargetingUpdate={onRegionTargetingUpdate}
          />
        )}
        <div style={{ marginTop: 16 }}>
          <Heading>Contributions-only countries</Heading>
          <TypedRadioGroup<ContributionsOnlyCountriesTargeting>
            selectedValue={
              regionTargetingOrDefault.contributionsOnlyCountriesTargeting ?? 'Exclude'
            }
            onChange={(value) =>
              onRegionTargetingUpdate({
                ...regionTargetingOrDefault,
                contributionsOnlyCountriesTargeting: value,
              })
            }
            isDisabled={isDisabled}
            labels={{
              Exclude: 'Exclude contributions-only countries',
              Include: 'Only contributions-only countries',
            }}
          />
        </div>
      </ContainerSection>
      <ContainerSection>
        {showSupporterStatusSelector && (
          <>
            <Heading>Supporter Status</Heading>
            <TypedRadioGroup
              selectedValue={selectedCohort}
              onChange={onCohortChange}
              isDisabled={isDisabled}
              labels={{
                Everyone: 'Everyone',
                AllNonSupporters: 'Non-supporters',
                AllExistingSupporters: 'Existing supporters',
              }}
            />
          </>
        )}
      </ContainerSection>
      <ContainerSection>
        {showDeviceTypeSelector && (
          <>
            <Heading>Device Type</Heading>
            <TypedRadioGroup
              selectedValue={selectedDeviceType}
              onChange={onDeviceTypeChange}
              isDisabled={isDisabled}
              labels={{
                All: 'All',
                Desktop: 'Desktop',
                Mobile: 'Mobile (All)',
                iOS: 'Mobile (iOS)',
                Android: 'Mobile (Android)',
              }}
            />
          </>
        )}
      </ContainerSection>
      <ContainerSection>
        {showSignedInStatusSelector && (
          <>
            <Heading>Signed In Status</Heading>
            <TypedRadioGroup
              selectedValue={selectedSignedInStatus ?? 'All'}
              onChange={onSignedInStatusChange}
              isDisabled={isDisabled}
              labels={{
                All: 'All',
                SignedIn: 'Signed in',
                SignedOut: 'Signed out',
              }}
            />
          </>
        )}
      </ContainerSection>
      <ContainerSection>
        {showConsentStatusSelector && (
          <>
            <Heading>Consent Status</Heading>
            <TypedRadioGroup
              selectedValue={selectedConsentStatus ?? 'All'}
              onChange={onConsentStatusChange}
              isDisabled={isDisabled}
              labels={{
                All: 'All',
                HasConsented: 'Has consented',
                HasNotConsented: 'Has not consented',
              }}
            />
          </>
        )}
      </ContainerSection>
      <MParticleContainer>
        {mParticleAudienceEditor && (
          <>
            <Heading>mParticle audience ID</Heading>
            <MParticleAudienceEditor
              disabled={isDisabled}
              mParticleAudience={mParticleAudienceEditor.mParticleAudience}
              onChange={mParticleAudienceEditor.onMParticleAudienceChange}
            />
            {mParticleAudienceValidation === false && (
              <Typography style={{ color: 'red', marginTop: '8px', fontSize: '14px' }}>
                mParticle audience targeting of signed-out users requires minimum article count ≥ 5.
              </Typography>
            )}
          </>
        )}
      </MParticleContainer>
    </Container>
  );
};

export default TestEditorTargetAudienceSelector;
