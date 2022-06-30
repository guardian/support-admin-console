import React from 'react';
import { makeStyles, Theme } from '@material-ui/core';
import TestCard from './TestCard';
import { TestChannelItem } from './CampaignsEditor';
import { Test } from '../helpers/shared';

const useStyles = makeStyles(({ spacing }: Theme) => ({
  channelContainer: {
    marginBottom: spacing(4),
    paddingTop: spacing(2),
  },
  noTestsWarning: {
    marginLeft: spacing(4),
  },
  channelTitle: {
    marginBottom: spacing(2),
    fontSize: '18px',
    fontWeight: 500,
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
        <div className={classes.noTestsWarning}>No Tests have been set up for this Channel.</div>
      )}
      {}
    </div>
  );
}

export default ChannelCard;