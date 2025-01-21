import React from 'react';

import { Checkbox, FormControlLabel, FormGroup, Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Region, regions, regionIds, europeanCountries } from '../../utils/models';
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

const TestEditorTargetRegionsSelector: React.FC<TestEditorTargetRegionsSelectorProps> = ({
  selectedRegions,
  onRegionsUpdate,
  supportedRegions,
  isDisabled,
  platform,
}: TestEditorTargetRegionsSelectorProps) => {
  const classes = useStyles();
  const allRegions = (supportedRegions as Region[]) || regionIds;

  const onAllRegionsChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    onRegionsUpdate(event.target.checked ? allRegions : []);
  };

  const onSingleRegionChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const checked = event.target.checked;
    const changedRegion = event.target.value as Region;

    let updatedRegions = [...selectedRegions];

    if (checked) {
      updatedRegions.push(changedRegion);
      if (changedRegion === 'EURCountries') {
        europeanCountries.forEach(country => {
          if (!updatedRegions.includes(country)) {
            updatedRegions.push(country);
          }
        });
      }
    } else {
      updatedRegions = updatedRegions.filter(region => region !== changedRegion);
      if (europeanCountries.includes(changedRegion) && updatedRegions.includes('EURCountries')) {
        updatedRegions = updatedRegions.filter(region => region !== 'EURCountries');
      }
    }

    onRegionsUpdate(updatedRegions);
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
            checked={selectedRegions.length === allRegions.length}
            value={'allRegions'}
            onChange={onAllRegionsChange}
            disabled={isDisabled}
          />
        }
        label={'All supported regions'}
      />
      <FormGroup className={classes.indentedContainer}>
        {allRegions.map(region => {
          const isExtraIndented = europeanCountries.includes(region);
          return (
            <FormControlLabel
              key={region}
              className={isExtraIndented ? classes.indentedContainer : ''}
              control={
                <Checkbox
                  checked={selectedRegions.includes(region)}
                  onChange={onSingleRegionChange}
                  value={region}
                  disabled={
                    isDisabled ||
                    (europeanCountries.includes(region) && selectedRegions.includes('EURCountries'))
                  }
                />
              }
              label={checkLabelByChannel(platform, region)}
            />
          );
        })}
      </FormGroup>
    </FormGroup>
  );
};

export default TestEditorTargetRegionsSelector;
