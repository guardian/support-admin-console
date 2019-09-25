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

import {fetchSupportFrontendSettings, saveSupportFrontendSettings, SupportFrontendSettingsType} from '../utils/requests';

enum SwitchState {
  On = 'On', Off = 'Off'
}

enum OneOffPaymentMethod {
  stripe = 'stripe', payPal = 'payPal'
}

enum RecurringPaymentMethod {
  stripe = 'stripe', payPal = 'payPal', directDebit = 'directDebit', existingCard = 'existingCard', existingDirectDebit = 'existingDirectDebit'
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
  value: Switches,
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
    case RecurringPaymentMethod.existingCard: return 'Existing Card';
    case RecurringPaymentMethod.existingDirectDebit: return 'Existing Direct Debit';
    default: return 'Unknown';
  }
}


const styles = ({ palette, spacing, mixins }: Theme) => createStyles({
  formControl: {
    marginRight: spacing(4),
    marginBottom: spacing(4),
    paddingTop: spacing(1),
    paddingBottom: spacing(1),
    paddingLeft: spacing(2),
    paddingRight: spacing(2),
    border: `1px solid ${palette.grey['300']}`
  },
  button: {
    marginRight: spacing(2),
  },
  buttons: {
    marginTop: spacing(2),
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
        existingCard: SwitchState.Off,
        existingDirectDebit: SwitchState.Off,
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
    fetchSupportFrontendSettings(SupportFrontendSettingsType.switches)
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

    saveSupportFrontendSettings(SupportFrontendSettingsType.switches,newState)
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
