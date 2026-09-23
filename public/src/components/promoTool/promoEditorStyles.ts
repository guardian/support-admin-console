import { Box, Paper, TextField, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

export const Root = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  maxWidth: 800,
  margin: '0 auto',
}));

export const Section = styled('div')(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

export const SectionTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  fontWeight: 600,
}));

export const FormField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

export const ButtonGroup = styled('div')(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  marginTop: theme.spacing(2),
  position: 'sticky',
  bottom: 0,
  backgroundColor: 'white',
  padding: theme.spacing(2),
  borderTop: '1px solid #ddd',
  marginLeft: theme.spacing(-3),
  marginRight: theme.spacing(-3),
  marginBottom: theme.spacing(-3),
  zIndex: 2,
}));

export const LockBanner = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  backgroundColor: theme.palette.warning.light,
  borderRadius: 4,
}));

export const InfoBanner = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1),
  marginBottom: theme.spacing(1),
  backgroundColor: theme.palette.info.light,
  borderRadius: 4,
}));

export const CountryGroupsContainer = styled(Box)(({ theme }) => ({
  border: '1px solid #ddd',
  borderRadius: 4,
  padding: theme.spacing(2),
}));
