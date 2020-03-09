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
          </FormControl>
    )
  }
}

export default withStyles(styles)(TargetRegionsSelector);
