import React from 'react';
import { makeStyles, Theme, Typography } from '@material-ui/core';
import TestCard from './TestCard';
import { TestChannelItem } from './CampaignsEditor';
import { CombinedTest } from './CampaignsForm';

const useStyles = makeStyles(({ spacing, palette }: Theme) => ({
  channelContainer: {
    marginBottom: spacing(4),
    paddingTop: spacing(2),
  },
  channelTitle: {
    marginBottom: spacing(2),
    fontSize: '18px',
    fontWeight: 500,
  },
}));

interface ChannelCardProps {
  channelData: TestChannelItem;
  tests: CombinedTest[];
}

function ChannelCard({ 
  channelData,
  tests,
}: ChannelCardProps): React.ReactElement {
  const classes = useStyles();

  const getKey = (test: CombinedTest) => {
    return `${channelData.name}|${test.name}`;
  }

  return (
    <div className={classes.channelContainer}>
      <div className={classes.channelTitle}>{channelData.name} channel</div>
        {tests.length > 0 ? (
          tests.map(test => (
            <TestCard
              test={test}
              keyId={`${getKey(test)}_LINK`}
              linkPath={channelData.link}
              key={`${getKey(test)}_CARD`}
            />
          ))
        ) : (
          <Typography>No tests have been set up for this channel</Typography>
        )
      }
      {}
    </div>
  )
}

export default ChannelCard;
