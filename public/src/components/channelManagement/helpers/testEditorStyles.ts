import { Theme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';

export const useStyles = makeStyles(({ spacing, palette }: Theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '100%',
    background: palette.background.paper, // #FFFFFF
  },
  sectionContainer: {
    paddingTop: spacing(1),
    paddingBottom: spacing(6),
    borderBottom: `1px solid ${palette.grey[500]}`,

    '& > * + *': {
      marginTop: spacing(4),
    },
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 500,
    color: palette.grey[700],
  },
  variantsHeaderContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  buttonsContainer: {
    paddingTop: spacing(4),
    paddingBottom: spacing(12),
  },
  variantsHeaderButtonsContainer: {
    display: 'flex',
    '& > * + *': {
      marginLeft: spacing(2),
    },
  },
}));
