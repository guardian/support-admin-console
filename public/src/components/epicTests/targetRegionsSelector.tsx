import React, { ReactNode } from 'react';

import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  Radio,
  RadioGroup,
  Theme,
  Typography,
  WithStyles,
  createStyles,
  withStyles
} from "@material-ui/core";
import { Region } from '../../utils/models';

const styles = ({ spacing, typography }: Theme) => createStyles({
  selectLabel: {
    fontSize: typography.pxToRem(22),
    fontWeight: typography.fontWeightMedium,
    color: 'black',
    // marginBottom: "120px",
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
  targetRegion: TargetRegion | null,
}

type TargetRegion = 'Global' | 'Select'

class TargetRegionsSelector extends React.Component<TargetRegionsSelectorProps, TargetRegionsSelectorState> {

  state: TargetRegionsSelectorState = {
    selectedRegions: this.props.regions,
    targetRegion: null
  }

  allRegions = Object.values(Region);

  renderRegions = () => (
    <FormGroup>
      {Object.values(Region).map(region => (
        <FormControlLabel
          key={region}
          control={
            <Checkbox
              checked={this.state.selectedRegions.indexOf(region) > -1}
              onChange={this.onRegionChange}
              value={region} />
          }
          label={regionLabels[region]}
          disabled={!this.props.isEditable}
        />
      ))}
    </FormGroup>
  );

  onRadioChange = (targetRegion: TargetRegion): void => {
    this.setState({
      targetRegion
    });
    if (targetRegion === 'Global') {
      this.setState({
        selectedRegions: Object.values(Region)
      }),
      () => {
        this.props.onRegionsUpdate(this.state.selectedRegions); // TODO
      }
    }
  }

  onRegionChange = (event: React.ChangeEvent<{ value: string; checked: boolean }>) => {
    const checked = event.target.checked;
    const changedRegion = event.target.value as Region;

    if (checked){
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
      <Typography>Target regions</Typography>

        <RadioGroup
          value={this.state.targetRegion}
          onChange={(event, value) => this.onRadioChange(value as TargetRegion)}
        >
          <FormControlLabel
              value={'Global'}
              control={<Radio />}
              label={'International (ALL)'}
              disabled={!this.props.isEditable}
            />
          <FormControlLabel
            value={'Select'}
            control={<Radio />}
            label={'Select region(s)'}
            disabled={!this.props.isEditable}
          />
        </RadioGroup>
        <FormControl>
        {this.state.targetRegion === 'Select' && this.renderRegions()}
      </FormControl>
      </>
    )
  }
}

export default withStyles(styles)(TargetRegionsSelector);
