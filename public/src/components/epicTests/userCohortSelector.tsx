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
import { UserCohort } from "../epicTests/epicTestsForm"; //toDo make all shared

const styles = ({ spacing, typography }: Theme) => createStyles({
  selectLabel: {
    fontSize: typography.pxToRem(17),
    color: 'black',
  },
  indentedCheckbox: {
    marginLeft: spacing(3),
  }
});

interface UserCohortSelectorProps extends WithStyles<typeof styles> {
  cohorts: UserCohort,
  onCohortsUpdate: (selectedCohort: UserCohort) => void,
  isEditable: boolean,
}

interface UserCohortSelectorState {
  selectedCohorts: UserCohort[],
}

class UserCohortSelector extends React.Component<UserCohortSelectorProps, UserCohortSelectorState> {

  allCohorts: UserCohort[] = Object.values(UserCohort);

  indeterminateStatus = (): boolean => this.state.selectedCohorts.length > 0 && this.state.selectedCohorts.length < this.allCohorts.length;

  state: UserCohortSelectorState = {
    selectedCohorts: this.props.cohorts,
  }

  onAllCohortsChange = (event: React.ChangeEvent<{ value: string; checked: boolean }>) => {
      this.setState({
        selectedCohorts: event.target.checked ? this.allCohorts : []
      },
        () => this.props.onCohortsUpdate(this.state.selectedCohorts)
      );
  }

  onSingleCohortChange = (event: React.ChangeEvent<{ value: string; checked: boolean }>) => {
    const checked = event.target.checked;
    const changedCohort = event.target.value;

    const newSelectedCohorts = () => {
      if (checked) {
        return [...this.state.selectedCohorts, changedCohort as UserCohort]
      } else {
        const cohortIndex = this.state.selectedCohorts.indexOf(changedCohort as UserCohort);
        return this.state.selectedCohorts.filter((_, index) => index !== cohortIndex)
      }
    };

    this.setState({
      selectedCohorts: newSelectedCohorts()
    },
      () => this.props.onCohortsUpdate(this.state.selectedCohorts)
    );
  }

  render(): React.ReactNode {
    const { classes } = this.props;

  //   <FormControl
  //   className={classes.formControl}>
  //   <InputLabel
  //     className={classes.selectLabel}
  //     shrink
  //     htmlFor="user-cohort">
  //     Supporter status
  //   </InputLabel>
  //   <RadioGroup
  //     className={classes.radio}
  //     value={test.userCohort}
  //     onChange={this.onUserCohortChange}
  //   >
  //     {Object.values(UserCohort).map(cohort =>
  //       <FormControlLabel
  //         value={cohort}
  //         key={cohort}
  //         control={<Radio />}
  //         label={cohort}
  //         disabled={!this.isEditable()}
  //       />
  //     )}
  //   </RadioGroup>
  // </FormControl>

    return (
      <>
        <Typography className={classes.selectLabel}>Cohort</Typography>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={this.state.selectedCohorts.length === this.allCohorts.length}
                  onChange={this.onAllCohortsChange}
                  value={'allCohorts'}
                  indeterminate={this.indeterminateStatus()}
                />
              }
              label={'All cohorts'}
              disabled={!this.props.isEditable}
            />
            {this.allCohorts.map(cohort => (
              <FormControlLabel
                key={cohort}
                control={
                  <Checkbox
                    className={classes.indentedCheckbox}
                    checked={this.state.selectedCohorts.indexOf(cohort) > -1}
                    onChange={this.onSingleCohortChange}
                    value={cohort}
                  />
                }
                label={UserCohort[cohort]}
                disabled={!this.props.isEditable}
              />
            ))}
        </FormGroup>
      </>
    )
  }
}

export default withStyles(styles)(UserCohortSelector);
