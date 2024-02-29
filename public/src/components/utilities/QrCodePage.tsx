import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  Paper,
  TextField,
  Theme,
  Typography,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import QRCode from 'react-qr-code';
import { useSearchParams } from 'react-router-dom';
import lzstring from 'lz-string';

const useStyles = makeStyles(({ spacing }: Theme) => ({
  container: {
    height: '100%',
    overflowY: 'auto',
    padding: spacing(2),
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gridTemplateRows: 'repeat(2, 1fr)',
  },
  subContainer: {
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    width: '650px',
    padding: spacing(2),
    gridArea: ' 1 / 2 / 3 / 5',
    alignSelf: 'start',
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
    minWidth: '90%',
    marginTop: spacing(4),
    marginBottom: spacing(4),
    padding: spacing(4),
    display: 'flex',
    justifyContent: 'center',
  },
}));

const userAdviceStyles = makeStyles({
  card: {
    alignSelf: 'start',
    justifySelf: 'center',
    maxWidth: '360px',
  },
  paragraph: {
    marginBottom: '1rem',
  },
});

function UserAdvice() {
  const classes = userAdviceStyles();
  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography className={classes.paragraph}>
          When using the QR code to track a reader by linking it to a URL you must ensure that the
          reader&apos;s CMP choice is respected either by reference to the reader choice logged with
          Sourcepoint, or by reference to the correct pageview table.
        </Typography>
        <Typography>For further guidance contact the T&C team or the Data Privacy team.</Typography>
      </CardContent>
    </Card>
  );
}

const decodeUrlFromParam = (params: URLSearchParams): string | undefined => {
  const url = params.get('url');
  if (url) {
    return lzstring.decompressFromEncodedURIComponent(url);
  }
};

export default function QrCodePage(): JSX.Element {
  const [searchParams] = useSearchParams();
  const [url, setUrl] = useState(decodeUrlFromParam(searchParams) ?? '');
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
      <UserAdvice />
      <Paper className={classes.subContainer}>
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
              value={url}
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
        <Card className={classes.codeContainer} variant="outlined">
          {url && <QRCode id="QRCode" value={url} size={codeSize} />}
        </Card>
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
      </Paper>
    </div>
  );
}
