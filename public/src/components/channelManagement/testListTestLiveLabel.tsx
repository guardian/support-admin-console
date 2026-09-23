import { Typography } from '@mui/material';
import { red } from '@mui/material/colors';
import { styled } from '@mui/material/styles';
import React from 'react';

const Container = styled('div', {
  shouldForwardProp: (prop) => prop !== 'isLive' && prop !== 'shouldInvertColor',
})<{ isLive: boolean; shouldInvertColor: boolean }>(({ theme, isLive, shouldInvertColor }) => ({
  display: 'flex',
  justifyContent: 'center',
  width: '35px',
  padding: '2px',
  borderRadius: '2px',
  backgroundColor: shouldInvertColor ? '#FFFFFF' : isLive ? red[500] : theme.palette.grey[700],
  color: shouldInvertColor ? (isLive ? red[500] : theme.palette.grey[700]) : '#FFFFFF',
}));
const Text = styled(Typography)({
  fontSize: '9px',
  fontWeight: 500,
  textTransform: 'uppercase',
});

interface TestListTestLiveLabelProps {
  isLive: boolean;
  shouldInvertColor: boolean;
}

const TestListTestLiveLabel: React.FC<TestListTestLiveLabelProps> = ({
  isLive,
  shouldInvertColor,
}: TestListTestLiveLabelProps) => {
  return (
    <Container isLive={isLive} shouldInvertColor={shouldInvertColor}>
      <Text>{isLive ? 'Live' : 'Draft'}</Text>
    </Container>
  );
};

export default TestListTestLiveLabel;
