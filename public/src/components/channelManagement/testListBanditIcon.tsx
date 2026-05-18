import SmartToyIcon from '@mui/icons-material/SmartToy';
import { makeStyles } from '@mui/styles';
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- Required by jsx: "react" in tsconfig.json
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
