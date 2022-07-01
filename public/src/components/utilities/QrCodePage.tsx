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
    height: '100%',
    overflowY: 'auto',
    padding: spacing(2),
  },
  subContainer: {
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    width: '650px',
    minHeight: '100%',
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
    minWidth: '100%',
    marginTop: spacing(4),
    marginBottom: spacing(4),
    padding: spacing(4),
    display: 'flex',
    justifyContent: 'center',
  },
}));

export default function QrCodePage(): JSX.Element {
  const [url, setUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [codeSize, setCodeSize] = useState(256);
  const classes = useStyles();

  function onSvgDownload() {
    const svg = document.querySelector<SVGElement>('#QRCode');
    if (svg && url) {
      const svgData = svg.outerHTML;
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const svgUrl = URL.createObjectURL(svgBlob);

      const downloadLink = document.createElement('a');
      downloadLink.href = svgUrl;
      downloadLink.download = `${fileName ?? 'qrCode'}.svg`;
      downloadLink.rel = 'noopener';
      downloadLink.click();

      URL.revokeObjectURL(url);
    }
  }

  return (
    <div className={classes.container}>
      <div className={classes.subContainer}>
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
          <FormControl>
            <TextField
              label="Size (in px)"
              name="size"
              fullWidth={true}
              defaultValue={256}
              onChange={e => setCodeSize(parseInt(e.target.value))}
              type="text"
              inputMode="numeric"
              required
            />
          </FormControl>
        </Box>
        <Paper className={classes.codeContainer}>
          {url && <QRCode id="QRCode" value={url} size={codeSize} />}
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
    </div>
  );
}
