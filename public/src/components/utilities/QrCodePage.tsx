import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import lzstring from 'lz-string';
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- React is required for JSX compilation
import React, { JSX, useState } from 'react';
import QRCode from 'react-qr-code';
import { useSearchParams } from 'react-router-dom';

const Container = styled('div')(({ theme }) => ({
  height: '100%',
  overflowY: 'auto',
  padding: theme.spacing(2),
  display: 'grid',
  gridTemplateColumns: 'repeat(5, 1fr)',
  gridTemplateRows: 'repeat(2, 1fr)',
}));
const SubContainer = styled(Paper)(({ theme }) => ({
  margin: '0 auto',
  display: 'flex',
  flexDirection: 'column',
  width: '650px',
  padding: theme.spacing(2),
  gridArea: ' 1 / 2 / 3 / 5',
  alignSelf: 'start',
}));
const Heading = styled(Typography)(({ theme }) => ({
  fontSize: '1.5rem',
  marginBottom: theme.spacing(2),
}));
const Form = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  '& > *:not(:last-child)': {
    marginBottom: theme.spacing(2),
  },
}));
const CodeContainer = styled(Card)(({ theme }) => ({
  minWidth: '90%',
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
  padding: theme.spacing(4),
  display: 'flex',
  justifyContent: 'center',
}));

const AdviceCard = styled(Card)({
  alignSelf: 'start',
  justifySelf: 'center',
  maxWidth: '360px',
});
const AdviceParagraph = styled(Typography)({
  marginBottom: '1rem',
});

function UserAdvice() {
  return (
    <AdviceCard>
      <CardContent>
        <AdviceParagraph>
          When using the QR code to track a reader by linking it to a URL you must ensure that the
          reader&apos;s CMP choice is respected either by reference to the reader choice logged with
          Sourcepoint, or by reference to the correct pageview table.
        </AdviceParagraph>
        <Typography>For further guidance contact the T&C team or the Data Privacy team.</Typography>
      </CardContent>
    </AdviceCard>
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
  function onSvgDownload() {
    const svg = document.querySelector<SVGElement>('#QRCode');
    if (svg && url) {
      const svgData = svg.outerHTML;
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const svgUrl = URL.createObjectURL(svgBlob);

      const downloadLink = document.createElement('a');
      downloadLink.href = svgUrl;
      downloadLink.download = `${fileName || 'qrCode'}.svg`;
      downloadLink.rel = 'noopener';
      downloadLink.click();

      URL.revokeObjectURL(url);
    }
  }

  return (
    <Container>
      <UserAdvice />
      <SubContainer>
        <Heading variant="h2">Generate a QR code</Heading>
        <Form>
          <FormControl>
            <TextField
              label="URL"
              name="url"
              fullWidth={true}
              onChange={(e) => setUrl(e.target.value)}
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
              onChange={(e) => setCodeSize(parseInt(e.target.value))}
              type="text"
              inputMode="numeric"
              required
            />
          </FormControl>
        </Form>
        <CodeContainer variant="outlined">
          {url && <QRCode id="QRCode" value={url} size={codeSize} />}
        </CodeContainer>
        <Form>
          <FormControl>
            <TextField
              label="File name (optional)"
              name="fileName"
              fullWidth={true}
              onChange={(e) => setFileName(e.target.value)}
              type="text"
            />
          </FormControl>
          <FormControl>
            <Button variant="contained" onClick={onSvgDownload}>
              Download as SVG
            </Button>
          </FormControl>
        </Form>
      </SubContainer>
    </Container>
  );
}
