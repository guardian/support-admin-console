import React from 'react';
import { List, ListItem, makeStyles, Typography } from '@material-ui/core';
import { red } from '@material-ui/core/colors';
import { AmountsTests, AmountsTest } from '../../utils/models';
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
  selectedTest: AmountsTest | undefined;
  checkTestNameIsUnique: (name: string) => boolean;
  checkTestLabelIsUnique: (name: string) => boolean;
  onTestSelected: (name: string) => void;
  create: (name: string, label: string) => void;
}

interface AmountsTestButtonProps {
  test: AmountsTest;
}

export const AmountsTestsList: React.FC<AmountsTestsListProps> = ({
  tests,
  selectedTest,
  onTestSelected,
  checkTestNameIsUnique,
  checkTestLabelIsUnique,
  create,
}: AmountsTestsListProps) => {
  const classes = useStyles();

  const getRegionTests = () => {
    const regionTests = tests.filter(t => t.region !== '');
    return regionTests.sort((a, b) => {
      const A = a.testLabel || a.testName;
      const B = b.testLabel || b.testName;
      return A < B ? -1 : 1;
    });
  };

  const getCountryTests = () => {
    const countryTests = tests.filter(t => t.region === '');
    return countryTests.sort((a, b) => {
      if (a.order !== b.order) {
        return a.order - b.order;
      }
      const A = a.testLabel || a.testName;
      const B = b.testLabel || b.testName;
      return A < B ? -1 : 1;
    });
  };

  const getButtonStyling = (live: boolean, selected: boolean) => {
    const res = [classes.testButton];
    if (selected) {
      if (live) {
        res.push(classes.liveTestIsSelected);
      } else {
        res.push(classes.testIsSelected);
      }
    } else {
      if (live) {
        res.push(classes.liveTestNotSelected);
      } else {
        res.push(classes.testNotSelected);
      }
    }
    return res.join(' ');
  };

  const AmountsTestButton: React.FC<AmountsTestButtonProps> = ({
    test,
  }: AmountsTestButtonProps) => {
    return (
      <ListItem
        className={getButtonStyling(test.isLive, test.testName === selectedTest?.testName)}
        onClick={(): void => onTestSelected(test.testName)}
        button
      >
        {test.testLabel || test.testName}
      </ListItem>
    );
  };

  return (
    <div className={classes.root}>
      <Typography className={classes.header}>Region-wide tests</Typography>
      <div>
        <List className={classes.list}>
          {getRegionTests().map(t => (
            <AmountsTestButton key={t.testName} test={t} />
          ))}
        </List>
      </div>

      <Typography className={classes.header}>Country-specific tests</Typography>

      <CreateTestButton
        checkTestNameIsUnique={checkTestNameIsUnique}
        checkTestLabelIsUnique={checkTestLabelIsUnique}
        create={create}
      />

      <div>
        <List className={classes.list}>
          {getCountryTests().map(t => (
            <AmountsTestButton key={t.testName} test={t} />
          ))}
        </List>
      </div>
    </div>
  );
};
