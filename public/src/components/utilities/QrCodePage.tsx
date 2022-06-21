import React, { useState } from 'react';
import { Box, Button, FormControl, makeStyles, TextField } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  container: {
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    '& > *:not(:last-child)': {
      marginBottom: '8px',
    },
  },
}));

export default function QrCodePage(): JSX.Element {
  const [url, setUrl] = useState('');
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <Box component="form" className={classes.form}>
        <FormControl>
          <TextField
            label="URL"
            name="url"
            fullWidth={true}
            onChange={e => setUrl(e.target.value)}
            type="text"
          />
        </FormControl>
        <FormControl>
          <Button variant="contained">Generate QR code</Button>
        </FormControl>
      </Box>
    </div>
  );
}
