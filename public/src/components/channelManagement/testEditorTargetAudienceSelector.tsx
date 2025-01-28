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

const useStyles = makeStyles(({ spacing, palette }: Theme) => ({
  container: {
    display: 'flex',
    gap: spacing(12),
    flexWrap: 'wrap',
  },
  heading: {
    fontSize: 16,
    color: palette.grey[900],
    fontWeight: 500,
  },
  container1: {
    display: 'inline',
    gap: spacing(12),
    flexWrap: 'wrap',
  },
}));

interface TestEditorTargetAudienceSelectorProps {
  selectedRegions: Region[];
  onRegionsUpdate: (selectedRegions: Region[]) => void;
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
}
const TestEditorTargetAudienceSelector: React.FC<TestEditorTargetAudienceSelectorProps> = ({
  selectedRegions,
  onRegionsUpdate,
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
}: TestEditorTargetAudienceSelectorProps) => {
  const classes = useStyles();
  console.log('Step2', regionTargeting);
  return (
    <div className={classes.container}>
      <div className={classes.container1}>
        <Typography className={classes.heading}>Region</Typography>
        <TestEditorTargetRegionsSelector
          selectedRegions={selectedRegions}
          onRegionsUpdate={onRegionsUpdate}
          regionTargeting={regionTargeting}
          onRegionTargetingUpdate={onRegionTargetingUpdate}
          supportedRegions={supportedRegions}
          isDisabled={isDisabled}
          platform={platform}
        />

        <MultiSelectCountryEditor
          disabled={isDisabled}
          regionTargeting={regionTargeting}
          onRegionTargetingUpdate={onRegionTargetingUpdate}
        />
      </div>
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
  );
};

export default TestEditorTargetAudienceSelector;
