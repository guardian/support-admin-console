import React from 'react';

import { Checkbox, FormControlLabel, FormGroup, Theme, makeStyles } from '@material-ui/core';
import { Region } from '../../utils/models';

const useStyles = makeStyles(({ spacing }: Theme) => ({
  indentedContainer: {
    marginLeft: spacing(3),
  },
}));

const regionLabels = {
  AUDCountries: 'Australia',
  Canada: 'Canada',
  EURCountries: 'Europe',
  NZDCountries: 'New Zealand',
  GBPCountries: 'the UK',
  UnitedStates: 'the US + Canada',
  International: 'Rest-of-world',
};

const ALL_REGIONS = Object.values(Region);

interface TestEditorTargetRegionsSelectorProps {
  selectedRegions: Region[];
  onRegionsUpdate: (selectedRegions: Region[]) => void;
  supportedRegions?: Region[];
  isDisabled: boolean;
}
const TestEditorTargetRegionsSelector: React.FC<TestEditorTargetRegionsSelectorProps> = ({
  selectedRegions,
  onRegionsUpdate,
  supportedRegions,
  isDisabled,
}: TestEditorTargetRegionsSelectorProps) => {
  const classes = useStyles();
  const allRegions = supportedRegions || ALL_REGIONS;

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
            label={regionLabels[region]}
          />
        ))}
      </FormGroup>
    </FormGroup>
  );
};

export default TestEditorTargetRegionsSelector;
