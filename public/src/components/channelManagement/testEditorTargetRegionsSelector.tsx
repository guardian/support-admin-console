import React from 'react';

import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  Theme,
  Typography,
  WithStyles,
  createStyles,
  withStyles,
} from '@material-ui/core';
import { Region } from '../../utils/models';

const styles = ({ spacing }: Theme) =>
  createStyles({
    container: {
      '& > * + *': {
        marginTop: spacing(2),
      },
    },
    indentedContainer: {
      marginLeft: spacing(3),
    },
  });

const regionLabels = {
  AUDCountries: 'Australia',
  Canada: 'Canada',
  EURCountries: 'Europe',
  NZDCountries: 'New Zealand',
  GBPCountries: 'the UK',
  UnitedStates: 'the US',
  International: 'Rest-of-world',
};

const ALL_REGIONS = Object.values(Region);

interface TestEditorTargetRegionsSelectorProps extends WithStyles<typeof styles> {
  selectedRegions: Region[];
  onRegionsUpdate: (selectedRegions: Region[]) => void;
  isDisabled: boolean;
}
const TestEditorTargetRegionsSelector: React.FC<TestEditorTargetRegionsSelectorProps> = ({
  classes,
  selectedRegions,
  onRegionsUpdate,
  isDisabled,
}: TestEditorTargetRegionsSelectorProps) => {
  const onAllRegionsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onRegionsUpdate(event.target.checked ? ALL_REGIONS : []);
  };

  const onSingleRegionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
    <div className={classes.container}>
      <Typography>Region</Typography>
      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox
              checked={selectedRegions.length === ALL_REGIONS.length}
              value={'allRegions'}
              onChange={onAllRegionsChange}
              disabled={isDisabled}
            />
          }
          label={'All regions'}
        />
        <FormGroup className={classes.indentedContainer}>
          {ALL_REGIONS.map(region => (
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
    </div>
  );
};

export default withStyles(styles)(TestEditorTargetRegionsSelector);
