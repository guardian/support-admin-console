import React from 'react';
import { makeStyles } from '@material-ui/core';
import BannerDesignsList from './BannerDesignsList';
import { BannerDesign } from '../../../models/BannerDesign';
import NewBannerDesignButton from './NewBannerDesignButton';

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
  buttonsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginBottom: '10px',
  },
}));

interface Props {
  designs: BannerDesign[];
  selectedDesign?: BannerDesign;
  onDesignSelected: (designName: string) => void;
  createDesign: (name: string) => void;
}

const BannerDesignsSidebar = ({
  designs,
  selectedDesign,
  onDesignSelected,
  createDesign,
}: Props): React.ReactElement => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.buttonsContainer}>
        <NewBannerDesignButton
          existingNames={designs.map(c => c.name)}
          createDesign={createDesign}
        />
      </div>
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
