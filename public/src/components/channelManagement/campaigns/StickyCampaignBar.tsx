import React from 'react';
import { Theme, Typography, Button } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { grey } from '@mui/material/colors';
import { Link } from '@mui/icons-material';
import StatusUpdateButton from './StatusUpdateButton';
import { Test } from '../helpers/shared';

const useStyles = makeStyles(({ palette, spacing }: Theme) => ({
  container: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingLeft: spacing(3),
    paddingRight: spacing(3),
    paddingBottom: spacing(2),
    paddingTop: spacing(1),
    backgroundColor: palette.grey[200],
    borderBottom: `1px solid ${palette.grey[500]}`,
  },
  namesContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'spaced',
    height: '100%',
  },
  buttonsContainer: {
    display: 'flex',
    justifyContent: 'center',
    height: '100%',
    flexDirection: 'column',
  },
  mainHeader: {
    fontSize: '32px',
    fontWeight: 'normal',
  },
  secondaryHeaderContainer: {
    display: 'flex',
  },
  secondaryHeader: {
    fontSize: '14px',
    color: palette.grey[700],
  },
  lockContainer: {
    alignSelf: 'flex-end',
    display: 'flex',
    '& > * + *': {
      marginLeft: spacing(2),
    },
    marginLeft: spacing(1),
  },
  buttonText: {
    fontSize: '14px',
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '1px',
    color: palette.grey[800],
  },
  icon: {
    color: grey[700],
  },
  link: {
    marginLeft: spacing(2),
    padding: '0 8px',
    fontSize: '14px',
    fontWeight: 'normal',
    color: palette.grey[700],
    lineHeight: 1.5,
  },
  archiveToggleButton: {
    fontSize: '12px',
    marginTop: '8px',
  },
}));

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
  const classes = useStyles();
  const mainHeader = nickname ? nickname : name;
  const secondaryHeader = nickname ? name : null;

  return (
    <header className={classes.container}>
      <div className={classes.namesContainer}>
        <Typography variant="h2" className={classes.mainHeader}>
          {mainHeader}
        </Typography>
        <div className={classes.secondaryHeaderContainer}>
          <Typography className={classes.secondaryHeader}>{secondaryHeader}</Typography>
          <Button
            className={classes.link}
            variant="outlined"
            startIcon={<Link />}
            onClick={() => {
              navigator.clipboard.writeText(`${location.origin}/campaigns/${name}`);
            }}
          >
            Copy link
          </Button>
        </div>
      </div>
      <div className={classes.buttonsContainer}>
        <StatusUpdateButton tests={tests} updatePage={updatePage} />
        <Button
          className={classes.archiveToggleButton}
          variant="outlined"
          onClick={() => setShowArchivedTests(!showArchivedTests)}
        >
          {showArchivedTests ? 'Hide archived tests' : 'Show archived tests'}
        </Button>
      </div>
    </header>
  );
};

export default StickyTopBar;
