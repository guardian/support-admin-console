import React, { useState } from 'react';

import { makeStyles, Theme } from '@material-ui/core/styles';

import Sidebar from './sidebar';
import ConfiguredRegionAmountsEditor from './configuredRegionAmountsEditor';

import { ContributionType, Region, getPrettifiedRegionName } from '../../utils/models';

export interface Amount {
  value: number;
  isDefault?: boolean;
}

export type ContributionAmounts = {
  [key in ContributionType]: Amount[];
};

export interface AmountsTestVariant {
  name: string;
  amounts: ContributionAmounts;
}

export interface AmountsTest {
  name: string;
  isLive: boolean;
  variants: AmountsTestVariant[];
}

export type ConfiguredRegionAmounts = {
  control: ContributionAmounts;
  test?: AmountsTest;
};

export type ConfiguredAmounts = {
  [key in Region]: ConfiguredRegionAmounts;
};

const useStyles = makeStyles(({ spacing }: Theme) => ({
  body: {
    display: 'flex',
    overflow: 'hidden',
    flexGrow: 1,
    width: '100%',
    height: '100%',
  },
  leftCol: {
    height: '100%',
    flexShrink: 0,
    overflowY: 'auto',
    background: 'white',
    paddingTop: spacing(6),
    paddingLeft: spacing(6),
    paddingRight: spacing(6),
  },
  rightCol: {
    overflowY: 'auto',
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingTop: spacing(6),
    paddingLeft: spacing(6),
  },
}));

const getContributionAmounts = (): ContributionAmounts => ({
  ONE_OFF: [
    { value: 5, isDefault: false },
    { value: 10, isDefault: false },
    { value: 15, isDefault: false },
    { value: 20, isDefault: false },
  ],
  MONTHLY: [
    { value: 5, isDefault: false },
    { value: 10, isDefault: false },
    { value: 15, isDefault: false },
    { value: 20, isDefault: false },
  ],
  ANNUAL: [
    { value: 5, isDefault: false },
    { value: 10, isDefault: false },
    { value: 15, isDefault: false },
    { value: 20, isDefault: false },
  ],
});

const getAmountsTestVariant = (name: string): AmountsTestVariant => ({
  name: name,
  amounts: getContributionAmounts(),
});

const getAmountsTest = (name: string): AmountsTest => ({
  name: name,
  isLive: false,
  variants: [getAmountsTestVariant('v1'), getAmountsTestVariant('v2')],
});

const getConfiguredRegionAmounts = (regionName: string): ConfiguredRegionAmounts => ({
  control: getContributionAmounts(),
  test: getAmountsTest(regionName),
});

const getConfiguredAmounts = (): ConfiguredAmounts => ({
  GBPCountries: getConfiguredRegionAmounts('First amounts test GBP'),
  UnitedStates: getConfiguredRegionAmounts('First amounts test US'),
  AUDCountries: getConfiguredRegionAmounts('First amounts test AUD'),
  NZDCountries: getConfiguredRegionAmounts('First amounts test NZD'),
  EURCountries: getConfiguredRegionAmounts('First amounts test EUR'),
  Canada: getConfiguredRegionAmounts('First amounts test CN'),
  International: getConfiguredRegionAmounts('First amounts test INT'),
});

const ConfiguredAmountsEditor: React.FC = ({}) => {
  const classes = useStyles();
  const [selectedRegion, setSelectedRegion] = useState<Region>(Region.GBPCountries);

  const configuredAmounts = getConfiguredAmounts();
  const selectedRegionPrettifiedName = getPrettifiedRegionName(selectedRegion);
  const selectedRegionAmounts = configuredAmounts[selectedRegion];

  return (
    <div className={classes.body}>
      <div className={classes.leftCol}>
        <Sidebar onRegionSelected={setSelectedRegion} />
      </div>
      <div className={classes.rightCol}>
        <ConfiguredRegionAmountsEditor
          label={selectedRegionPrettifiedName}
          configuredRegionAmounts={selectedRegionAmounts}
        />
      </div>
    </div>
  );
};

export default ConfiguredAmountsEditor;
