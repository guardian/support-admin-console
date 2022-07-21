import React from 'react';
import { makeStyles, Theme, Card, CardContent, CardActions, Button, Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { Test, Variant } from '../helpers/shared';
import TestDataButton from './TestDataButton';

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
  statusArchivedSpan: {
    padding: '4px 8px',
    border: '1px solid lightgray',
    backgroundColor: '#fff',
    color: '#000',
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
  isLive: {
    border: '1px solid #c7cbd9',
  },
  isDraft: {
    border: '1px solid #c7cbd9',
  },
  isArchived: {
    border: '1px dashed #c7cbd9',
  },
  linkButtonBackground: {
    backgroundColor: '#fafbff',
  },
  trackingName: {
    fontSize: '14px',
  },
  testNameBlockContainer: {
    width: '100%',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  testNameBlockNames: {
    width: '50%',
  },
  testName: {
    fontSize: '14px',
    fontStyle: 'italic',
  },
  testNickname: {
    fontSize: '16px',
    fontWeight: 'bold',
  },
  archivedTestNickname: {
    fontSize: '16px',
  },
  testNameBlockActions: {
    width: '40%',
    textAlign: 'right',
  },
}));

interface TestCardProps {
  test: Test;
  keyId: string;
  linkPath: string;
  campaign: string;
}

function TestCard({ test, keyId, linkPath, campaign }: TestCardProps): React.ReactElement {
  const classes = useStyles();

  const getVariantNames = (variants: Variant[]) => {
    if (variants.length > 0) {
      return (
        <div className={classes.variantsData}>Variants: {variants.map(v => v.name).join(', ')}</div>
      );
    }
    return <div className={classes.dataWarning}>No Variants have been created for this Test.</div>;
  };

  const getPriorityAndStatus = (test: Test) => {
    const getStatusBoxStyle = () => {
      if (test.status === 'Live') {
        return classes.statusLiveSpan;
      }
      if (test.status === 'Draft') {
        return classes.statusDraftSpan;
      }
      return classes.statusArchivedSpan;
    };

    return (
      <div className={classes.priorityAndStatusLine}>
        Priority: <span className={classes.prioritySpan}>{test.priority}</span>
        Status: <span className={getStatusBoxStyle()}>{test.status}</span>
      </div>
    );
  };

  const getCohort = (test: Test) => {
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

  const getLocations = (test: Test) => {
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
          <span className={classes.dataWarning}>
            No locations have been selected for this Test.
          </span>
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

  const getContainerStyle = (test: Test) => {
    if (test.status === 'Live') {
      return `${classes.cardContainer} ${classes.isLive}`;
    }
    if (test.status === 'Draft') {
      return `${classes.cardContainer} ${classes.isDraft}`;
    }
    return `${classes.cardContainer} ${classes.isArchived}`;
  };

  const getTestNameBlock = () => {
    return (
      <div className={classes.testNameBlockContainer}>
        <div className={classes.testNameBlockNames}>
          <div className={test.status === 'Archived' ? classes.archivedTestNickname : classes.testNickname}>{test.nickname ? test.nickname : test.name}</div>
          <div className={classes.testName}>Tracking name: {test.name}</div>
        </div>
        <div className={classes.testNameBlockActions}>
          {test.status !== 'Archived' && (
            <Link className={classes.linkButton} key={keyId} to={`${linkPath}/${test.name}`}>
              <Button className={classes.linkButtonBackground} variant="contained">
                Test page
              </Button>
            </Link>
          )}
          <TestDataButton test={test} campaign={campaign} />
        </div>
      </div>
    )
  };

  return (
    <Card className={getContainerStyle(test)}>
      <CardContent className={classes.cardContent}>
        <CardActions>{getTestNameBlock()}</CardActions>
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
