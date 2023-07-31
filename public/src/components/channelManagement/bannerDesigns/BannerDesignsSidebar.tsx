import React from 'react';
import { makeStyles } from '@material-ui/core';
import BannerDesignsList from './BannerDesignsList';
import { BannerDesign } from '../../../models/BannerDesign';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: '32px',
  },
  listsContainer: {
    position: 'relative',
    display: 'flex',
    marginTop: '8px',
  },
}));

interface Props {
  designs: BannerDesign[];
  selectedDesign?: BannerDesign;
  onDesignSelected: (designName: string) => void;
}

const BannerDesignsSidebar = ({
  designs,
  selectedDesign,
  onDesignSelected,
}: Props): React.ReactElement => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.listsContainer}>
        <BannerDesignsList
          designs={designs}
          selectedDesign={selectedDesign}
          onDesignSelected={onDesignSelected}
        />
      </div>
    </div>
  );
};

export default BannerDesignsSidebar;
