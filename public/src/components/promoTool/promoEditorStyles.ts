import { Theme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';

export const useStyles = makeStyles(({ spacing, palette }: Theme) => ({
  root: {
    padding: spacing(3),
    maxWidth: 800,
    margin: '0 auto',
  },
  section: {
    marginBottom: spacing(3),
  },
  sectionTitle: {
    marginBottom: spacing(2),
    fontWeight: 600,
  },
  formField: {
    marginBottom: spacing(2),
  },
  buttonGroup: {
    display: 'flex',
    gap: spacing(1),
    marginTop: spacing(2),
    position: 'sticky',
    bottom: 0,
    backgroundColor: 'white',
    padding: spacing(2),
    borderTop: '1px solid #ddd',
    marginLeft: spacing(-3),
    marginRight: spacing(-3),
    marginBottom: spacing(-3),
    zIndex: 2,
  },
  lockBanner: {
    padding: spacing(2),
    marginBottom: spacing(2),
    backgroundColor: palette.warning.light,
    borderRadius: 4,
  },
  infoBanner: {
    padding: spacing(1),
    marginBottom: spacing(1),
    backgroundColor: palette.info.light,
    borderRadius: 4,
  },
  countryGroupsContainer: {
    border: '1px solid #ddd',
    borderRadius: 4,
    padding: spacing(2),
  },
}));
