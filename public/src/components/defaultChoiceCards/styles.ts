import { Button, Card, CardContent, Table, TableCell, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

export const Wrapper = styled('div')({
  display: 'flex',
  justifyContent: 'center',
});
export const Container = styled('div')(({ theme }) => ({
  width: '100%',
  maxWidth: 1440,
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(4),
}));
export const Intro = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
}));
export const Actions = styled('div')({
  display: 'flex',
  justifyContent: 'flex-end',
});
export const VersionHistory = styled('div')(({ theme }) => ({
  width: '100%',
  maxWidth: 1100,
  margin: '0 auto',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(2),
}));
export const VersionHistoryContent = styled('div')(({ theme }) => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));
export const DiffCell = styled(TableCell)({
  maxWidth: 0,
  overflowWrap: 'anywhere',
  padding: 0,
});
export const DiffEmptyState = styled(Typography)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: 'center',
}));
export const DiffTable = styled(Table)({
  width: '100%',
  tableLayout: 'fixed',
});
export const DiffFieldCell = styled(TableCell)({
  width: '24%',
  maxWidth: 0,
  overflowWrap: 'anywhere',
});
export const DiffHeaderCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.grey[100],
}));
export const DiffFieldHeaderCell = styled(DiffHeaderCell)({
  width: '24%',
  maxWidth: 0,
  overflowWrap: 'anywhere',
});
export const DiffValueCell = styled(TableCell)({
  width: '38%',
  maxWidth: 0,
  overflowWrap: 'anywhere',
  whiteSpace: 'pre-wrap',
  '& pre': {
    margin: 0,
    whiteSpace: 'pre-wrap',
    overflowWrap: 'anywhere',
  },
});
export const Section = styled('section')(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'minmax(160px, 0.25fr) minmax(0, 1fr)',
  gap: theme.spacing(3),
  alignItems: 'start',
  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: '1fr',
  },
}));
export const SectionHeading = styled('div')(({ theme }) => ({
  position: 'sticky',
  top: 0,
  padding: theme.spacing(2, 0),
  backgroundColor: theme.palette.grey[100],
  zIndex: 1,
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(1, 0),
  },
}));
export const SectionGrid = styled('div')(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr)',
  gap: theme.spacing(2),
  alignItems: 'start',
}));
export const RegionCard = styled(Card)({
  height: '100%',
});
export const RegionContent = styled(CardContent)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));
export const ChoiceCardRow = styled('div')({
  display: 'flex',
  alignItems: 'flex-start',
});
export const DeleteButton = styled(Button)(({ theme }) => ({
  marginLeft: theme.spacing(1),
  marginTop: theme.spacing(1),
}));
export const AddButton = styled(Button)({
  alignSelf: 'flex-start',
});
export const HelperText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
}));
