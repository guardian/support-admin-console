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

interface TargetRegionsSelectorState {
  selectedRegions: Region[];
}

class TargetRegionsSelector extends React.Component<
  TargetRegionsSelectorProps,
  TargetRegionsSelectorState
> {
  allRegions: Region[] = Object.values(Region);

  indeterminateStatus = (): boolean =>
    this.state.selectedRegions.length > 0 &&
    this.state.selectedRegions.length < this.allRegions.length;

  state: TargetRegionsSelectorState = {
    selectedRegions: this.props.regions,
  };

  onAllRegionsChange = (event: React.ChangeEvent<{ value: string; checked: boolean }>) => {
    this.setState(
      {
        selectedRegions: event.target.checked ? this.allRegions : [],
      },
      () => this.props.onRegionsUpdate(this.state.selectedRegions),
    );
  };

  onSingleRegionChange = (event: React.ChangeEvent<{ value: string; checked: boolean }>) => {
    const checked = event.target.checked;
    const changedRegion = event.target.value;

    const newSelectedRegions = () => {
      if (checked) {
        return [...this.state.selectedRegions, changedRegion as Region];
      } else {
        const regionIndex = this.state.selectedRegions.indexOf(changedRegion as Region);
        return this.state.selectedRegions.filter((_, index) => index !== regionIndex);
      }
    };

    this.setState(
      {
        selectedRegions: newSelectedRegions(),
      },
      () => this.props.onRegionsUpdate(this.state.selectedRegions),
    );
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
                checked={this.state.selectedRegions.length === this.allRegions.length}
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
                  checked={this.state.selectedRegions.indexOf(region) > -1}
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
