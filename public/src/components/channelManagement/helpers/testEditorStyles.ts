import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

export const Container = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  width: '100%',
  background: theme.palette.background.paper, // #FFFFFF
}));

export const SectionContainer = styled('div')(({ theme }) => ({
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(6),
  borderBottom: `1px solid ${theme.palette.grey[500]}`,

  '& > * + *': {
    marginTop: theme.spacing(4),
  },
}));

export const SectionHeader = styled(Typography)(({ theme }) => ({
  fontSize: 18,
  fontWeight: 500,
  color: theme.palette.grey[700],
}));

export const VariantsHeaderContainer = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-end',
});

export const ButtonsContainer = styled('div')(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(12),
}));

export const VariantsHeaderButtonsContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
}));
