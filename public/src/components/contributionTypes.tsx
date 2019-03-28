import React from 'react';
import update from 'immutability-helper';

import {createStyles, Theme, withStyles, WithStyles} from '@material-ui/core/styles';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';

import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import RefreshIcon from '@material-ui/icons/Refresh';

import {fetchSettings, saveSettings, SettingsType} from '../utils/requests';

enum ContributionType {
  ONE_OFF = 'ONE_OFF',
  MONTHLY = 'MONTHLY',
  ANNUAL = 'ANNUAL'
}

interface ContributionTypeSetting {
  contributionType: ContributionType,
  isDefault?: boolean
}

enum Region {
  GBPCountries = 'GBPCountries',
  UnitedStates = 'UnitedStates',
  EURCountries = 'EURCountries',
  International = 'International',
  Canada = 'Canada',
  AUDCountries = 'AUDCountries',
  NZDCountries = 'NZDCountries'
}

type ContributionTypes = {
  [r in Region]: ContributionTypeSetting[]
}

interface DataFromServer {
  value: ContributionTypes,
  version: string,
}

function isRegion(s: string): s is Region {
  return Object.values(Region).includes(s)
}

function isContributionType(s: string): s is ContributionType {
  return Object.values(ContributionType).includes(s)
}

const allContributionTypes = [
  {contributionType: ContributionType.ONE_OFF, label: 'One-off'},
  {contributionType: ContributionType.MONTHLY, label: 'Monthly'},
  {contributionType: ContributionType.ANNUAL, label: 'Annual'}
];

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
    flexWrap: 'wrap'
  },
  region: {
    paddingRight: spacing.unit * 4,
    paddingLeft: spacing.unit * 4,
    borderBottom: `1px solid ${palette.grey['300']}`,
    borderRight: `5px solid ${palette.grey['300']}`,
    marginBottom: spacing.unit * 4,
    flexDirection: 'row'
  },
  contributionTypes: {
    flexDirection: 'column',
    display: 'flex',
    borderRight: `1px solid ${palette.grey['300']}`,
    marginRight: spacing.unit * 4
  },
  default: {
    flexDirection: 'column',
    display: 'flex'
  },
  label: {
    marginTop: spacing.unit * 4
  }
});

interface Props extends WithStyles<typeof styles> {}

class ContributionTypesComponent extends React.Component<Props, ContributionTypes> {
  state: ContributionTypes;
  previousStateFromServer: DataFromServer | null;

  constructor(props: Props) {
    super(props);
    this.state = {
      GBPCountries: [],
      UnitedStates: [],
      EURCountries: [],
      International: [],
      Canada: [],
      AUDCountries: [],
      NZDCountries: []
    };
    this.previousStateFromServer = null;
  }

  componentWillMount(): void {
    this.fetchStateFromServer();
  }

  fetchStateFromServer(): void {
    fetchSettings(SettingsType.contributionTypes)
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

    saveSettings(SettingsType.contributionTypes, newState)
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

  addContributionType(current: ContributionTypeSetting[], newSetting: ContributionTypeSetting): ContributionTypeSetting[] {
    return current.some(c => c.contributionType === newSetting.contributionType) ?
      current :
      current.concat([newSetting]);
  }

  removeContributionType(current: ContributionTypeSetting[], toRemove: ContributionType): ContributionTypeSetting[] {
    return current.filter(c => c.contributionType !== toRemove);
  }

  setContributionTypeOnOff(on: boolean, contributionType: ContributionType, region: Region): void {
    const newSettings = on ?
      this.addContributionType(this.state[region], {contributionType, isDefault: true}) :
      this.removeContributionType(this.state[region], contributionType);

    this.setState((prevState) => update(prevState, {
      [region]: { $set: newSettings }
    }));
  }

  setContributionTypeDefault(contributionType: ContributionType, region: Region): void {
    const newSettings = this.state[region].map((c: ContributionTypeSetting) => {
      if (c.contributionType === contributionType) {
        return { contributionType: c.contributionType, isDefault: true }
      } else {
        return { contributionType: c.contributionType }
      }
    });

    this.setState((prevState) => update(prevState, {
      [region]: { $set: newSettings }
    }));
  }

  renderOnOffs(settings: ContributionTypeSetting[], region: Region): React.ReactNode {
    return (
      <div className={this.props.classes.contributionTypes}>
      <div className={this.props.classes.label}>Enabled</div>
      {allContributionTypes.map(({contributionType, label}) =>
        <FormControlLabel
          control={
            <Switch
              checked={settings.some(c => c.contributionType === contributionType)}
              value={contributionType}
              onChange={event =>
                this.setContributionTypeOnOff(event.target.checked, contributionType, region)
              }
            />
          }
          label={label}
        />
      )}
      </div>
    );
  }

  renderDefaultRadios(current: ContributionType, region: Region): React.ReactNode {
    return (
      <div className={this.props.classes.default}>
      <div className={this.props.classes.label}>Default</div>
      <RadioGroup
        aria-label="Default"
        name="default"
        value={current}
        onChange={(event, value) => {
          if (isContributionType(value)) this.setContributionTypeDefault(value, region)
        }}
      >
        {allContributionTypes.map(({contributionType, label}) =>
          <FormControlLabel value={contributionType} control={<Radio />} label=''/>
        )}
      </RadioGroup>
    </div>
    )
  }

  renderContributionTypesSettings(settings: ContributionTypeSetting[], region: Region): React.ReactNode {
    const { classes } = this.props;

    const getDefault = (): ContributionType => {
      //array.find() is not available for some reason
      const idx = settings.findIndex((c: ContributionTypeSetting) =>
        typeof c.isDefault !== undefined && c.isDefault === true
      );
      if (idx >= 0) return settings[idx].contributionType;
      else return ContributionType.ONE_OFF;
    };

    return (
      <div>
        <FormControl component={'fieldset' as 'div'} className={classes.region}>
          <FormLabel component={'legend' as 'label'}>{region}</FormLabel>

          {this.renderOnOffs(settings, region)}

          {this.renderDefaultRadios(getDefault(), region)}
        </FormControl>
      </div>
    );
  }

  render(): React.ReactNode {
    const { classes } = this.props;

    return (
      <form className={classes.form}>
        <div className={classes.regions}>
          {Object.entries(this.state).map(([region, settings]) => {
            if (isRegion(region)) return this.renderContributionTypesSettings(settings, region)
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

export default withStyles(styles)(ContributionTypesComponent);
