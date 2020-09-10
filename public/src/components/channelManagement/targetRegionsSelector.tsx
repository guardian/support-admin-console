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

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const styles = ({ spacing, typography }: Theme) =>
  createStyles({
    selectLabel: {
      fontSize: typography.pxToRem(17),
      color: 'black',
    },
    indentedCheckbox: {
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

interface TargetRegionsSelectorProps extends WithStyles<typeof styles> {
  regions: Region[];
  onRegionsUpdate: (selectedRegions: Region[]) => void;
  isEditable: boolean;
}
class TargetRegionsSelector extends React.Component<TargetRegionsSelectorProps> {
  allRegions: Region[] = Object.values(Region);

  indeterminateStatus = (): boolean =>
    this.props.regions.length > 0 && this.props.regions.length < this.allRegions.length;

  onAllRegionsChange = (event: React.ChangeEvent<{ value: string; checked: boolean }>): void => {
    this.props.onRegionsUpdate(event.target.checked ? this.allRegions : []);
  };

  onSingleRegionChange = (event: React.ChangeEvent<{ value: string; checked: boolean }>): void => {
    const checked = event.target.checked;
    const changedRegion = event.target.value;

    if (checked) {
      this.props.onRegionsUpdate([...this.props.regions, changedRegion as Region]);
    } else {
      const regionIndex = this.props.regions.indexOf(changedRegion as Region);
      this.props.onRegionsUpdate(this.props.regions.filter((_, index) => index !== regionIndex));
    }
  };

  render(): React.ReactNode {
    const { classes } = this.props;

    return (
      <>
        <Typography className={classes.selectLabel}>Region</Typography>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={this.props.regions.length === this.allRegions.length}
                onChange={this.onAllRegionsChange}
                value={'allRegions'}
                indeterminate={this.indeterminateStatus()}
              />
            }
            label={'All regions'}
            disabled={!this.props.isEditable}
          />
          {this.allRegions.map(region => (
            <FormControlLabel
              key={region}
              control={
                <Checkbox
                  className={classes.indentedCheckbox}
                  checked={this.props.regions.indexOf(region) > -1}
                  onChange={this.onSingleRegionChange}
                  value={region}
                />
              }
              label={regionLabels[region]}
              disabled={!this.props.isEditable}
            />
          ))}
        </FormGroup>
      </>
    );
  }
}

export default withStyles(styles)(TargetRegionsSelector);
