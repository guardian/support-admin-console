import React from 'react';
import update from 'immutability-helper';

import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import RefreshIcon from '@material-ui/icons/Refresh';

import { Theme, withStyles, createStyles, WithStyles } from '@material-ui/core/styles';

interface AmountsFromServer {
  // TBC, just a placeholder for now
  US: number[],
  GB: number[],
  AU: number[],
  // ... and so on
}

enum ContributionType {
  OneOff,
  Monthly,
  Annual
}

interface ContributionTypesFromServer {
  // just a placeholder for now
  US: ContributionType[],
  GB: ContributionType[],
  AU: ContributionType[],
}

enum SwitchState {
  On = 'On', Off = 'Off'
}

enum OneOffPaymentMethod {
  stripe = 'stripe', payPal = 'payPal'
}

enum RecurringPaymentMethod {
  stripe = 'stripe', payPal = 'payPal', directDebit = 'directDebit'
}

type PaymentMethod = OneOffPaymentMethod | RecurringPaymentMethod;

interface Switches {
  oneOffPaymentMethods: {
    [p in OneOffPaymentMethod]: SwitchState
  },
  recurringPaymentMethods: {
    [p in RecurringPaymentMethod]: SwitchState
  },
  optimize: SwitchState,
  experiments: {
    [featureSwitch: string]: {
      name: string,
      description: string,
      state: SwitchState,
    }
  }
}

interface DataFromServer {
  value: Switches | AmountsFromServer | ContributionTypesFromServer,
  version: string,
}

function booleanToSwitchState(b: boolean): SwitchState {
  return b ? SwitchState.On : SwitchState.Off;
}

function switchStateToBoolean(s: SwitchState): boolean {
  return s === SwitchState.On;
}

function paymentMethodToHumanReadable(paymentMethod: string): string {
  switch (paymentMethod) {
    case RecurringPaymentMethod.directDebit: return 'Direct Debit';
    case RecurringPaymentMethod.payPal: return 'PayPal';
    case RecurringPaymentMethod.stripe: return 'Stripe';
    default: return 'Unknown';
  }
}


const styles = ({ palette, spacing, mixins }: Theme) => createStyles({
  formControl: {
    marginRight: spacing.unit * 4,
    marginBottom: spacing.unit * 4,
    paddingTop: spacing.unit,
    paddingBottom: spacing.unit,
    paddingLeft: spacing.unit * 2,
    paddingRight: spacing.unit * 2,
    border: `1px solid ${palette.grey['300']}`
  },
  button: {
    marginRight: spacing.unit * 2,
  },
  buttons: {
    marginTop: spacing.unit * 2,
  }
});

interface Props extends WithStyles<typeof styles> {}

class Switchboard extends React.Component<Props, Switches> {
  state: Switches;
  previousStateFromServer: DataFromServer | null;

  constructor(props: Props) {
    super(props);
    this.state = {
      oneOffPaymentMethods: {
        stripe: SwitchState.Off,
        payPal: SwitchState.Off,
      },
      recurringPaymentMethods: {
        stripe: SwitchState.Off,
        payPal: SwitchState.Off,
        directDebit: SwitchState.Off,
      },
      optimize: SwitchState.Off,
      experiments: {},
    };
    this.previousStateFromServer = null;
  }

  componentWillMount(): void {
    this.fetchStateFromServer();
  }

  fetchStateFromServer(): void {
    fetch('/support-frontend/switches')
      .then(resp => {
        if (!resp.ok) {
          resp.text().then(msg => alert(msg));
          throw new Error('Could not fetch initial server state');
        }

        return resp.json();
      })
      .then(serverData => {
        this.previousStateFromServer = serverData;
        this.setState({
          ...serverData.value
        });
      });
  }

  updateOneOffPaymentMethodSwitch(paymentMethod: string, switchState: SwitchState) {
    this.setState((prevState) => update(prevState, {
      oneOffPaymentMethods: {
        [paymentMethod]: { $set: switchState }
      },
    }));
  };

  updateRecurringPaymentMethodSwitch(paymentMethod: string, switchState: SwitchState) {
    this.setState((prevState) => update(prevState, {
      recurringPaymentMethods: {
        [paymentMethod]: { $set: switchState }
      },
    }));
  };

  updateFeatureSwitch(switchName: string, switchState: SwitchState) {
    this.setState((prevState) => update(prevState, {
      experiments: {
        [switchName]: {
          state: {$set: switchState }
        },
      }
    }));
  };

  saveSwitches = () => {
    const newState = update(this.previousStateFromServer, {
      value: { $set: this.state }
    });

    fetch('/support-frontend/switches/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newState),
    })
      .then(resp => {
        if (!resp.ok) {
          resp.text().then(msg => alert(msg));
        }
        this.fetchStateFromServer();
      })
      .catch((resp) => {
        alert('Error while saving');
        this.fetchStateFromServer();
      });
  };

  render(): React.ReactNode {
    const { classes } = this.props;

    return (
        <form>
          <div>
            {/* as "div", as "label" typecasts are to get around this issue: https://github.com/mui-org/material-ui/issues/13744 */}
            <FormControl component={'fieldset' as 'div'} className={classes.formControl}>
              <FormLabel component={'legend' as 'label'}>One-off contributions</FormLabel>
              {/*
              It seems no matter how I set up the types, Object.entries and Object.keys
              give a string type to the object keys. This is a bit of a shame since it would be nice
              to have an enum type for paymentMethod and then set that type on arguments to
              paymentMethodToHumanReadable and updateOneOffPaymentMethodSwitch.
            */}
              {Object.entries(this.state.oneOffPaymentMethods).map(([paymentMethod, switchState]) =>
                <FormControlLabel
                  control={
                    <Switch
                      checked={switchStateToBoolean(switchState)}
                      onChange={(ev) =>
                        this.updateOneOffPaymentMethodSwitch(paymentMethod, booleanToSwitchState(ev.target.checked))
                      }
                      value={paymentMethod}
                    />
                  }
                  label={paymentMethodToHumanReadable(paymentMethod)}
                />
              )}
            </FormControl>
            <FormControl component={'fieldset' as 'div'} className={classes.formControl}>
              <FormLabel component={'legend' as 'label'}>Recurring contributions</FormLabel>
              {Object.entries(this.state.recurringPaymentMethods).map(([paymentMethod, switchState]) =>
                <FormControlLabel
                  control={
                    <Switch
                      checked={switchStateToBoolean(switchState)}
                      onChange={(event) =>
                        this.updateRecurringPaymentMethodSwitch(paymentMethod, booleanToSwitchState(event.target.checked))
                      }
                      value={paymentMethod}
                    />
                  }
                  label={paymentMethodToHumanReadable(paymentMethod)}
                />
              )}
            </FormControl>
            <FormControl component={'fieldset' as 'div'} className={classes.formControl}>
              <FormLabel component={'legend' as 'label'}>Feature Switches</FormLabel>
              {Object.entries(this.state.experiments).map(([switchName, switchData]) =>
                <FormControlLabel
                  control={
                    <Switch
                      checked={switchStateToBoolean(switchData.state)}
                      onChange={(event) =>
                        this.updateFeatureSwitch(switchName, booleanToSwitchState(event.target.checked))
                      }
                      value={switchName}
                    />
                  }
                  label={`${switchData.name}: ${switchData.description}`}
                />
              )}
            </FormControl>
            <FormControl component={'fieldset' as 'div'} className={classes.formControl}>
              <FormLabel component={'legend' as 'label'}>Other Switches</FormLabel>
              <FormControlLabel
                control={
                  <Switch
                    checked={switchStateToBoolean(this.state.optimize)}
                    onChange={(event) => this.setState({optimize: booleanToSwitchState(event.target.checked)})}
                    value={switchStateToBoolean(this.state.optimize)}
                  />
                }
                label="Google Optimize"
              />
            </FormControl>
          </div>
          <div className={classes.buttons}>
            <Button variant="contained" onClick={this.saveSwitches} className={classes.button}>
              <SaveIcon />
              Save
            </Button>
            <Button variant="contained" onClick={() => this.fetchStateFromServer()} className={classes.button}>
              <RefreshIcon />
              Refresh
            </Button>
          </div>
        </form>
    );
  }
}

export default withStyles(styles)(Switchboard);
