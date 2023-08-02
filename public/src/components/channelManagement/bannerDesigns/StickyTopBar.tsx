import React from 'react';
import { Theme, Typography, makeStyles } from '@material-ui/core';
import { BannerDesign } from '../../../models/BannerDesign';

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
  mainHeader: {
    fontSize: '32px',
    fontWeight: 'normal',
  },
}));

interface Props {
  bannerDesign: BannerDesign;
}

const StickyTopBar: React.FC<Props> = ({ bannerDesign }: Props) => {
  const classes = useStyles();

  return (
    <header className={classes.container}>
      <div className={classes.namesContainer}>
        <Typography variant="h2" className={classes.mainHeader}>
          {bannerDesign.name}
        </Typography>
      </div>
    </header>
  );
};

export default StickyTopBar;
