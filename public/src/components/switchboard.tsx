import React from 'react';
import get from 'lodash/get';
import set from 'lodash/set';

import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';


interface Switches {
  [key: string]: boolean
  stripeOneOff: boolean,
  payPalOneOff: boolean,
  stripeRecurring: boolean,
  payPalRecurring: boolean,
  directDebitRecurring: boolean
}

function safelyExtractSwitchValue(json: object, path: string): boolean {
  const switchValue = get(json, path, false);
  return switchValue === 'On';
}

function jsonToSwitches(json: object): Switches {
  return {
    stripeOneOff: safelyExtractSwitchValue(json, 'value.switches.oneOffPaymentMethods.stripe'),
    payPalOneOff: safelyExtractSwitchValue(json, 'value.switches.oneOffPaymentMethods.payPal'),
    stripeRecurring: safelyExtractSwitchValue(json, 'value.switches.recurringPaymentMethods.stripe'),
    payPalRecurring: safelyExtractSwitchValue(json, 'value.switches.recurringPaymentMethods.payPal'),
    directDebitRecurring: safelyExtractSwitchValue(json, 'value.switches.recurringPaymentMethods.directDebit')
  };
}

export class Switchboard extends React.Component {
  state: Switches;
  previousStateFromServer: object;

  constructor(props: {}) {
    super(props);
    this.state = {
      stripeOneOff: false,
      payPalOneOff: false,
      stripeRecurring: false,
      payPalRecurring: false,
      directDebitRecurring: false
    };
    this.previousStateFromServer = {};
  }
  
  componentWillMount(): void {
    this.fetchStateFromServer();
  }

  fetchStateFromServer(): void {
    fetch('/support-frontend/switches')
      .then(resp => resp.json())
      .then(json => {
        this.previousStateFromServer = json;
        return json;
      })
      .then(jsonToSwitches)
      .then(switches => {
        this.setState(switches);
      });
  }

  updateSwitch = (switchName: string) => (event: React.FormEvent<HTMLInputElement>) => {
    // it's annoying I have to do this type cast here
    this.setState({ [switchName]: (event.target as HTMLInputElement).checked });
  };

  saveSwitches = () => {
    const newState = {...this.previousStateFromServer};

    // actually I'm not sure I like this technique since it bypasses the type system
    // though in this case it doesn't matter since it's just an object type
    set(newState, 'value.switches.oneOffPaymentMethods.stripe', this.state.stripeOneOff ? 'On' : 'Off');
    set(newState, 'value.switches.oneOffPaymentMethods.payPal', this.state.payPalOneOff ? 'On' : 'Off');
    set(newState, 'value.switches.recurringPaymentMethods.stripe', this.state.stripeRecurring ? 'On' : 'Off');
    set(newState, 'value.switches.recurringPaymentMethods.payPal', this.state.payPalRecurring ? 'On' : 'Off');
    set(newState, 'value.switches.recurringPaymentMethods.directDebit', this.state.directDebitRecurring ? 'On' : 'Off');

    fetch('/support-frontend/switches/update', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newState),
    })
      .then(() => {
        alert('saved');
        this.fetchStateFromServer();
      })
      .catch(() => {
        alert('err');
        this.fetchStateFromServer();
      });
  };

  render(): React.ReactNode {
    return (
      // as "div", as "label" typecasts are to get around this issue: https://github.com/mui-org/material-ui/issues/13744
      <FormControl component={"fieldset" as "div"}>
        <FormLabel component={"legend" as "label"}>One-off contributions</FormLabel>
        <FormGroup>
          {Object.keys(this.state).filter(key => key.endsWith('OneOff')).map(switchName =>
            <FormControlLabel
              control={
                <Switch
                  checked={this.state[switchName]}
                  onChange={this.updateSwitch(switchName)}
                  value={switchName}
                />
              }
              // todo: human-readable label
              label={switchName}
            />
          )}
        </FormGroup>
        <FormLabel component={"legend" as "label"}>Recurring contributions</FormLabel>
        <FormGroup>
          {Object.keys(this.state).filter(key => key.endsWith('Recurring')).map(switchName =>
            <FormControlLabel
              control={
                <Switch
                  checked={this.state[switchName]}
                  onChange={this.updateSwitch(switchName)}
                  value={switchName}
                />
              }
              // todo: human-readable label
              label={switchName}
            />
          )}
        </FormGroup>
        <Button variant="contained" onClick={this.saveSwitches}>
          <SaveIcon />
          Save
        </Button>
      </FormControl>
    );
  }
}
