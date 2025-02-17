import React from 'react';
import { makeStyles } from '@mui/styles';
import SmartToyIcon from '@mui/icons-material/SmartToy';

const useStyles = makeStyles(() => ({
  container: {
    padding: '1px',
    background: '#FFC107',
    borderRadius: '2px',
    lineHeight: 0,
  },
}));

const BanditIcon = (): JSX.Element => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <SmartToyIcon sx={{ fontSize: 16 }} />
    </div>
  );
};

export default BanditIcon;
