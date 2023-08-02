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
  name: string;
  onLock: (designName: string, force: boolean) => void;
  onUnlock: (designName: string) => void;
  onSave: (designName: string) => void;
};

const BannerDesignEditor: React.FC<Props> = ({ name, onLock, onUnlock, onSave }: Props) => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <StickyTopBar name={name} onLock={onLock} onUnlock={onUnlock} onSave={onSave} />
    </div>
  );
};

export default BannerDesignEditor;
