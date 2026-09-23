import { Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';
import { Region, regionIds, regions } from '../../utils/models';
import { RegionTargeting, TestPlatform } from './helpers/shared';

const IndentedContainer = styled(FormGroup)(({ theme }) => ({ marginLeft: theme.spacing(3) }));

interface TestEditorTargetRegionsSelectorProps {
  regionTargeting?: RegionTargeting;
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
  const allRegions = supportedRegions ?? regionIds;

  // Guard against undefined regionTargeting during test switching
  const safeRegionTargeting = regionTargeting ?? { targetedCountryGroups: [] };

  const onAllRegionsChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const updatedRegions = event.target.checked ? allRegions : [];
    const updatedAllRegionTargeting = {
      ...safeRegionTargeting,
      targetedCountryGroups: updatedRegions,
    };
    onRegionTargetingUpdate(updatedAllRegionTargeting);
  };

  const onSingleRegionChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const checked = event.target.checked;
    const changedRegion = event.target.value as Region;

    if (checked) {
      onRegionTargetingUpdate({
        ...safeRegionTargeting,
        targetedCountryGroups: [...safeRegionTargeting.targetedCountryGroups, changedRegion],
      });
    } else {
      const regionIndex = safeRegionTargeting.targetedCountryGroups.indexOf(changedRegion);
      onRegionTargetingUpdate({
        ...safeRegionTargeting,
        targetedCountryGroups: safeRegionTargeting.targetedCountryGroups.filter(
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
            checked={safeRegionTargeting.targetedCountryGroups.length === allRegions.length}
            value={'allRegions'}
            onChange={onAllRegionsChange}
            disabled={isDisabled}
          />
        }
        label={'All supported regions'}
      />
      <IndentedContainer>
        {allRegions.map((region) => (
          <FormControlLabel
            key={region}
            control={
              <Checkbox
                checked={safeRegionTargeting.targetedCountryGroups.includes(region)}
                onChange={onSingleRegionChange}
                value={region}
                disabled={isDisabled}
              />
            }
            label={checkLabelByChannel(platform, region)}
          />
        ))}
      </IndentedContainer>
    </FormGroup>
  );
};

export default TestEditorTargetRegionsSelector;
