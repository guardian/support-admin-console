import React from 'react';

import { Checkbox, FormControlLabel, FormGroup, Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Region, regionIds, regions } from '../../../utils/models';
import { Targeting } from '../../../models/supportLandingPage';

const useStyles = makeStyles(({ spacing }: Theme) => ({
  indentedContainer: {
    marginLeft: spacing(3),
  },
}));

interface LandingPageTestEditorTargetRegionsSelectorProps {
  targeting: Targeting;
  onTargetingUpdate: (targeting: Targeting) => void;
  isDisabled: boolean;
}

const LandingPageTestEditorTargetRegionsSelector: React.FC<LandingPageTestEditorTargetRegionsSelectorProps> = ({
  targeting,
  onTargetingUpdate,
  isDisabled,
}: LandingPageTestEditorTargetRegionsSelectorProps) => {
  const classes = useStyles();
  const allRegions = regionIds;

  const onAllRegionsChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const updatedRegions = event.target.checked ? allRegions : [];
    const updatedAllRegionTargeting = { ...targeting, countryGroups: updatedRegions };
    onTargetingUpdate(updatedAllRegionTargeting);
  };

  const onSingleRegionChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const checked = event.target.checked;
    const changedRegion = event.target.value;

    if (checked) {
      onTargetingUpdate({
        ...targeting,
        countryGroups: [...targeting.countryGroups, changedRegion as Region],
      });
    } else {
      const regionIndex = targeting.countryGroups.indexOf(changedRegion as Region);
      onTargetingUpdate({
        ...targeting,
        countryGroups: targeting.countryGroups.filter((_, index) => index !== regionIndex),
      });
    }
  };

  return (
    <FormGroup>
      <FormControlLabel
        control={
          <Checkbox
            checked={targeting.countryGroups.length === allRegions.length}
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
                checked={targeting.countryGroups.includes(region)}
                onChange={onSingleRegionChange}
                value={region}
                disabled={isDisabled}
              />
            }
            label={regions[region]}
          />
        ))}
      </FormGroup>
    </FormGroup>
  );
};

export default LandingPageTestEditorTargetRegionsSelector;
