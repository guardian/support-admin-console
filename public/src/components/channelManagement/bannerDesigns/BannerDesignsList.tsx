import React from 'react';
import { List, ListItem, Theme, makeStyles, Button, Typography } from '@material-ui/core';
import { red } from '@material-ui/core/colors';
import BannerDesignsSidebar from './BannerDesignsSidebar';
import { BannerDesign } from '../../../models/BannerDesign';

const useStyles = makeStyles(({ palette }: Theme) => ({
  container: {
    marginTop: '16px',
  },
  list: {
    padding: 0,
    width: '100%',
  },
  listItem: {
    margin: 0,
    padding: 0,
    gutter: 0,
    width: '100%',
  },
  button: {
    position: 'relative',
    height: '50px',
    width: '290px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: 'white',
    borderRadius: '4px',
    padding: '0 12px',
    marginBottom: '4px',
  },
  text: {
    fontSize: '12px',
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  live: {
    border: `1px solid ${red[500]}`,

    '&:hover': {
      background: `${red[500]}`,
      color: 'white',
    },
  },
  liveInverted: {
    background: `${red[500]}`,
    color: 'white',

    '&:hover': {
      background: `${red[500]}`,
      color: 'white',
    },
  },
  draft: {
    border: `1px solid ${palette.grey[700]}`,

    '&:hover': {
      background: `${palette.grey[700]}`,
      color: 'white',
    },
  },
  draftInverted: {
    background: `${palette.grey[700]}`,
    color: 'white',

    '&:hover': {
      background: `${palette.grey[700]}`,
      color: 'white',
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
        {designs.map(design => (
          <ListItem className={classes.button} key={design.name}>
            <Button
              key={`${design.name}-button`}
              className={classes.button}
              variant="outlined"
              onClick={(): void => onDesignSelected(design.name)}
            >
              <Typography className={classes.text}>{design.name}</Typography>
            </Button>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default BannerDesignsList;
