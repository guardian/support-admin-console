import React from 'react';
import { BannerDesign } from '../../../models/BannerDesign';
import StickyTopBar from './StickyTopBar';
import { makeStyles, Theme } from '@material-ui/core';

const useStyles = makeStyles(({ palette }: Theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '100%',
    background: palette.background.paper, // #FFFFFF
    borderLeft: `1px solid ${palette.grey[500]}`,
  },
}));

type Props = {
  bannerDesign: BannerDesign;
};

const BannerDesignEditor: React.FC<Props> = ({ bannerDesign }: Props) => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <StickyTopBar bannerDesign={bannerDesign} />
    </div>
  );
};

export default BannerDesignEditor;
