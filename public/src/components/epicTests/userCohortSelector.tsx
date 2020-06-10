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
  cohort: UserCohort,
  onCohortsUpdate: (selectedCohort: UserCohort) => void,
  isEditable: boolean,
}

interface UserCohortSelectorState {
  Everyone: boolean,
  AllExistingSupporters: boolean,
  AllNonSupporters: boolean,
  PostAskPauseSingleContributors: boolean,
}

class UserCohortSelector extends React.Component<UserCohortSelectorProps, UserCohortSelectorState> {

  defaultCohort = UserCohort['AllNonSupporters'];

  currentCohort = this.props.cohort;

  indeterminateStatus = (): boolean => !this.state.Everyone;

  getUserCohort = (): UserCohort => {
    switch(true) {
      case this.state.Everyone: {
        return UserCohort['Everyone']
      }
      case this.state.AllExistingSupporters: {
        return UserCohort['AllExistingSupporters']
      }
      case this.state.AllNonSupporters: {
        return UserCohort['AllNonSupporters']
      }
      default: {
        return this.defaultCohort
      }
    }
  }

  state: UserCohortSelectorState = {
    Everyone: this.currentCohort === UserCohort['Everyone'],
    AllExistingSupporters: this.currentCohort === UserCohort['AllExistingSupporters'],
    AllNonSupporters: this.currentCohort === UserCohort['AllNonSupporters'],
    PostAskPauseSingleContributors: false,
  }

  onAllCohortsChange = (event: React.ChangeEvent<{ value: string; checked: boolean }>) => {
      this.setState({
        Everyone: event.target.checked,
        AllExistingSupporters: event.target.checked,
        AllNonSupporters: true,
      },
        () => this.props.onCohortsUpdate(this.state.Everyone ? UserCohort['Everyone'] : this.defaultCohort)
      );
  }

  onSingleCohortChange = (event: React.ChangeEvent<{ value: string; checked: boolean }>, cohort: UserCohort) => {
    const checked = event.target.checked; //whether ticked or unticked
    const changedCohort = event.target.value; //the name of the checkbox

    if (changedCohort === UserCohort['AllExistingSupporters']){
      if (checked){
        if (this.state.AllNonSupporters){
          this.setState({
            Everyone: true,
            AllExistingSupporters: true,
            AllNonSupporters: true,
          })
        }
      } else {
        if (this.state.AllNonSupporters){
          this.setState({
            Everyone: false,
            AllExistingSupporters: false,
          })
        } else {
          this.setState({
            Everyone: false,
            AllExistingSupporters: false,
            AllNonSupporters: true,
          })
        }
      }
    } else {
      if (checked){
        if (this.state.AllExistingSupporters) {
          this.setState({
            Everyone: true,
            AllExistingSupporters: true,
            AllNonSupporters: true,
          })
        }
        else { //all existing supporters unchecked
          this.setState({
            Everyone: false,
            AllExistingSupporters: false,
            AllNonSupporters: true,
          })
        }
      } else {
        this.setState({
          Everyone: false,
          AllExistingSupporters: true,
          AllNonSupporters: false,
        })
      }
    }
  }

  render(): React.ReactNode {
    const { classes } = this.props;

    return (
      <>
        <Typography className={classes.selectLabel}>Cohort</Typography>
          <FormGroup>
            {Object.values(UserCohort).map(cohort => (
            cohort === 'Everyone' ? (
              <FormControlLabel
              key={cohort}
              control={
                <Checkbox
                  checked={this.state.Everyone}
                  onChange={this.onAllCohortsChange}
                  value={cohort}
                  indeterminate={false}
                />
              }
              label={'Everyone'}
              disabled={!this.props.isEditable}
              />
            ) :
            (
              cohort !== 'PostAskPauseSingleContributors' && (
                <FormControlLabel
                key={cohort}
                control={
                  <Checkbox
                    className={classes.indentedCheckbox}
                    checked={this.state[cohort]}
                    onChange={event => this.onSingleCohortChange(event, cohort)}
                    value={cohort}
                  />
                }
                label={UserCohort[cohort]}
                disabled={!this.props.isEditable}
              />
              ))))}
        </FormGroup>
      </>
    )
  }
}

export default withStyles(styles)(UserCohortSelector);
