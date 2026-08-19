import { Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';

export const useStyles = makeStyles(({ breakpoints, spacing, palette }: Theme) => ({
  wrapper: {
    display: 'flex',
    justifyContent: 'center',
  },
  container: {
    width: '100%',
    maxWidth: 1440,
    padding: spacing(4),
    display: 'flex',
    flexDirection: 'column',
    gap: spacing(4),
  },
  intro: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing(1),
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  versionHistory: {
    width: '100%',
    maxWidth: 1100,
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: spacing(2),
  },
  versionHistoryContent: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: spacing(2),
  },
  diffCell: {
    maxWidth: 0,
    overflowWrap: 'anywhere',
    padding: 0,
  },
  diffTable: {
    width: '100%',
    tableLayout: 'fixed',
  },
  diffFieldCell: {
    width: '24%',
    maxWidth: 0,
    overflowWrap: 'anywhere',
  },
  diffValueCell: {
    width: '38%',
    maxWidth: 0,
    backgroundColor: '#ffffff',
    overflowWrap: 'anywhere',
    whiteSpace: 'pre-wrap',
    '& pre': {
      margin: 0,
      whiteSpace: 'pre-wrap',
      overflowWrap: 'anywhere',
    },
  },
  section: {
    display: 'grid',
    gridTemplateColumns: 'minmax(160px, 0.25fr) minmax(0, 1fr)',
    gap: spacing(3),
    alignItems: 'start',
    [breakpoints.down('md')]: {
      gridTemplateColumns: '1fr',
    },
  },
  sectionHeading: {
    position: 'sticky',
    top: 0,
    padding: spacing(2, 0),
    backgroundColor: palette.grey[100],
    zIndex: 1,
    [breakpoints.down('md')]: {
      padding: spacing(1, 0),
    },
  },
  sectionGrid: {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1fr)',
    gap: spacing(2),
    alignItems: 'start',
  },
  profileCard: {
    height: '100%',
  },
  profileContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing(2),
  },
  choiceCardContainer: {
    display: 'flex',
    alignItems: 'flex-start',
  },
  deleteButton: {
    marginLeft: spacing(1),
    marginTop: spacing(1),
  },
  addButton: {
    alignSelf: 'flex-start',
  },
  helperText: {
    color: palette.text.secondary,
  },
}));
