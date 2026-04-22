import type { Theme } from '@mui/material';
import { Button } from '@mui/material';
import { makeStyles } from '@mui/styles';
import React from 'react';
import { Link } from 'react-router-dom';
import type { Test } from '../helpers/shared';
import type { TestChannelItem } from './CampaignsEditor';
import TestCard from './TestCard';

const useStyles = makeStyles(({ spacing }: Theme) => ({
  channelContainer: {
    marginBottom: spacing(4),
    paddingTop: spacing(2),
  },
  noTestsWarning: {
    marginLeft: spacing(4),
  },
  channelHeading: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  channelTitle: {
    marginBottom: spacing(2),
    fontSize: '18px',
    fontWeight: 500,
  },
  linkButton: {
    textDecoration: 'none',
  },
  linkButtonBackground: {
    backgroundColor: '#f7f9ff',
  },
}));

interface ChannelCardProps {
  channelData: TestChannelItem;
  tests: Test[];
}

function ChannelCard({ channelData, tests }: ChannelCardProps): React.ReactElement {
  const classes = useStyles();

  const getKey = (test: Test) => {
    return `${channelData.name}|${test.name}`;
  };

  return (
    <div className={classes.channelContainer}>
      <div className={classes.channelHeading}>
        <div className={classes.channelTitle}>{channelData.name} channel</div>
        <Link className={classes.linkButton} key={channelData.name} to={`/${channelData.link}`}>
          <Button className={classes.linkButtonBackground} variant="contained">
            Go to {channelData.name} page
          </Button>
        </Link>
      </div>
      {tests.length > 0 ? (
        tests.map((test) => {
          const key = getKey(test);
          return (
            <TestCard
              test={test}
              keyId={`${key}_LINK`}
              linkPath={`/${channelData.link}`}
              key={`${key}_CARD`}
            />
          );
        })
      ) : (
        <div className={classes.noTestsWarning}>
          No active Tests have been set up for this Channel.
        </div>
      )}
      {}
    </div>
  );
}

export default ChannelCard;
