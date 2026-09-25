import { styled } from '@mui/material/styles';
import React from 'react';

const Body = styled('div')({
  textAlign: 'center',
  minWidth: '100vw',
  height: 'calc(100vh - 64px)',
  top: '64px',
  padding: 'auto',
  margin: '-80px',
  overflow: 'hidden',
  position: 'relative',
});
const Content = styled('p')({
  position: 'relative',
  top: '30%',
  width: '100%',
  color: '#212121',
  fontSize: '16pt',
  lineHeight: '24px',
  textAlign: 'center',
});

export default function IndexPage(): React.ReactElement {
  return (
    <Body>
      <Content>Welcome to the Reader Revenue Control Panel.</Content>
      <Content>To begin, select a tool from the menu.</Content>
    </Body>
  );
}
