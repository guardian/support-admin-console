import React from 'react';

import { Checkbox, FormControlLabel, FormGroup, Theme, makeStyles } from '@material-ui/core';
import { Region, Regions } from '../../utils/models';
import { TestPlatform } from './helpers/shared';

const useStyles = makeStyles(({ spacing }: Theme) => ({
  indentedContainer: {
    marginLeft: spacing(3),
  },
}));

interface TestEditorTargetRegionsSelectorProps {
  selectedRegions: Region[];
  onRegionsUpdate: (selectedRegions: Region[]) => void;
  supportedRegions?: Region[];
  isDisabled: boolean;
  platform?: TestPlatform;
}

const definedRegions = Object.keys(Regions) as Region[];

const TestEditorTargetRegionsSelector: React.FC<TestEditorTargetRegionsSelectorProps> = ({
  selectedRegions,
  onRegionsUpdate,
  supportedRegions,
  isDisabled,
  platform,
}: TestEditorTargetRegionsSelectorProps) => {
  const classes = useStyles();
  const allRegions = supportedRegions as Region[] || definedRegions;

  const onAllRegionsChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    onRegionsUpdate(event.target.checked ? allRegions : []);
  };

  const onSingleRegionChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const checked = event.target.checked;
    const changedRegion = event.target.value;

    if (checked) {
      onRegionsUpdate([...selectedRegions, changedRegion as Region]);
    } else {
      const regionIndex = selectedRegions.indexOf(changedRegion as Region);
      onRegionsUpdate(selectedRegions.filter((_, index) => index !== regionIndex));
    }
  };

  const checkLabelByChannel = (platform: TestPlatform | undefined, region: Region) => {
    if (platform === 'APPLE_NEWS' && region === 'UnitedStates') {
      return 'the US + Canada';
    }
    return Regions[region];
  };

  return (
    <FormGroup>
      <FormControlLabel
        control={
          <Checkbox
            checked={selectedRegions.length === allRegions.length}
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
                checked={selectedRegions.includes(region)}
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
