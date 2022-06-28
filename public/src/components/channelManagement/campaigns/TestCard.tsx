import React from 'react';
import { makeStyles, Theme, Card, CardContent, CardActions, Button } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { CombinedTest, CombinedVariant } from './CampaignsForm';

const useStyles = makeStyles(({ spacing }: Theme) => ({
  cardContainer: {
    marginBottom: '4px',
  },
  cardContent: {
    fontSize: '16px',
  },
  linkButton: {
    textDecoration: 'none',
  },
  dataContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 2fr',
    columnGap: spacing(2),
    justifyItems: 'start',
    marginLeft: spacing(3),
  },
  variantsData: {
    fontSize: '14px',
  },
  dataWarning: {
    fontSize: '14px',
    color: '#f00',
    fontStyle: 'italic',
  },
  priorityAndStatusLine: {
    marginTop: spacing(2),
  },
  prioritySpan: {
    padding: '4px 8px',
    border: '1px solid black',
    marginRight: '8px',
  },
  statusDraftSpan: {
    padding: '4px 8px',
    border: '1px solid black',
    backgroundColor: '#ddd',
    color: '#000',
  },
  statusLiveSpan: {
    padding: '4px 8px',
    border: '1px solid black',
    backgroundColor: '#f00',
    fontWeight: 'bold',
    color: '#fff',
  },
  cohortLine: {
    marginBottom: spacing(2),
  },
  cohortSelectedSpan: {
    fontSize: '13px',
    marginLeft: '4px',
    padding: '4px 8px',
    border: '1px solid black',
    backgroundColor: '#00a',
    fontWeight: 'bold',
    color: '#fff',
  },
  locationsLine: {
    marginBottom: spacing(2),
  },
  locationSelectedSpan: {
    fontSize: '13px',
    marginLeft: '4px',
    padding: '4px 8px',
    border: '1px solid black',
    backgroundColor: '#0a0',
    fontWeight: 'bold',
    color: '#fff',
  },
  notSelectedSpan: {
    fontSize: '13px',
    marginLeft: '4px',
    padding: '4px 8px',
    border: '1px solid black',
    backgroundColor: '#eee',
    color: '#555',
  },
}));

interface TestCardProps {
  test: CombinedTest;
  keyId: string;
  linkPath: string;
}

function TestCard({ test, keyId, linkPath }: TestCardProps): React.ReactElement {
  const classes = useStyles();

  const getVariantNames = (variants: CombinedVariant[]) => {
    if (variants.length > 0) {
      return (
        <div className={classes.variantsData}>Variants: {variants.map(v => v.name).join(', ')}</div>
      );
    }
    return <div className={classes.dataWarning}>No variants have been created for this test!</div>;
  };

  const getPriorityAndStatus = (test: CombinedTest) => {
    return (
      <div className={classes.priorityAndStatusLine}>
        Priority: <span className={classes.prioritySpan}>{test.priority}</span>
        Status:{' '}
        <span className={test.status === 'Live' ? classes.statusLiveSpan : classes.statusDraftSpan}>
          {test.status}
        </span>
      </div>
    );
  };

  const getCohort = (test: CombinedTest) => {
    const userCohort = test.userCohort;

    const checkCohort = (wanted: string) => {
      if (userCohort === 'Everyone') {
        return classes.cohortSelectedSpan;
      }
      if (userCohort === wanted) {
        return classes.cohortSelectedSpan;
      }
      return classes.notSelectedSpan;
    };

    return (
      <div className={classes.cohortLine}>
        Cohort:
        <span className={checkCohort('AllExistingSupporters')}>Existing Supporters</span>
        <span className={checkCohort('AllNonSupporters')}>Non-Supporters</span>
      </div>
    );
  };

  const getLocations = (test: CombinedTest) => {
    const locations: string[] = test.locations || [];

    const checkLocation = (wanted: string) => {
      if (locations.indexOf(wanted) < 0) {
        return classes.notSelectedSpan;
      }
      return classes.locationSelectedSpan;
    };

    if (!locations.length) {
      return (
        <div className={classes.locationsLine}>
          Locations:{' '}
          <span className={classes.dataWarning}>No locations have been selected for this Test</span>
        </div>
      );
    }

    return (
      <div className={classes.locationsLine}>
        Locations:
        <span className={checkLocation('AUDCountries')}>AU</span>
        <span className={checkLocation('Canada')}>CA</span>
        <span className={checkLocation('EURCountries')}>EU</span>
        <span className={checkLocation('NZDCountries')}>NZ</span>
        <span className={checkLocation('GBPCountries')}>UK</span>
        <span className={checkLocation('UnitedStates')}>US</span>
        <span className={checkLocation('International')}>ROW</span>
      </div>
    );
  };

  return (
    <Card className={classes.cardContainer}>
      <CardContent className={classes.cardContent}>
        <CardActions>
          <div>
            <Link className={classes.linkButton} key={keyId} to={`${linkPath}/${test.name}`}>
              <Button variant="outlined">{test.name}</Button>
            </Link>
          </div>
        </CardActions>
        <div className={classes.dataContainer}>
          <div>
            {getVariantNames(test.variants)}
            {getPriorityAndStatus(test)}
          </div>
          <div>
            {getCohort(test)}
            {getLocations(test)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default TestCard;
