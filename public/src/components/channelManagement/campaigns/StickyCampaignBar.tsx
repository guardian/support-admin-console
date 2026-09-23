import { Link } from '@mui/icons-material';
import { Box, Button, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';
import { Test } from '../helpers/shared';
import StatusUpdateButton from './StatusUpdateButton';

const Container = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  paddingLeft: theme.spacing(3),
  paddingRight: theme.spacing(3),
  paddingBottom: theme.spacing(2),
  paddingTop: theme.spacing(1),
  backgroundColor: theme.palette.grey[200],
  borderBottom: `1px solid ${theme.palette.grey[500]}`,
}));

const NamesContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'spaced',
  height: '100%',
});

const ButtonsContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  height: '100%',
  flexDirection: 'column',
});

const MainHeader = styled(Typography)({
  fontSize: '32px',
  fontWeight: 'normal',
});

const SecondaryHeaderContainer = styled(Box)({
  display: 'flex',
});

const SecondaryHeader = styled(Typography)(({ theme }) => ({
  fontSize: '14px',
  color: theme.palette.grey[700],
}));

const LinkButton = styled(Button)(({ theme }) => ({
  marginLeft: theme.spacing(2),
  padding: '0 8px',
  fontSize: '14px',
  fontWeight: 'normal',
  color: theme.palette.grey[700],
  lineHeight: 1.5,
}));

const ArchiveToggleButton = styled(Button)({
  fontSize: '12px',
  marginTop: '8px',
});

interface StickyTopBarProps {
  name: string;
  nickname?: string;
  tests: Test[];
  showArchivedTests: boolean;
  setShowArchivedTests: (item: boolean) => void;
  updatePage: () => void;
}

const StickyTopBar: React.FC<StickyTopBarProps> = ({
  name,
  nickname,
  tests,
  updatePage,
  showArchivedTests,
  setShowArchivedTests,
}: StickyTopBarProps) => {
  const mainHeader = nickname ?? name;
  const secondaryHeader = nickname ? name : null;

  return (
    <Container component="header">
      <NamesContainer>
        <MainHeader variant="h2">{mainHeader}</MainHeader>
        <SecondaryHeaderContainer>
          <SecondaryHeader>{secondaryHeader}</SecondaryHeader>
          <LinkButton
            variant="outlined"
            startIcon={<Link />}
            onClick={() => {
              void navigator.clipboard.writeText(`${location.origin}/campaigns/${name}`);
            }}
          >
            Copy link
          </LinkButton>
        </SecondaryHeaderContainer>
      </NamesContainer>
      <ButtonsContainer>
        <StatusUpdateButton tests={tests} updatePage={updatePage} />
        <ArchiveToggleButton
          variant="outlined"
          onClick={() => setShowArchivedTests(!showArchivedTests)}
        >
          {showArchivedTests ? 'Hide archived tests' : 'Show archived tests'}
        </ArchiveToggleButton>
      </ButtonsContainer>
    </Container>
  );
};

export default StickyTopBar;
