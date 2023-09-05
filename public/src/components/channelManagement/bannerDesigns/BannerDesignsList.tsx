import React from 'react';
import { List, makeStyles } from '@material-ui/core';
import { BannerDesign } from '../../../models/BannerDesign';
import BannerDesignListItem from './BannerDesignListItem';

const useStyles = makeStyles(() => ({
  container: {
    marginTop: '16px',
  },
  list: {
    padding: 0,
    marginTop: 0,
    '& > * + *': {
      marginTop: '8px',
    },
  },
}));

interface Props {
  designs: BannerDesign[];
  selectedDesign?: BannerDesign;
  onDesignSelected: (designName: string) => void;
}

const BannerDesignsList = ({
  designs,
  selectedDesign,
  onDesignSelected,
}: Props): React.ReactElement => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <List className={classes.list}>
        {designs.map(design => {
          const isSelected = Boolean(selectedDesign && selectedDesign.name === design.name);

          return (
            <BannerDesignListItem
              key={design.name}
              design={design}
              isSelected={isSelected}
              isLockedForEditing={Boolean(design.lockStatus?.locked)}
              onDesignSelected={(): void => onDesignSelected(design.name)}
            />
          );
        })}
      </List>
    </div>
  );
};

export default BannerDesignsList;