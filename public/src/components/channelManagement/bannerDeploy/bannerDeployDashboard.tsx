import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';
import BannerChannelDeployer from './bannerChannelDeployer';

const ScrollableContainer = styled(Box)({
  overflow: 'auto',
});

const Container = styled(Box)(({ theme }) => ({
  padding: `${theme.spacing(6)} ${theme.spacing(9)}`,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(4),
}));

const TableContainer = styled(Box)({
  width: '45%',
});

const BannerDeployDashboard: React.FC = () => {
  return (
    <ScrollableContainer>
      <Container>
        <TableContainer>
          <BannerChannelDeployer channel="CHANNEL1" />
        </TableContainer>
        <TableContainer>
          <BannerChannelDeployer channel="CHANNEL2" />
        </TableContainer>
      </Container>
    </ScrollableContainer>
  );
};

export default BannerDeployDashboard;
