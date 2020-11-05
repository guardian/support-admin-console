import React from 'react';

import { Theme, WithStyles, createStyles, withStyles } from '@material-ui/core';
import { Region } from '../../utils/models';
import { UserCohort } from './helpers/shared';

import TestEditorTargetRegionsSelector from './testEditorTargetRegionsSelector';
import TestEditorTargetSupporterStatusSelector from './testEditorTargetSupporterStatusSelector';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const styles = ({ spacing }: Theme) =>
  createStyles({
    container: {
      display: 'flex',

      '& > * + *': {
        marginLeft: spacing(30),
      },
    },
  });

interface TestEditorTargetAudienceSelectorProps extends WithStyles<typeof styles> {
  selectedRegions: Region[];
  onRegionsUpdate: (selectedRegions: Region[]) => void;
  selectedCohort: UserCohort;
  onCohortChange: (updatedCohort: UserCohort) => void;
  isDisabled: boolean;
  showSupporterStatusSelector: boolean;
}
const TestEditorTargetAudienceSelector: React.FC<TestEditorTargetAudienceSelectorProps> = ({
  classes,
  selectedRegions,
  onRegionsUpdate,
  selectedCohort,
  onCohortChange,
  isDisabled,
  showSupporterStatusSelector,
}: TestEditorTargetAudienceSelectorProps) => {
  return (
    <div className={classes.container}>
      <TestEditorTargetRegionsSelector
        selectedRegions={selectedRegions}
        onRegionsUpdate={onRegionsUpdate}
        isDisabled={isDisabled}
      />

      {showSupporterStatusSelector && (
        <TestEditorTargetSupporterStatusSelector
          selectedCohort={selectedCohort}
          onCohortChange={onCohortChange}
          isDisabled={isDisabled}
        />
      )}
    </div>
  );
};

export default withStyles(styles)(TestEditorTargetAudienceSelector);
