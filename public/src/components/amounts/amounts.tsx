import React from 'react';
import update from 'immutability-helper';

import {createStyles, Theme, withStyles, WithStyles} from '@material-ui/core/styles';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import RefreshIcon from '@material-ui/icons/Refresh';

import {fetchSettings, saveSettings, SettingsType} from '../../utils/requests';
import {ContributionType, Region} from '../../utils/models';
import AmountInput from './amountInput';
import Amount from './amount';

export interface Amount {
  value: string,
  isDefault?: boolean
}

type Amounts = {
  [f in ContributionType]: Amount[]
}

type AmountsRegions = {
  [r in Region]: Amounts
}

interface DataFromServer {
  value: AmountsRegions,
  version: string,
}

function isRegion(s: string): s is Region {
  return Object.values(Region).includes(s as Region)
}

const emptyAmounts: Amounts = {
  ONE_OFF: [],
  MONTHLY: [],
  ANNUAL: []
};

const styles = ({ palette, spacing, mixins }: Theme) => createStyles({
  form: {
    display: 'flex',
    flexDirection: 'row'
  },
  button: {
    marginRight: spacing.unit * 2,
    marginBottom: spacing.unit * 2
  },
  buttons: {
    marginTop: spacing.unit * 2,
    marginLeft: spacing.unit * 4
  },
  regions: {
    display: 'flex',
    flexDirection: 'column'
  },
  region: {
    paddingRight: spacing.unit * 4,
    paddingLeft: spacing.unit * 4,
    borderBottom: `1px solid ${palette.grey['300']}`,
    marginBottom: spacing.unit * 4,
    flexDirection: 'column'
  },
  ContributionType: {
    margin: spacing.unit,
    display: 'flex',
    borderBottom: `1px dotted ${palette.grey['300']}`,
    paddingBottom: '2px'
  },
  ContributionTypeName: {
    fontWeight: 'bold',
    marginTop: 'auto',
    minWidth: '88px'
  }
});

interface Props extends WithStyles<typeof styles> {}

class AmountsForm extends React.Component<Props, AmountsRegions> {
  state: AmountsRegions;
  previousStateFromServer: DataFromServer | null;

  constructor(props: Props) {
    super(props);
    this.state =
    this.state = {
      GBPCountries: emptyAmounts,
      UnitedStates: emptyAmounts,
      EURCountries: emptyAmounts,
      International: emptyAmounts,
      Canada: emptyAmounts,
      AUDCountries: emptyAmounts,
      NZDCountries: emptyAmounts
    };
    this.previousStateFromServer = null;
  }

  componentWillMount(): void {
    this.fetchStateFromServer();
  }

  fetchStateFromServer(): void {
    fetchSettings(SettingsType.amounts)
      .then(serverData => {
        this.previousStateFromServer = serverData;
        this.setState({
          ...serverData.value
        });
      });
  }

  save = () => {
    const newState = update(this.previousStateFromServer, {
      value: { $set: this.state }
    });

    saveSettings(SettingsType.amounts, newState)
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

  renderAmount(region: Region, contributionType: ContributionType, amount: Amount): React.ReactNode {
    return (
      <Amount
        amount={amount}
        deleteAmount={(amountToDelete => {
          const updatedAmounts = this.state[region][contributionType]
            .filter(a => a.value !== amountToDelete);

          this.setState((prevState) => update(prevState, {
            [region]: {
              [contributionType]: {$set: updatedAmounts}
            }
          }));
        })}
        makeDefault={(defaultAmount => {
          const updatedAmounts = this.state[region][contributionType]
            .map(a => {
              if (a.value === defaultAmount) return {
                value: a.value,
                isDefault: true
              };
              else return { value: a.value }
            });

          this.setState((prevState) => update(prevState, {
            [region]: {
              [contributionType]: {$set: updatedAmounts}
            }
          }));
        })}
      />
    )
  }

  renderAmounts(region: Region, contributionType: ContributionType, amounts: Amount[]): React.ReactNode {
    const { classes } = this.props;

    return (
      <div className={classes.ContributionType}>
        <span className={classes.ContributionTypeName}>{contributionType}:</span>

        { amounts.map(amount => this.renderAmount(region, contributionType, amount)) }

        <AmountInput
          addAmount={(value: string) => {
            const currentAmounts = this.state[region][contributionType];

            if (value !== '' && !currentAmounts.some(a => a.value === value)) {
              const updatedAmounts = this.state[region][contributionType]
                .concat([{value}])
                .sort((a,b) => parseInt(a.value) - parseInt(b.value));

              this.setState((prevState) => update(prevState, {
                [region]: {
                  [contributionType]: {$set: updatedAmounts}
                }
              }));
            }
          }}
        />
      </div>
    )
  }

  renderRegionAmounts(amounts: Amounts, region: Region): React.ReactNode {
    const { classes } = this.props;

    return (
      <FormControl component={'fieldset' as 'div'} className={classes.region}>
        <FormLabel component={'legend' as 'label'}>{region}</FormLabel>

        {Object.values(ContributionType).map((contributionType: ContributionType) =>
          this.renderAmounts(region, contributionType, amounts[contributionType])
        )}
      </FormControl>
    )
  }

  render(): React.ReactNode {
    const { classes } = this.props;

    return (
      <form className={classes.form}>
        <div className={classes.regions}>
          {Object.entries(this.state).map(([region, amounts]) => {
            if (isRegion(region)) return this.renderRegionAmounts(amounts, region)
          })}
        </div>

        <div className={classes.buttons}>
          <Button variant="contained" onClick={this.save} className={classes.button}>
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

export default withStyles(styles)(AmountsForm);
