import React from 'react';

import { Checkbox, FormControlLabel, FormGroup, Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Region, regions, regionIds } from '../../utils/models';
import { RegionTargeting, TestPlatform } from './helpers/shared';

const useStyles = makeStyles(({ spacing }: Theme) => ({
  indentedContainer: {
    marginLeft: spacing(3),
  },
}));

interface TestEditorTargetRegionsSelectorProps {
  regionTargeting: RegionTargeting;
  onRegionTargetingUpdate: (regionTargeting: RegionTargeting) => void;
  supportedRegions?: Region[];
  isDisabled: boolean;
  platform?: TestPlatform;
}

const TestEditorTargetRegionsSelector: React.FC<TestEditorTargetRegionsSelectorProps> = ({
  regionTargeting,
  onRegionTargetingUpdate,
  supportedRegions,
  isDisabled,
  platform,
}: TestEditorTargetRegionsSelectorProps) => {
  const classes = useStyles();
  const allRegions = (supportedRegions as Region[]) || regionIds;

  const onAllRegionsChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const updatedRegions = event.target.checked ? allRegions : [];
    const updatedAllRegionTargeting = { ...regionTargeting, targetedCountryGroups: updatedRegions };
    onRegionTargetingUpdate(updatedAllRegionTargeting);
  };

  const onSingleRegionChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const checked = event.target.checked;
    const changedRegion = event.target.value;

    if (checked) {
      onRegionTargetingUpdate({
        ...regionTargeting,
        targetedCountryGroups: [...regionTargeting.targetedCountryGroups, changedRegion as Region],
      });
    } else {
      const regionIndex = regionTargeting.targetedCountryGroups.indexOf(changedRegion as Region);
      onRegionTargetingUpdate({
        ...regionTargeting,
        targetedCountryGroups: regionTargeting.targetedCountryGroups.filter(
          (_, index) => index !== regionIndex,
        ),
      });
    }
  };

  const checkLabelByChannel = (platform: TestPlatform | undefined, region: Region) => {
    if (platform === 'APPLE_NEWS' && region === 'UnitedStates') {
      return 'the US + Canada';
    }
    return regions[region];
  };

  return (
    <FormGroup>
      <FormControlLabel
        control={
          <Checkbox
            checked={regionTargeting.targetedCountryGroups?.length === allRegions.length}
            value={'allRegions'}
            onChange={onAllRegionsChange}
            disabled={isDisabled}
          />
        }
        label={'All supported regions'}
      />
      <FormGroup className={classes.indentedContainer}>
        {allRegions.map(region => (
          <FormControlLabel
            key={region}
            control={
              <Checkbox
                checked={regionTargeting.targetedCountryGroups.includes(region)}
                onChange={onSingleRegionChange}
                value={region}
                disabled={isDisabled}
              />
            }
            label={checkLabelByChannel(platform, region)}
          />
        ))}
      </FormGroup>
    </FormGroup>
  );
};

export default TestEditorTargetRegionsSelector;
