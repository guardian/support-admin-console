import React from 'react';
import { makeStyles, Theme, Typography, Card, CardContent, CardActions, Button } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { CombinedTest, CombinedVariant } from './CampaignsForm';

const useStyles = makeStyles(({ spacing, palette }: Theme) => ({
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
  variantsDataWarning: {
    fontSize: '14px',
    color: '#f00',
    fontStyle: 'italic',
  },
  statusData: {
    marginTop: spacing(2),
  },
}));

interface TestCardProps {
  test: CombinedTest;
  keyId: string;
  linkPath: string;
}

function TestCard({ 
  test,
  keyId,
  linkPath
}: TestCardProps): React.ReactElement {
  const classes = useStyles();

  const getVariantNames = (variants: CombinedVariant[]) => {
    if (variants.length > 0) {
      return (
        <div className={classes.variantsData}>
          Variants: {variants.map(v => v.name).join(', ')}
        </div>
      )
    }
    return (
      <div className={classes.variantsDataWarning}>
        No variants have been created for this test!
      </div>
    )
  }

  return (
    <Card>
      <CardContent className={classes.cardContent}>
        <CardActions>
          <div>
            <Link 
              className={classes.linkButton}
              key={keyId} 
              to={`${linkPath}/${test.name}`}
            >
              <Button variant="outlined">{test.name}</Button>
            </Link>
          </div>
        </CardActions>
        <div className={classes.dataContainer}>
          <div>
            {getVariantNames(test.variants)}
            <div className={classes.statusData}>
              Status: {test.status}
            </div>
          </div>
          <div>
            <div>
              <Typography>Cohort: {test.userCohort}</Typography>
            </div>
            <div>
              <Typography>Locations: {test.locations.join(', ')}</Typography>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  // return (
  //   <div>
  //     <ul>
  //       <li><Link key={`${test.channel}|${test.name}`} to={`${linkPath}/${test.name}`}><b>Test:</b> {test.name}</Link></li>
  //       <li><b>Cohort:</b> {test.userCohort}</li>
  //       <li><b>Locations:</b> {test.locations.join(', ')}</li>
  //       <li><b>Variants:</b> {getVariantNames(test.variants)}</li>
  //       <li><b>Status:</b> {test.status}</li>
  //     </ul>
  //   </div>
  // )
}

export default TestCard;
