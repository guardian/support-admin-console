import React, { ReactNode } from 'react';

import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  Theme,
  WithStyles,
  createStyles,
  withStyles
} from "@material-ui/core";
import { Region } from '../../utils/models';

const styles = ({ spacing, typography }: Theme) => createStyles({
  formControl: {
    marginTop: spacing(2),
    marginBottom: spacing(1),
    display: 'block',
  },
  select: {
    minWidth: "460px",
    paddingTop: "10px",
    marginBottom: "20px"
  },
  selectLabel: {
    fontSize: typography.pxToRem(22),
    fontWeight: typography.fontWeightMedium,
    color: 'black'
  },
});

interface TargetRegionsSelectorProps extends WithStyles<typeof styles> {
  regions: Region[],
  onRegionsUpdate: (selectedRegions: Region[]) => void,
  isEditable: boolean,
}

interface TargetRegionsSelectorState {
  selectedRegions: Region[],
}

class TargetRegionsSelector extends React.Component<TargetRegionsSelectorProps, TargetRegionsSelectorState> {

  state: TargetRegionsSelectorState = {
    selectedRegions: this.props.regions,
  }

  onRegionChange = (event: React.ChangeEvent<{ value: string; checked: boolean }>) => {
    console.log('selectedRegions before', this.state.selectedRegions);
    const checked = event.target.checked;
    console.log({checked});
    const changedRegion = event.target.value as Region;
    console.log({changedRegion})
    const indexOfRegion = this.state.selectedRegions.indexOf(changedRegion);
    console.log({indexOfRegion});
    if (indexOfRegion < 0){
      this.setState(prevState => ({
        ...prevState,
        selectedRegions: [...prevState.selectedRegions, changedRegion]
      }));
      console.log('selected regions after spread', this.state.selectedRegions);
    } else {
      this.setState(prevState => ({
        ...prevState,
        selectedRegions: prevState.selectedRegions.filter(r => r !== changedRegion) }));
      console.log('selectedRegions after splice', this.state.selectedRegions);
    }
  }


  render(): React.ReactNode {
    const { classes } = this.props;

    return (
      <FormControl
            className={classes.formControl}
          >
              <InputLabel
                className={classes.selectLabel}
                shrink
                htmlFor="locations-select-multiple-checkbox">
                  Target regions:
              </InputLabel>
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
                    label={region}
                    disabled={!this.props.isEditable}
                  />
                ))
                }
              </FormGroup>
{/*
              <Select
                className={classes.select}
                multiple
                value={this.state.selectedRegions}
                onChange={this.onRegionChange}
                input={<Input id="locations-select-multiple-checkbox" />}
                renderValue={selected => (selected as string[]).join(', ')}
                disabled={!this.props.isEditable}
                open
                displayEmpty
              >
                {Object.values(Region).map(region => (
                  <MenuItem key={region} value={region} >
                    <Checkbox checked={this.props.regions.indexOf(region) > -1} />
                    <ListItemText primary={region} />
                  </MenuItem>
                ))}
              </Select> */}
          </FormControl>

    )
  }
}

export default withStyles(styles)(TargetRegionsSelector);
