import React from 'react';
import { createStyles, Link, Theme, Tooltip, WithStyles, withStyles } from '@material-ui/core';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const styles = ({ palette }: Theme) =>
  createStyles({
    container: {
      postion: 'relative',
    },
    link: {
      width: '40px',
      height: '40px',
      background: palette.grey[900],
      borderRadius: '50%',
      textAlign: 'center',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '18px',
      fontWeight: 500,
      color: 'white',
      cursor: 'pointer',
      filter: 'drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.25))',

      '&:hover': {
        textDecoration: 'none',
      },
    },
  });

const HELP_GUIDE_URL =
  'https://docs.google.com/document/d/1jgc8nK7fognfXan9OB_g5EOQywOPF4roNKP_3T4Na8Y/edit';

type StickyBottomBarHelpButtonProps = WithStyles<typeof styles>;

const StickyBottomBarHelpButton: React.FC<StickyBottomBarHelpButtonProps> = ({
  classes,
}: StickyBottomBarHelpButtonProps) => {
  return (
    <Tooltip title="View help guide" placement="top-end">
      <Link
        className={classes.link}
        href={HELP_GUIDE_URL}
        target="_blank"
        rel="noopener noreferrer"
      >
        <div>?</div>
      </Link>
    </Tooltip>
  );
};

export default withStyles(styles)(StickyBottomBarHelpButton);
