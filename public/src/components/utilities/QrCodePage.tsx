import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  makeStyles,
  Paper,
  TextField,
  Theme,
  Typography,
} from '@material-ui/core';
import QRCode from 'react-qr-code';

const useStyles = makeStyles(({ spacing }: Theme) => ({
  container: {
    margin: '0 auto',
    padding: spacing(2),
    display: 'flex',
    flexDirection: 'column',
  },
  heading: {
    fontSize: '1.5rem',
    marginBottom: spacing(2),
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    '& > *:not(:last-child)': {
      marginBottom: spacing(2),
    },
  },
  codeContainer: {
    marginTop: spacing(4),
    marginBottom: spacing(4),
    padding: spacing(4),
    display: 'flex',
  },
}));

export default function QrCodePage(): JSX.Element {
  const [url, setUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const classes = useStyles();

  function onSvgDownload() {
    const svg = document.querySelector<SVGElement>('#QRCode');
    if (svg && url) {
      const svgData = svg.outerHTML;
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const svgUrl = URL.createObjectURL(svgBlob);

      const downloadLink = document.createElement('a');
      downloadLink.href = svgUrl;
      downloadLink.download = `${fileName}.svg`;
      downloadLink.click();

      URL.revokeObjectURL(url);
    }
  }

  return (
    <div className={classes.container}>
      <Typography variant="h2" className={classes.heading}>
        Generate a QR code
      </Typography>
      <Box className={classes.form}>
        <FormControl>
          <TextField
            label="URL"
            name="url"
            fullWidth={true}
            onChange={e => setUrl(e.target.value)}
            type="text"
            required
          />
        </FormControl>
      </Box>
      <Paper className={classes.codeContainer}>
        <QRCode id="QRCode" value={url} />
      </Paper>
      <Box className={classes.form}>
        <FormControl>
          <TextField
            label="File name (optional)"
            name="fileName"
            fullWidth={true}
            onChange={e => setFileName(e.target.value)}
            type="text"
          />
        </FormControl>
        <FormControl>
          <Button variant="contained" onClick={onSvgDownload}>
            Download as SVG
          </Button>
        </FormControl>
      </Box>
    </div>
  );
}
