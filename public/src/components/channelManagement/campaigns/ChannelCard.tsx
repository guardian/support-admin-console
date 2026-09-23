import { Box, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';
import { Link } from 'react-router-dom';
import { Test } from '../helpers/shared';
import { TestChannelItem } from './CampaignsTypes';
import TestCard from './TestCard';

const ChannelContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  paddingTop: theme.spacing(2),
}));

const NoTestsWarning = styled(Box)(({ theme }) => ({
  marginLeft: theme.spacing(4),
}));

const ChannelHeading = styled(Box)({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
});

const ChannelTitle = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  fontSize: '18px',
  fontWeight: 500,
}));

const LinkButton = styled(Link)({
  textDecoration: 'none',
});

const LinkButtonBackground = styled(Button)({
  backgroundColor: '#f7f9ff',
});

interface ChannelCardProps {
  channelData: TestChannelItem;
  tests: Test[];
}

function ChannelCard({ channelData, tests }: ChannelCardProps): React.ReactElement {
  const getKey = (test: Test) => {
    return `${channelData.name}|${test.name}`;
  };

  return (
    <ChannelContainer>
      <ChannelHeading>
        <ChannelTitle>{channelData.name} channel</ChannelTitle>
        <LinkButton key={channelData.name} to={`/${channelData.link}`}>
          <LinkButtonBackground variant="contained">
            Go to {channelData.name} page
          </LinkButtonBackground>
        </LinkButton>
      </ChannelHeading>
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
        <NoTestsWarning>No active Tests have been set up for this Channel.</NoTestsWarning>
      )}
      {}
    </ChannelContainer>
  );
}

export default ChannelCard;
