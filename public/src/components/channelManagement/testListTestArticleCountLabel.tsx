import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { JSX } from 'react';

const Container = styled('div')({
  padding: '3px',
  background: '#FFC107',
  borderRadius: '2px',
});
const Text = styled(Typography)({
  fontSize: '8px',
  fontWeight: 500,
  textTransform: 'uppercase',
});

const TestListTestArticleCountLabel: React.FC = (): JSX.Element => {
  return (
    <Container>
      <Text noWrap={true}>AC</Text>
    </Container>
  );
};

export default TestListTestArticleCountLabel;
