import React from 'react';

import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  Theme,
  Typography,
  WithStyles,
  createStyles,
  withStyles
} from "@material-ui/core";
import { Region } from '../../utils/models';

const styles = ({ typography }: Theme) => createStyles({
  selectLabel: {
    fontSize: typography.pxToRem(18),
    fontWeight: typography.fontWeightMedium,
    color: 'black',
  },
});

const regionLabels = {
  AUDCountries: 'Australia',
  Canada: 'Canada',
  EURCountries: 'Europe',
  NZDCountries: 'New Zealand',
  GBPCountries: 'the UK',
  UnitedStates: 'the US',
  International: 'Rest-of-world'
}

interface TargetRegionsSelectorProps extends WithStyles<typeof styles> {
  regions: Region[],
  onRegionsUpdate: (selectedRegions: Region[]) => void,
  isEditable: boolean,
}

interface TargetRegionsSelectorState {
  selectedRegions: Region[],
  allRegions: boolean,
}

class TargetRegionsSelector extends React.Component<TargetRegionsSelectorProps, TargetRegionsSelectorState> {

  state: TargetRegionsSelectorState = {
    selectedRegions: this.props.regions,
    allRegions: false,
  }

  allRegions: Region[] = Object.values(Region);
  allRegionsLength: number = this.allRegions.length;
  isIndeterminate = this.state.selectedRegions.length < this.allRegionsLength;

  // TODO: add logic to check allRegions if all regions have been ticked separately and vice versa, also to update 'allRegions' in state.
  // Should 'isIndeterminate' be in state also?

  onRegionChange = (event: React.ChangeEvent<{ value: string; checked: boolean }>) => {
    const checked = event.target.checked;
    const changedRegion = event.target.value;

    console.log({checked}, 'indeterminate', 'not allRegions', !this.state.allRegions, this.state.selectedRegions.length)

    if (checked) {
      this.setState({
        selectedRegions: changedRegion === 'allRegions' ? this.allRegions : [...this.state.selectedRegions, changedRegion as Region]
      },
      () => {
        this.props.onRegionsUpdate(this.state.selectedRegions);
        changedRegion === 'allRegions' ? this.isIndeterminate = false : this.isIndeterminate = true;
      });
    } else {
      let regionIndex = this.state.selectedRegions.indexOf(changedRegion as Region);
      this.setState({
        selectedRegions: changedRegion === 'allRegions' ? [] : this.state.selectedRegions.filter((_, index) => index !== regionIndex)
      }, () => {
        this.props.onRegionsUpdate(this.state.selectedRegions);
        changedRegion === 'allRegions' ? this.isIndeterminate = false : this.isIndeterminate = true;
      });
    }
    this.setState({
      allRegions: checked && changedRegion === 'allRegions'
    });
  }

  render(): React.ReactNode {
    const { classes } = this.props;

    return (
      <>
        <Typography className={classes.selectLabel}>Target regions</Typography>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={this.state.allRegions}
                  onChange={this.onRegionChange}
                  value={'allRegions'}
                  indeterminate={this.isIndeterminate}
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
                    checked={this.state.selectedRegions.indexOf(region) > -1}
                    onChange={this.onRegionChange}
                    value={region}
                  />
                }
                label={regionLabels[region]}
                disabled={!this.props.isEditable}
              />
            ))}
        </FormGroup>
      </>
    )
  }
}

export default withStyles(styles)(TargetRegionsSelector);
