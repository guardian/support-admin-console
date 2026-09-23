import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';
import { SuperModeTable } from './superModeTable';
import { useSuperModeRows } from './useSuperModeRows';

const Container = styled('div')({
  margin: '10px',
});
const Info = styled(Typography)({
  fontSize: '14px',
  marginBottom: '10px',
  fontWeight: 500,
  textAlign: 'right',
});

export const SuperModeDashboard: React.FC = () => {
  const rows = useSuperModeRows();

  return (
    <Container>
      <div>
        <Info variant={'h3'}>
          Data is from the 3-hour window leading up to an article becoming &apos;Super&apos; in the
          given region.
        </Info>
      </div>
      <SuperModeTable rows={rows} />
    </Container>
  );
};
