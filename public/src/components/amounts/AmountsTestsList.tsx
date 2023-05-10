import React from 'react';
import { List, ListItem, makeStyles, Typography } from '@material-ui/core';
import { red } from '@material-ui/core/colors';
import {
  Territories,
  Territory,
  AmountsTests,
  Regions,
  Countries,
  CountryOptions,
  getTargetName,
} from '../../utils/models';
import { CreateTestButton } from './CreateTestButton';

const useStyles = makeStyles(({ palette }) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: '32px',
    marginBottom: '24px',
  },
  header: {
    margin: '12px',
    fontSize: '18px',
  },
  list: {
    marginTop: 0,
    padding: 0,
    '& > * + *': {
      marginTop: '8px',
    },
  },
  testButton: {
    position: 'relative',
    height: '50px',
    width: '290px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: '4px',
    padding: '0 12px',
    textTransform: 'uppercase',
    fontSize: '12px',
  },
  testNotSelected: {
    border: `1px solid ${palette.grey[700]}`,
    backgroundColor: 'white',
    color: palette.grey[700],
    '&:hover': {
      backgroundColor: palette.grey[300],
    },
  },
  testIsSelected: {
    border: `1px solid ${palette.grey[700]}`,
    color: 'white',
    backgroundColor: palette.grey[700],
    '&:hover': {
      color: palette.grey[700],
      backgroundColor: palette.grey[300],
    },
  },
  liveTestNotSelected: {
    border: `1px solid ${red[500]}`,
    backgroundColor: 'white',
    color: palette.grey[700],
    '&:hover': {
      backgroundColor: palette.grey[300],
    },
  },
  liveTestIsSelected: {
    border: `1px solid ${red[500]}`,
    color: 'white',
    backgroundColor: red[500],
    '&:hover': {
      color: palette.grey[700],
      backgroundColor: palette.grey[300],
    },
  },
}));

interface AmountsTestsListProps {
  tests: AmountsTests;
  selectedTest: Territory | undefined;
  onTargetSelected: (target: Territory) => void;
  create: (selected: CountryOptions) => void;
}

interface AmountsTestButtonProps {
  target: Territory;
}

const regionLabels = Object.keys(Regions);
const countryLabels = Object.keys(Countries);

export const AmountsTestsList: React.FC<AmountsTestsListProps> = ({
  tests,
  selectedTest,
  onTargetSelected,
  create,
}: AmountsTestsListProps) => {
  const classes = useStyles();

  const getRegionTests = () => {
    const regionTests = tests.filter(t => regionLabels.includes(t.target as string));
    const regionTestStrings = regionTests.map(t => t.target);
    return regionTestStrings.sort();
  };

  const getExistingCountryTests = () => {
    const countryTests = tests.filter(t => !regionLabels.includes(t.target as string));
    const countryTestStrings = countryTests.map(t => t.target);
    return countryTestStrings.sort((a, b) => {
      const A = getTargetName(a as string);
      const B = getTargetName(b as string);
      if (A < B) {
        return -1;
      }
      if (A > B) {
        return 1;
      }
      return 0;
    });
  };

  const getCountryTestCandidates = () => {
    const existingCountryTests = getExistingCountryTests();
    const potentialTests = countryLabels.filter(l => !existingCountryTests.includes(l));
    return potentialTests.sort();
  };

  const getButtonStyling = (target: Territory) => {
    const myTest = tests.filter(t => target === t.target)[0];
    const res = [classes.testButton];
    if (target === selectedTest) {
      if (myTest.isLive) {
        res.push(classes.liveTestIsSelected);
      } else {
        res.push(classes.testIsSelected);
      }
    } else {
      if (myTest.isLive) {
        res.push(classes.liveTestNotSelected);
      } else {
        res.push(classes.testNotSelected);
      }
    }
    return res.join(' ');
  };

  const AmountsTestButton: React.FC<AmountsTestButtonProps> = ({
    target,
  }: AmountsTestButtonProps) => {
    return (
      <ListItem
        className={getButtonStyling(target)}
        onClick={(): void => onTargetSelected(target)}
        button
      >
        {Territories[target]}
      </ListItem>
    );
  };

  return (
    <div className={classes.root}>
      <Typography className={classes.header}>Region-wide tests</Typography>
      <div>
        <List className={classes.list}>
          {getRegionTests().map(t => (
            <AmountsTestButton key={t} target={t} />
          ))}
        </List>
      </div>

      <Typography className={classes.header}>Country-specific tests</Typography>

      <CreateTestButton candidateTargets={getCountryTestCandidates()} create={create} />

      <div>
        <List className={classes.list}>
          {getExistingCountryTests().map(t => (
            <AmountsTestButton key={t} target={t} />
          ))}
        </List>
      </div>
    </div>
  );
};
