import React from 'react';

import { Theme, WithStyles, createStyles, withStyles, Typography } from '@material-ui/core';
import { Region } from '../../utils/models';
import { DeviceType, UserCohort } from './helpers/shared';

import TestEditorTargetRegionsSelector from './testEditorTargetRegionsSelector';
import TestEditorTargetSupporterStatusSelector from './testEditorTargetSupporterStatusSelector';
import TestEditorTargetDeviceType from './testEditorTargetDeviceType';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const styles = ({ spacing, palette }: Theme) =>
  createStyles({
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
  });

interface TestEditorTargetAudienceSelectorProps extends WithStyles<typeof styles> {
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
}
const TestEditorTargetAudienceSelector: React.FC<TestEditorTargetAudienceSelectorProps> = ({
  classes,
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
}: TestEditorTargetAudienceSelectorProps) => {
  return (
    <div className={classes.container}>
      <div className={classes.sectionContainer}>
        <Typography className={classes.heading}>Region</Typography>
        <TestEditorTargetRegionsSelector
          selectedRegions={selectedRegions}
          onRegionsUpdate={onRegionsUpdate}
          supportedRegions={supportedRegions}
          isDisabled={isDisabled}
        />
      </div>

      {showSupporterStatusSelector && (
        <div className={classes.sectionContainer}>
          <Typography className={classes.heading}>Supporter Status</Typography>
          <TestEditorTargetSupporterStatusSelector
            selectedCohort={selectedCohort}
            onCohortChange={onCohortChange}
            isDisabled={isDisabled}
          />
        </div>
      )}

      {showDeviceTypeSelector && (
        <div className={classes.sectionContainer}>
          <Typography className={classes.heading}>Device Type</Typography>
          <TestEditorTargetDeviceType
            selectedDeviceType={selectedDeviceType}
            onChange={onDeviceTypeChange}
            isDisabled={isDisabled}
          />
        </div>
      )}
    </div>
  );
};

export default withStyles(styles)(TestEditorTargetAudienceSelector);
