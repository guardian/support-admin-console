import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  makeStyles,
  Paper,
  Slider,
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

const sizeOptions = [
  { value: 100, label: '100px' },
  { value: 150, label: '150px' },
  { value: 200, label: '200px' },
  { value: 250, label: '250px' },
  { value: 300, label: '300px' },
  { value: 350, label: '350px' },
  { value: 400, label: '400px' },
  { value: 450, label: '450px' },
  { value: 500, label: '500px' },
];

export default function QrCodePage(): JSX.Element {
  const [url, setUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [codeSize, setCodeSize] = useState(250);
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
        </Box>
        <Paper className={classes.codeContainer}>
          {url && <QRCode id="QRCode" value={url} size={codeSize} />}
        </Paper>
        <Box className={classes.form}>
          <FormControl>
            <Typography>Code size</Typography>
            <Slider
              aria-label="Size"
              defaultValue={250}
              onChange={(_, value) => setCodeSize(value as number)}
              valueLabelDisplay="off"
              step={50}
              marks={sizeOptions}
              min={100}
              max={500}
            />
          </FormControl>
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
