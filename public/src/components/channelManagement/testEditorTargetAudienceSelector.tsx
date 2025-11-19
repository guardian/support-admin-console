import React from 'react';
import { Theme, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Region } from '../../utils/models';
import {
  DeviceType,
  SignedInStatus,
  UserCohort,
  TestPlatform,
  ConsentStatus,
  RegionTargeting,
} from './helpers/shared';
import TestEditorTargetRegionsSelector from './testEditorTargetRegionsSelector';
import TypedRadioGroup from './TypedRadioGroup';
import MultiSelectCountryEditor from './MultiSelectCountryEditor';
import { MParticleAudienceEditor } from './mParticleAudienceEditor';

const useStyles = makeStyles(({ spacing, palette }: Theme) => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  heading: {
    fontSize: 16,
    color: palette.grey[900],
    fontWeight: 500,
  },
  containerSection: {
    display: 'inline',
    gap: spacing(12),
    flexWrap: 'wrap',
    marginRight: spacing(12),
    marginBottom: spacing(4),
  },
  mParticleContainer: {
    display: 'block',
    width: '100%',
  },
}));

interface TestEditorTargetAudienceSelectorProps {
  regionTargeting: RegionTargeting;
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
}: TestEditorTargetAudienceSelectorProps) => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <div className={classes.containerSection}>
        <Typography className={classes.heading}>Region</Typography>
        <TestEditorTargetRegionsSelector
          regionTargeting={regionTargeting}
          onRegionTargetingUpdate={onRegionTargetingUpdate}
          supportedRegions={supportedRegions}
          isDisabled={isDisabled}
          platform={platform}
        />
        {platform !== 'APPLE_NEWS' && (
          <MultiSelectCountryEditor
            disabled={isDisabled}
            regionTargeting={regionTargeting}
            onRegionTargetingUpdate={onRegionTargetingUpdate}
          />
        )}
      </div>
      <div className={classes.containerSection}>
        {showSupporterStatusSelector && (
          <>
            <Typography className={classes.heading}>Supporter Status</Typography>
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
      </div>
      <div className={classes.containerSection}>
        {showDeviceTypeSelector && (
          <>
            <Typography className={classes.heading}>Device Type</Typography>
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
      </div>
      <div className={classes.containerSection}>
        {showSignedInStatusSelector && (
          <>
            <Typography className={classes.heading}>Signed In Status</Typography>
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
      </div>
      <div className={classes.containerSection}>
        {showConsentStatusSelector && (
          <>
            <Typography className={classes.heading}>Consent Status</Typography>
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
      </div>
      <div className={classes.mParticleContainer}>
        {mParticleAudienceEditor && (
          <>
            <Typography className={classes.heading}>mParticle audience ID</Typography>
            <MParticleAudienceEditor
              disabled={isDisabled}
              mParticleAudience={mParticleAudienceEditor.mParticleAudience}
              onChange={mParticleAudienceEditor.onMParticleAudienceChange}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default TestEditorTargetAudienceSelector;
