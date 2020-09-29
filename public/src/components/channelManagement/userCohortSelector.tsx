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
import { UserCohort } from './helpers/shared';

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

interface UserCohortSelectorProps extends WithStyles<typeof styles> {
  cohort: UserCohort;
  onCohortsUpdate: (selectedCohort: UserCohort) => void;
  isEditable: boolean;
}

interface UserCohortSelectorState {
  Everyone: boolean;
  AllExistingSupporters: boolean;
  AllNonSupporters: boolean;
  PostAskPauseSingleContributors: boolean;
}

class UserCohortSelector extends React.Component<UserCohortSelectorProps, UserCohortSelectorState> {
  defaultCohort = UserCohort['AllNonSupporters'];

  currentCohort = this.props.cohort;

  getUserCohort = (): UserCohort => {
    switch (true) {
      case this.state.Everyone: {
        return UserCohort['Everyone'];
      }
      case this.state.AllExistingSupporters: {
        return UserCohort['AllExistingSupporters'];
      }
      case this.state.AllNonSupporters: {
        return UserCohort['AllNonSupporters'];
      }
      default: {
        return this.defaultCohort;
      }
    }
  };

  state: UserCohortSelectorState = {
    Everyone: this.currentCohort === UserCohort['Everyone'],
    AllExistingSupporters:
      this.currentCohort === UserCohort['AllExistingSupporters'] ||
      this.currentCohort === UserCohort['Everyone'],
    AllNonSupporters:
      this.currentCohort === UserCohort['AllNonSupporters'] ||
      this.currentCohort === UserCohort['Everyone'],
    PostAskPauseSingleContributors: false,
  };

  onAllCohortsChange = (event: React.ChangeEvent<{ value: string; checked: boolean }>): void => {
    this.setState(
      {
        Everyone: event.target.checked,
        AllExistingSupporters: event.target.checked,
        AllNonSupporters: true,
      },
      () =>
        this.props.onCohortsUpdate(
          this.state.Everyone ? UserCohort['Everyone'] : this.defaultCohort,
        ),
    );
  };

  onSingleCohortChange = (event: React.ChangeEvent<{ value: string; checked: boolean }>): void => {
    const checked = event.target.checked; //whether ticked or unticked
    const changedCohort = event.target.value; //the name of the checkbox

    const updateState = (save?: () => void): void => {
      if (changedCohort === UserCohort['AllExistingSupporters']) {
        if (checked) {
          if (this.state.AllNonSupporters) {
            this.setState(
              {
                Everyone: true,
                AllExistingSupporters: true,
              },
              save,
            );
          }
        } else {
          if (this.state.AllNonSupporters) {
            this.setState(
              {
                Everyone: false,
                AllExistingSupporters: false,
              },
              save,
            );
          } else {
            this.setState(
              {
                Everyone: false,
                AllExistingSupporters: false,
                AllNonSupporters: true,
              },
              save,
            );
          }
        }
      } else {
        if (checked) {
          if (this.state.AllExistingSupporters) {
            this.setState(
              {
                Everyone: true,
                AllNonSupporters: true,
              },
              save,
            );
          } else {
            //all existing supporters unchecked
            this.setState(
              {
                Everyone: false,
                AllNonSupporters: true,
              },
              save,
            );
          }
        } else {
          this.setState(
            {
              Everyone: false,
              AllExistingSupporters: true,
              AllNonSupporters: false,
            },
            save,
          );
        }
      }
    };
    updateState(() => this.props.onCohortsUpdate(this.getUserCohort()));
  };

  render(): React.ReactNode {
    const { classes } = this.props;

    return (
      <>
        <Typography className={classes.selectLabel}>Cohort</Typography>
        <FormGroup>
          {Object.values(UserCohort).map(cohort =>
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
            ) : (
              cohort !== 'PostAskPauseSingleContributors' && (
                <FormControlLabel
                  key={cohort}
                  control={
                    <Checkbox
                      className={classes.indentedCheckbox}
                      checked={this.state[cohort]}
                      onChange={(event): void => this.onSingleCohortChange(event)}
                      value={cohort}
                    />
                  }
                  label={UserCohort[cohort]}
                  disabled={!this.props.isEditable}
                />
              )
            ),
          )}
        </FormGroup>
      </>
    );
  }
}

export default withStyles(styles)(UserCohortSelector);
