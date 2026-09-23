import SmartToyIcon from '@mui/icons-material/SmartToy';
import { styled } from '@mui/material/styles';
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- Required by jsx: "react" in tsconfig.json
import React, { JSX } from 'react';

const Container = styled('div')({
  padding: '1px',
  background: '#FFC107',
  borderRadius: '2px',
  lineHeight: 0,
});

const TestListBanditIcon = (): JSX.Element => {
  return (
    <Container>
      <SmartToyIcon sx={{ fontSize: 16 }} />
    </Container>
  );
};

export default TestListBanditIcon;
