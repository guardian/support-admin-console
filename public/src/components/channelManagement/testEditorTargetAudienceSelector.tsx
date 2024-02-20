import React from 'react';

import { Theme, Typography, makeStyles } from '@material-ui/core';
import { Region } from '../../utils/models';
import { DeviceType, SignedInStatus, UserCohort, TestPlatform } from './helpers/shared';

import TestEditorTargetRegionsSelector from './testEditorTargetRegionsSelector';
import TypedRadioGroup from './TypedRadioGroup';

const useStyles = makeStyles(({ spacing, palette }: Theme) => ({
  container: {
    display: 'flex',

    '& > * + *': {
      marginLeft: spacing(12),
    },
  },
  sectionContainer: {
    '& > * + *': {
      marginTop: spacing(2),
    },
  },
  heading: {
    fontSize: 16,
    color: palette.grey[900],
    fontWeight: 500,
  },
}));

interface TestEditorTargetAudienceSelectorProps {
  selectedRegions: Region[];
  onRegionsUpdate: (selectedRegions: Region[]) => void;
  selectedCohort: UserCohort;
  onCohortChange: (updatedCohort: UserCohort) => void;
  supportedRegions?: Region[];
  selectedDeviceType: DeviceType;
  onDeviceTypeChange: (deviceType: DeviceType) => void;
  isDisabled: boolean;
  showSupporterStatusSelector: boolean;
  showDeviceTypeSelector: boolean;
  selectedSignedInStatus?: SignedInStatus;
  onSignedInStatusChange: (signedInStatus: SignedInStatus) => void;
  platform?: TestPlatform;
}
const TestEditorTargetAudienceSelector: React.FC<TestEditorTargetAudienceSelectorProps> = ({
  selectedRegions,
  onRegionsUpdate,
  selectedCohort,
  onCohortChange,
  supportedRegions,
  selectedDeviceType,
  onDeviceTypeChange,
  isDisabled,
  showSupporterStatusSelector,
  showDeviceTypeSelector,
  selectedSignedInStatus,
  onSignedInStatusChange,
  platform,
}: TestEditorTargetAudienceSelectorProps) => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <div className={classes.sectionContainer}>
        <Typography className={classes.heading}>Region</Typography>
        <TestEditorTargetRegionsSelector
          selectedRegions={selectedRegions}
          onRegionsUpdate={onRegionsUpdate}
          supportedRegions={supportedRegions}
          isDisabled={isDisabled}
          platform={platform}
        />
      </div>

      {showSupporterStatusSelector && (
        <div className={classes.sectionContainer}>
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
        </div>
      )}

      {showDeviceTypeSelector && (
        <div className={classes.sectionContainer}>
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
        </div>
      )}

      <div className={classes.sectionContainer}>
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
      </div>
    </div>
  );
};

export default TestEditorTargetAudienceSelector;
