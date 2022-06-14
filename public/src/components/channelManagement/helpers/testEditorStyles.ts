import { makeStyles, Theme } from '@material-ui/core/styles';

export const useStyles = makeStyles(({ spacing, palette }: Theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '100%',
    background: palette.background.paper, // #FFFFFF
  },
  switchContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingBottom: spacing(2),
    borderBottom: `1px solid ${palette.grey[500]}`,
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
    fontSize: 16,
    fontWeight: 500,
    color: palette.grey[700],
  },
  buttonsContainer: {
    paddingTop: spacing(4),
    paddingBottom: spacing(12),
  },
}));
