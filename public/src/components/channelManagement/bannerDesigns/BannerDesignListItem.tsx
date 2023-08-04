import React from 'react';
import { ListItem, Theme, makeStyles, Typography } from '@material-ui/core';
import { BannerDesign } from '../../../models/BannerDesign';
import EditIcon from '@material-ui/icons/Edit';
import useHover from '../../../hooks/useHover';

const useStyles = makeStyles(({ palette }: Theme) => ({
  listItem: {
    position: 'relative',
    height: '50px',
    width: '290px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: 'white',
    borderRadius: '4px',
    padding: '0 12px',
    border: `1px solid ${palette.grey[700]}`,

    '&:hover': {
      background: `${palette.grey[700]}`,
    },
  },
  text: {
    maxWidth: '190px',
    fontSize: '12px',
    fontWeight: 500,
    lineHeight: '24px',
    textTransform: 'uppercase',
  },
  textInverted: {
    color: '#FFFFFF',
  },
  inverted: {
    background: `${palette.grey[700]}`,
  },
  whitePencil: {
    color: 'white',
  },
  labelAndNameContainer: {
    display: 'flex',
    alignItems: 'center',
    '& > * + *': {
      marginLeft: '4px',
    },
  },
}));

interface Props {
  design: BannerDesign;
  isSelected: boolean;
  onDesignSelected: (designName: string) => void;
  isLockedForEditing: boolean;
}

const BannerDesignListItem = ({
  design,
  isSelected,
  onDesignSelected,
  isLockedForEditing,
}: Props): React.ReactElement => {
  const classes = useStyles();

  const [ref, isHovered] = useHover<HTMLDivElement>();

  const itemContainerClasses = [classes.listItem];
  const shouldInvertColor = isHovered || isSelected;
  if (shouldInvertColor) {
    itemContainerClasses.push(classes.inverted);
  }

  const textClasses = [classes.text];
  if (isSelected) {
    textClasses.push(classes.textInverted);
  }

  return (
    <ListItem
      button={true}
      className={itemContainerClasses.join(' ')}
      key={design.name}
      onClick={(): void => onDesignSelected(design.name)}
      ref={ref}
    >
      <div className={classes.labelAndNameContainer}>
        {isLockedForEditing &&
          (isSelected ? <EditIcon className={classes.whitePencil} /> : <EditIcon />)}

        <Typography className={textClasses.join(' ')}>{design.name}</Typography>
      </div>
    </ListItem>
  );
};

export default BannerDesignListItem;
