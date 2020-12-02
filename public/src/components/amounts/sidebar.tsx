import React from 'react';
import { List, ListItem, makeStyles, Typography } from '@material-ui/core';
import { red } from '@material-ui/core/colors';
import { Region, getPrettifiedRegionName } from '../../utils/models';

const useStyles = makeStyles(({ palette, spacing }) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: '32px',
  },
  header: {
    marginTop: '32px',
    fontSize: '14px',
  },
  listsContainer: {
    position: 'relative',
    display: 'flex',
    marginTop: '8px',
  },
  list: {
    '& > * + *': {
      marginTop: spacing(1),
    },
  },
  test: {
    position: 'relative',
    height: '50px',
    width: '290px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: 'white',
    borderRadius: '4px',
    padding: '0 12px',
  },
  live: {
    border: `1px solid ${red[500]}`,

    '&:hover': {
      background: `${red[500]}`,
    },
  },
  liveInverted: {
    background: `${red[500]}`,
  },
  draft: {
    border: `1px solid ${palette.grey[700]}`,

    '&:hover': {
      // background: `${palette.grey[700]}`,
    },
  },
  draftInverted: {
    background: `${palette.grey[700]}`,
  },
  priorityLabelContainer: {
    position: 'absolute',
    top: '0',
    bottom: '0',
    left: '-36px',
  },
  labelAndNameContainer: {
    display: 'flex',
    alignItems: 'center',
    '& > * + *': {
      marginLeft: '4px',
    },
  },
  text: {
    maxWidth: '190px',
    fontSize: '12px',
    fontWeight: 500,
    lineHeight: '24px',
    textTransform: 'uppercase',
  },
}));

interface SidebarItemProps {
  region: Region;
}

interface SidebarProps {
  onRegionSelected: (region: Region) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onRegionSelected }: SidebarProps) => {
  const classes = useStyles();

  const SidebarItem: React.FC<SidebarItemProps> = ({ region }: SidebarItemProps) => {
    return (
      <ListItem
        className={`${classes.test} ${classes.draft}`}
        onClick={(): void => onRegionSelected(region)}
        button
      >
        <div className={classes.text}>{getPrettifiedRegionName(region)}</div>
      </ListItem>
    );
  };

  return (
    <div className={classes.root}>
      <Typography className={classes.header}>Tests by region</Typography>
      <div>
        <List className={classes.list}>
          <SidebarItem region={Region.GBPCountries} />
          <SidebarItem region={Region.UnitedStates} />
          <SidebarItem region={Region.Canada} />
          <SidebarItem region={Region.EURCountries} />
          <SidebarItem region={Region.AUDCountries} />
          <SidebarItem region={Region.NZDCountries} />
          <SidebarItem region={Region.International} />
        </List>
      </div>
    </div>
  );
};

export default Sidebar;
