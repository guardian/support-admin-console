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

import {
  fetchSupportFrontendSettings,
  saveSupportFrontendSettings,
  SupportFrontendSettingsType,
} from '../utils/requests';

enum SwitchState {
  On = 'On',
  Off = 'Off',
}

enum OneOffPaymentMethod {
  stripe = 'stripe',
  payPal = 'payPal',
  amazonPay = 'amazonPay',
  stripeApplePay = 'stripeApplePay',
  stripePaymentRequestButton = 'stripePaymentRequestButton',
}

enum RecurringPaymentMethod {
  stripe = 'stripe',
  payPal = 'payPal',
  directDebit = 'directDebit',
  existingCard = 'existingCard',
  existingDirectDebit = 'existingDirectDebit',
  stripeApplePay = 'stripeApplePay',
  stripePaymentRequestButton = 'stripePaymentRequestButton',
}

interface Switches {
  oneOffPaymentMethods: {
    [p in OneOffPaymentMethod]: SwitchState;
  };
  recurringPaymentMethods: {
    [p in RecurringPaymentMethod]: SwitchState;
  };
  useDotcomContactPage: SwitchState;
  enableRecaptchaBackend: SwitchState;
  enableRecaptchaFrontend: SwitchState;
  experiments: {
    [featureSwitch: string]: {
      name: string;
      description: string;
      state: SwitchState;
    };
  };
}

interface DataFromServer {
  value: Switches;
  version: string;
}

function booleanToSwitchState(b: boolean): SwitchState {
  return b ? SwitchState.On : SwitchState.Off;
}

function switchStateToBoolean(s: SwitchState): boolean {
  return s === SwitchState.On;
}

function paymentMethodToHumanReadable(paymentMethod: string): string {
  switch (paymentMethod) {
    case OneOffPaymentMethod.amazonPay:
      return 'Amazon Pay';
    case OneOffPaymentMethod.stripe:
      return 'Stripe - Credit/Debit card';
    case OneOffPaymentMethod.stripeApplePay:
      return 'Stripe - Apple Pay';
    case OneOffPaymentMethod.stripePaymentRequestButton:
      return 'Stripe - Payment Request Button';
    case RecurringPaymentMethod.directDebit:
      return 'GoCardless - Direct Debit';
    case RecurringPaymentMethod.payPal:
      return 'PayPal';
    case RecurringPaymentMethod.stripe:
      return 'Stripe - Credit/Debit card';
    case RecurringPaymentMethod.existingCard:
      return 'Stripe - Existing Card';
    case RecurringPaymentMethod.existingDirectDebit:
      return 'GoCardless - Existing Direct Debit';
    case RecurringPaymentMethod.stripeApplePay:
      return 'Stripe - Apple Pay';
    case RecurringPaymentMethod.stripePaymentRequestButton:
      return 'Stripe - Payment Request Button';
    default:
      return 'Unknown';
  }
}

const styles = ({ palette, spacing }: Theme) =>
  createStyles({
    formControl: {
      marginRight: spacing(4),
      marginBottom: spacing(4),
      paddingTop: spacing(1),
      paddingBottom: spacing(1),
      paddingLeft: spacing(2),
      paddingRight: spacing(2),
      border: `1px solid ${palette.grey['300']}`,
    },
    button: {
      marginRight: spacing(2),
    },
    buttons: {
      marginTop: spacing(2),
    },
  });

type Props = WithStyles<typeof styles>;

class Switchboard extends React.Component<Props, Switches> {
  state: Switches;
  previousStateFromServer: DataFromServer | null;

  constructor(props: Props) {
    super(props);
    this.state = {
      oneOffPaymentMethods: {
        stripe: SwitchState.Off,
        stripeApplePay: SwitchState.Off,
        stripePaymentRequestButton: SwitchState.Off,
        payPal: SwitchState.Off,
        amazonPay: SwitchState.Off,
      },
      recurringPaymentMethods: {
        stripe: SwitchState.Off,
        stripeApplePay: SwitchState.Off,
        stripePaymentRequestButton: SwitchState.Off,
        payPal: SwitchState.Off,
        directDebit: SwitchState.Off,
        existingCard: SwitchState.Off,
        existingDirectDebit: SwitchState.Off,
      },
      useDotcomContactPage: SwitchState.Off,
      enableRecaptchaBackend: SwitchState.Off,
      enableRecaptchaFrontend: SwitchState.Off,
      experiments: {},
    };
    this.previousStateFromServer = null;
  }

  UNSAFE_componentWillMount(): void {
    this.fetchStateFromServer();
  }

  fetchStateFromServer(): void {
    fetchSupportFrontendSettings(SupportFrontendSettingsType.switches).then(serverData => {
      this.previousStateFromServer = serverData;
      this.setState({
        ...serverData.value,
      });
    });
  }

  updateOneOffPaymentMethodSwitch(paymentMethod: string, switchState: SwitchState): void {
    this.setState(prevState =>
      update(prevState, {
        oneOffPaymentMethods: {
          [paymentMethod]: { $set: switchState },
        },
      }),
    );
  }

  updateRecurringPaymentMethodSwitch(paymentMethod: string, switchState: SwitchState): void {
    this.setState(prevState =>
      update(prevState, {
        recurringPaymentMethods: {
          [paymentMethod]: { $set: switchState },
        },
      }),
    );
  }

  updateFeatureSwitch(switchName: string, switchState: SwitchState): void {
    this.setState(prevState =>
      update(prevState, {
        experiments: {
          [switchName]: {
            state: { $set: switchState },
          },
        },
      }),
    );
  }

  saveSwitches = (): void => {
    const newState = update(this.previousStateFromServer, {
      value: { $set: this.state },
    });

    saveSupportFrontendSettings(SupportFrontendSettingsType.switches, newState)
      .then(resp => {
        if (!resp.ok) {
          resp.text().then(msg => alert(msg));
        }
        this.fetchStateFromServer();
      })
      .catch(resp => {
        alert(`Error while saving: ${resp}`);
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
            {Object.entries(this.state.oneOffPaymentMethods)
              .sort(([pm1], [pm2]) =>
                paymentMethodToHumanReadable(pm1).localeCompare(paymentMethodToHumanReadable(pm2)),
              )
              .map(([paymentMethod, switchState], index) => (
                <FormControlLabel
                  key={index}
                  control={
                    <Switch
                      checked={switchStateToBoolean(switchState)}
                      onChange={(ev): void =>
                        this.updateOneOffPaymentMethodSwitch(
                          paymentMethod,
                          booleanToSwitchState(ev.target.checked),
                        )
                      }
                      value={paymentMethod}
                    />
                  }
                  label={paymentMethodToHumanReadable(paymentMethod)}
                />
              ))}
          </FormControl>
          <FormControl component={'fieldset' as 'div'} className={classes.formControl}>
            <FormLabel component={'legend' as 'label'}>Recurring contributions</FormLabel>
            {Object.entries(this.state.recurringPaymentMethods)
              .sort(([pm1], [pm2]) =>
                paymentMethodToHumanReadable(pm1).localeCompare(paymentMethodToHumanReadable(pm2)),
              )
              .map(([paymentMethod, switchState], index) => (
                <FormControlLabel
                  key={index}
                  control={
                    <Switch
                      checked={switchStateToBoolean(switchState)}
                      onChange={(event): void =>
                        this.updateRecurringPaymentMethodSwitch(
                          paymentMethod,
                          booleanToSwitchState(event.target.checked),
                        )
                      }
                      value={paymentMethod}
                    />
                  }
                  label={paymentMethodToHumanReadable(paymentMethod)}
                />
              ))}
          </FormControl>
          <FormControl component={'fieldset' as 'div'} className={classes.formControl}>
            <FormLabel component={'legend' as 'label'}>Feature Switches</FormLabel>
            {Object.entries(this.state.experiments)
              .sort(([switchName1], [switchName2]) => switchName1.localeCompare(switchName2))
              .map(([switchName, switchData], index) => (
                <FormControlLabel
                  key={index}
                  control={
                    <Switch
                      checked={switchStateToBoolean(switchData.state)}
                      onChange={(event): void =>
                        this.updateFeatureSwitch(
                          switchName,
                          booleanToSwitchState(event.target.checked),
                        )
                      }
                      value={switchName}
                    />
                  }
                  label={`${switchData.name}: ${switchData.description}`}
                />
              ))}
          </FormControl>
          <FormControl component={'fieldset' as 'div'} className={classes.formControl}>
            <FormLabel component={'legend' as 'label'}>Recaptcha Switches</FormLabel>
            <FormControlLabel
              control={
                <Switch
                  checked={switchStateToBoolean(this.state.enableRecaptchaBackend)}
                  onChange={(event): void =>
                    this.setState({
                      enableRecaptchaBackend: booleanToSwitchState(event.target.checked),
                    })
                  }
                  value={switchStateToBoolean(this.state.enableRecaptchaBackend)}
                />
              }
              label="Enable recaptcha on backend [Always Disable First then wait 2 mins]"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={switchStateToBoolean(this.state.enableRecaptchaFrontend)}
                  onChange={(event): void =>
                    this.setState({
                      enableRecaptchaFrontend: booleanToSwitchState(event.target.checked),
                    })
                  }
                  value={switchStateToBoolean(this.state.enableRecaptchaFrontend)}
                />
              }
              label="Enable recaptcha on frontend [Always Enable First then wait 2 mins]"
            />
          </FormControl>
          <FormControl component={'fieldset' as 'div'} className={classes.formControl}>
            <FormLabel component={'legend' as 'label'}>Other Switches</FormLabel>
            <FormControlLabel
              control={
                <Switch
                  checked={switchStateToBoolean(this.state.useDotcomContactPage)}
                  onChange={(event): void =>
                    this.setState({
                      useDotcomContactPage: booleanToSwitchState(event.target.checked),
                    })
                  }
                  value={switchStateToBoolean(this.state.useDotcomContactPage)}
                />
              }
              label="Use emergency contact page on dotcom"
            />
          </FormControl>
        </div>
        <div className={classes.buttons}>
          <Button variant="contained" onClick={this.saveSwitches} className={classes.button}>
            <SaveIcon />
            Save
          </Button>
          <Button
            variant="contained"
            onClick={(): void => this.fetchStateFromServer()}
            className={classes.button}
          >
            <RefreshIcon />
            Refresh
          </Button>
        </div>
      </form>
    );
  }
}

export default withStyles(styles)(Switchboard);
