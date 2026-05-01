import SmartToyIcon from '@mui/icons-material/SmartToy';
import { makeStyles } from '@mui/styles';
import React from 'react';

const useStyles = makeStyles(() => ({
  container: {
    padding: '1px',
    background: '#FFC107',
    borderRadius: '2px',
    lineHeight: 0,
  },
}));

const TestListBanditIcon = (): JSX.Element => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <SmartToyIcon sx={{ fontSize: 16 }} />
    </div>
  );
};

export default TestListBanditIcon;
