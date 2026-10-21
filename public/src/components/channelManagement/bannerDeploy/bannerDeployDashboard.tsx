import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';
import BannerChannelDeployer from './bannerChannelDeployer';
import VariantScheduleEditor from './variantScheduleEditor';

const ScrollableContainer = styled(Box)({
  overflow: 'auto',
});

const Container = styled(Box)(({ theme }) => ({
  padding: `${theme.spacing(6)} ${theme.spacing(9)}`,
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 2fr) minmax(300px, 1fr)',
  gap: theme.spacing(4),
  '@media (max-width: 1000px)': {
    gridTemplateColumns: 'minmax(0, 1fr)',
  },
}));

const ChannelDeployments = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(4),
}));

const ChannelTableContainer = styled(Box)({
  width: '100%',
});

const VariantScheduleContainer = styled(Box)({
  alignSelf: 'start',
});

const BannerDeployDashboard: React.FC = () => {
  return (
    <ScrollableContainer>
      <Container>
        <ChannelDeployments>
          <Typography variant="h5" component="h1">
            Control and unconsented users
          </Typography>
          <ChannelTableContainer>
            <BannerChannelDeployer channel="CHANNEL1" />
          </ChannelTableContainer>
          <ChannelTableContainer>
            <BannerChannelDeployer channel="CHANNEL2" />
          </ChannelTableContainer>
        </ChannelDeployments>
        <VariantScheduleContainer>
          <VariantScheduleEditor />
        </VariantScheduleContainer>
      </Container>
    </ScrollableContainer>
  );
};

export default BannerDeployDashboard;
