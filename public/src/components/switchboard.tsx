import React from 'react';
import update from 'immutability-helper';

import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';


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
  // TODO: remove .switches when switch file is updated with Tom's changes
  value: { switches: Switches } | AmountsFromServer | ContributionTypesFromServer,
  version: string,
}

function booleanToSwitchState(b: boolean): SwitchState {
  return b ? SwitchState.On : SwitchState.Off
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

export class Switchboard extends React.Component<{}, Switches> {
  state: Switches;
  previousStateFromServer: DataFromServer | null;

  constructor(props: {}) {
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
          // TODO: remove .switches when switch file is updated with Tom's changes
          ...serverData.value.switches
        });
      })
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
      // TODO: remove .switches when switch file is updated with Tom's changes
      value: { switches: { $set: this.state } }
    });

    fetch('/support-frontend/switches/update', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
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
    return (
      <div>
        {/* as "div", as "label" typecasts are to get around this issue: https://github.com/mui-org/material-ui/issues/13744 */}
        <FormControl component={"fieldset" as "div"}>
          <FormLabel component={"legend" as "label"}>One-off contributions</FormLabel>
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
        <FormControl component={"fieldset" as "div"}>
          <FormLabel component={"legend" as "label"}>Recurring contributions</FormLabel>
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
        <FormControl component={"fieldset" as "div"}>
          <FormLabel component={"legend" as "label"}>Feature Switches</FormLabel>
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
        <FormControl component={"fieldset" as "div"}>
          <FormLabel component={"legend" as "label"}>Other Switches</FormLabel>
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
        <Button variant="contained" onClick={this.saveSwitches}>
          <SaveIcon />
          Save
        </Button>
      </div>
    );
  }
}
