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

  allRegions = Object.values(Region);

  onAllRegionsChange = (event: React.ChangeEvent<{ value: string; checked: boolean }>): void => {
    if (event.target.checked) {
      this.setState({
        selectedRegions: Object.values(Region),
        allRegions: true,
      }),
      () => {
        this.props.onRegionsUpdate(this.state.selectedRegions);
      }
    } else {
      this.setState({
        selectedRegions: [],
        allRegions: false,
      }),
      () => {
        this.props.onRegionsUpdate(this.state.selectedRegions);
      }
    }
  }


  onRegionChange = (event: React.ChangeEvent<{ value: string; checked: boolean }>) => {
    const checked = event.target.checked;
    const changedRegion = event.target.value as Region;

    if (checked){
      if (this.state.selectedRegions.length === Object.values(Region).length) {
      }
      this.setState({
        selectedRegions: [...this.state.selectedRegions, changedRegion]
      },
      () => {
        this.props.onRegionsUpdate(this.state.selectedRegions);
      });
    } else {
      let regionIndex = this.state.selectedRegions.indexOf(changedRegion);
      this.setState({
        selectedRegions: this.state.selectedRegions.filter((_, index) => index !== regionIndex)
      }, () => {
        this.props.onRegionsUpdate(this.state.selectedRegions);
      });
    }
  }

  render(): React.ReactNode {
    const { classes } = this.props;

    return (
      <>
        <Typography className={classes.selectLabel}>Target regions</Typography>
          <FormControlLabel
            control={
              <Checkbox
                checked={this.state.allRegions || this.state.selectedRegions.length === Object.values(Region).length}
                onChange={this.onAllRegionsChange}
                value={'Global'}
                indeterminate={!this.state.allRegions && this.state.selectedRegions.length > 0 && this.state.selectedRegions.length !== Object.values(Region).length}
              />
            }
            label={'All regions'}
            disabled={!this.props.isEditable}
          />
          <FormGroup>
            {Object.values(Region).map(region => (
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
