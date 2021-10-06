import React from 'react';
import update from 'immutability-helper';

import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import RefreshIcon from '@material-ui/icons/Refresh';
import { ContributionType, Region, isContributionType, isRegion } from '../utils/models';
import {
  fetchSupportFrontendSettings,
  saveSupportFrontendSettings,
  SupportFrontendSettingsType,
} from '../utils/requests';
interface ContributionTypeSetting {
  contributionType: ContributionType;
  isDefault?: boolean;
}

type ContributionTypes = {
  [r in Region]: ContributionTypeSetting[];
};

interface DataFromServer {
  value: ContributionTypes;
  version: string;
}

const allContributionTypes = [
  { contributionType: ContributionType.ONE_OFF, label: 'One-off' },
  { contributionType: ContributionType.MONTHLY, label: 'Monthly' },
  { contributionType: ContributionType.ANNUAL, label: 'Annual' },
];

const contributionTypesIndices: { [c in ContributionType]: number } = {
  ONE_OFF: 0,
  MONTHLY: 1,
  ANNUAL: 2,
};
const sortContributionTypeSettings = (
  settings: ContributionTypeSetting[],
): ContributionTypeSetting[] =>
  settings.sort(
    (a, b) =>
      contributionTypesIndices[a.contributionType] - contributionTypesIndices[b.contributionType],
  );

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const styles = ({ palette, spacing }: Theme) =>
  createStyles({
    form: {
      display: 'flex',
      flexDirection: 'row',
      marginTop: spacing(4),
      marginLeft: spacing(4),
      marginRight: spacing(4),
      marginBottom: spacing(4),
    },
    button: {
      marginRight: spacing(2),
      marginBottom: spacing(2),
    },
    buttons: {
      marginTop: spacing(2),
      marginLeft: spacing(4),
    },
    regions: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    region: {
      paddingRight: spacing(4),
      paddingLeft: spacing(4),
      borderBottom: `1px solid ${palette.grey['300']}`,
      borderRight: `5px solid ${palette.grey['300']}`,
      marginBottom: spacing(4),
    },
    regionSettings: {
      display: 'flex',
      flexDirection: 'row',
    },
    contributionTypes: {
      flexDirection: 'column',
      display: 'flex',
      borderRight: `1px solid ${palette.grey['300']}`,
      marginRight: spacing(4),
    },
    default: {
      flexDirection: 'column',
      display: 'flex',
    },
    label: {
      marginTop: spacing(2),
      fontSize: '1.1rem',
    },
    switch: {
      marginBottom: spacing(0.7),
    },
  });

type Props = WithStyles<typeof styles>;

class ContributionTypesForm extends React.Component<Props, ContributionTypes> {
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
      NZDCountries: [],
    };
    this.previousStateFromServer = null;
  }

  UNSAFE_componentWillMount(): void {
    this.fetchStateFromServer();
  }

  fetchStateFromServer(): void {
    fetchSupportFrontendSettings(SupportFrontendSettingsType.contributionTypes).then(serverData => {
      this.previousStateFromServer = serverData;
      this.setState({
        ...serverData.value,
      });
    });
  }

  save = (): void => {
    const newState = update(this.previousStateFromServer, {
      value: { $set: this.state },
    });

    saveSupportFrontendSettings(SupportFrontendSettingsType.contributionTypes, newState)
      .then(resp => {
        if (!resp.ok) {
          resp.text().then(msg => alert(msg));
        }
        this.fetchStateFromServer();
      })
      .catch(() => {
        alert('Error while saving');
        this.fetchStateFromServer();
      });
  };

  addContributionType(
    current: ContributionTypeSetting[],
    newSetting: ContributionTypeSetting,
  ): ContributionTypeSetting[] {
    return current.some(c => c.contributionType === newSetting.contributionType)
      ? current
      : sortContributionTypeSettings(current.concat([newSetting]));
  }

  removeContributionType(
    current: ContributionTypeSetting[],
    toRemove: ContributionType,
  ): ContributionTypeSetting[] {
    return current.filter(c => c.contributionType !== toRemove);
  }

  setContributionTypeOnOff(on: boolean, contributionType: ContributionType, region: Region): void {
    const newSettings = on
      ? this.addContributionType(this.state[region], { contributionType, isDefault: true })
      : this.removeContributionType(this.state[region], contributionType);

    this.setState(prevState =>
      update(prevState, {
        [region]: { $set: newSettings },
      }),
    );
  }

  setContributionTypeDefault(contributionType: ContributionType, region: Region): void {
    const newSettings = this.state[region].map((c: ContributionTypeSetting) => {
      if (c.contributionType === contributionType) {
        return { contributionType: c.contributionType, isDefault: true };
      } else {
        return { contributionType: c.contributionType };
      }
    });

    this.setState(prevState =>
      update(prevState, {
        [region]: { $set: newSettings },
      }),
    );
  }

  renderOnOffs(settings: ContributionTypeSetting[], region: Region): React.ReactNode {
    return (
      <div className={this.props.classes.contributionTypes}>
        <div className={this.props.classes.label}>Enabled</div>
        {allContributionTypes.map(({ contributionType, label }) => (
          <FormControlLabel
            key={contributionType}
            className={this.props.classes.switch}
            control={
              <Switch
                checked={settings.some(c => c.contributionType === contributionType)}
                value={contributionType}
                onChange={(event): void =>
                  this.setContributionTypeOnOff(event.target.checked, contributionType, region)
                }
              />
            }
            label={label}
          />
        ))}
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
          onChange={(event, value): void => {
            if (isContributionType(value)) {
              this.setContributionTypeDefault(value, region);
            }
          }}
        >
          {allContributionTypes.map(({ contributionType }) => (
            <FormControlLabel
              key={contributionType}
              value={contributionType}
              control={<Radio />}
              label=""
            />
          ))}
        </RadioGroup>
      </div>
    );
  }

  renderContributionTypesSettings(
    settings: ContributionTypeSetting[],
    region: Region,
  ): React.ReactNode {
    const { classes } = this.props;

    const getDefault = (): ContributionType => {
      const defaultType = settings.find(
        (c: ContributionTypeSetting) => typeof c.isDefault !== undefined && c.isDefault === true,
      );
      if (defaultType) {
        return defaultType.contributionType;
      } else {
        return ContributionType.ONE_OFF;
      }
    };

    return (
      <div key={region}>
        <FormControl component={'fieldset' as 'div'} className={classes.region}>
          <FormLabel component={'legend' as 'label'}>{region}</FormLabel>

          <div className={classes.regionSettings}>
            {this.renderOnOffs(settings, region)}

            {this.renderDefaultRadios(getDefault(), region)}
          </div>
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
            if (isRegion(region)) {
              return this.renderContributionTypesSettings(settings, region);
            }
          })}
        </div>

        <div className={classes.buttons}>
          <Button variant="contained" onClick={this.save} className={classes.button}>
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

export default withStyles(styles)(ContributionTypesForm);
