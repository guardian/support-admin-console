import { makeStyles, Theme } from '@material-ui/core/styles';

export const useStyles = makeStyles(({ spacing, palette }: Theme) => ({
  container: {
    width: '100%',
    height: 'max-content',
    background: palette.background.paper, // #FFFFFF
    paddingTop: spacing(6),
    paddingRight: spacing(12),
    paddingLeft: spacing(3),
  },
  headerAndSwitchContainer: {
    paddingBottom: spacing(3),
    borderBottom: `1px solid ${palette.grey[500]}`,

    '& > * + *': {
      marginTop: spacing(2),
    },
  },
  switchContainer: {
    display: 'flex',
    justifyContent: 'space-between',
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
