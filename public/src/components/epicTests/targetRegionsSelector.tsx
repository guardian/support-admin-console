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

const styles = ({ spacing, typography }: Theme) => createStyles({
  selectLabel: {
    fontSize: typography.pxToRem(18),
    fontWeight: typography.fontWeightMedium,
    color: 'black',
  },
  indentedCheckbox: {
    marginLeft: spacing(3),
  }
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
  indeterminate: boolean,
}

class TargetRegionsSelector extends React.Component<TargetRegionsSelectorProps, TargetRegionsSelectorState> {

  allRegions: Region[] = Object.values(Region);
  allRegionsLength: number = this.allRegions.length;

  setAllRegions = (all: boolean) => {
    this.setState({
      allRegions: all
    });
  }

  setAllOrNoSelectedRegions = (all: boolean) => {
    this.setState({
      selectedRegions: all ? this.allRegions : [],
    })
  }

  setIndeterminate = (checked: boolean) => {
    this.setState({
      indeterminate: checked
    })
  }

  allRegionsStatus = (checkedRegions: Region[]): boolean => checkedRegions.length === this.allRegionsLength;

  indeterminateStatus = (checkedRegions: Region[]): boolean => checkedRegions.length > 0 && checkedRegions.length < this.allRegionsLength;

  state: TargetRegionsSelectorState = {
    selectedRegions: this.props.regions,
    allRegions: this.allRegionsStatus(this.props.regions),
    indeterminate: this.indeterminateStatus(this.props.regions),
  }

  onAllRegionsChange = (event: React.ChangeEvent<{ value: string; checked: boolean }>) => {
    if (event.target.checked) {
      this.setAllRegions(true);
      this.setAllOrNoSelectedRegions(true);
      this.props.onRegionsUpdate(this.allRegions);
    } else {
      this.setAllRegions(false);
      this.setAllOrNoSelectedRegions(false);
      this.props.onRegionsUpdate([]);
    }
    this.setIndeterminate(false);
  }

  onSingleRegionChange = (event: React.ChangeEvent<{ value: string; checked: boolean }>) => {
    const checked = event.target.checked;
    const changedRegion = event.target.value;

    if (checked) {
      this.setState({
        selectedRegions: [...this.state.selectedRegions, changedRegion as Region]
      },
      () => {
        if (this.allRegionsStatus(this.state.selectedRegions)) {
          this.setAllRegions(true);
          this.setIndeterminate(false);
        } else {
          this.setAllRegions(false);
          this.setIndeterminate(true);
        }
        this.props.onRegionsUpdate(this.state.selectedRegions);
      });
    } else {
      let regionIndex = this.state.selectedRegions.indexOf(changedRegion as Region);
      this.setState({
        selectedRegions: this.state.selectedRegions.filter((_, index) => index !== regionIndex)
      }, () => {
        if (this.state.selectedRegions.length === 0) {
          this.setAllRegions(false);
          this.setIndeterminate(false);
        } else {
          this.setAllRegions(false);
          this.setIndeterminate(true);
        }
        this.props.onRegionsUpdate(this.state.selectedRegions);
      });
    }
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
                  onChange={this.onAllRegionsChange}
                  value={'allRegions'}
                  indeterminate={this.state.indeterminate}
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
    )
  }
}

export default withStyles(styles)(TargetRegionsSelector);
