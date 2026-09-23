import { Button, Tooltip, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';

const Container = styled('div')({
  margin: 'auto',
  marginTop: '15px',
  maxWidth: '70%',
});

const Emphasis = styled('em')({
  fontWeight: 700,
});

const Grid = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  overflow: 'hidden',
  gap: '15px',
});

const Column = styled('div')({
  border: 'solid 1px #bdbdbd',
  padding: '5px 15px',
  margin: '5px',
  justifySelf: 'stretch',
  flexBasis: '50%',
  flexGrow: 0,
});

const Btn = styled(Button)(({ theme }) => ({
  display: 'block',
  border: 'solid 1px #ccc',
  width: '100%',
  margin: '15px 0',
  padding: '5px',
  borderRadius: '8px',
  backgroundColor: theme.palette.grey[300],
  textDecoration: 'none',
  fontSize: theme.typography.pxToRem(20),
}));

const Bookmarklets: React.FC = () => {
  const instruction = 'Drag me into your bookmarks bar to use when on the Guardian Website';
  return (
    <Container>
      <Typography variant="body1" paragraph>
        There are a couple ways to force your browser show you banners or epics on The Guardian
        website, depending on how specific you want it to be. To see a specific banner/epic or
        gutter test variant, use RRCP to find the test variant and click on the ‘Web Preview’
        button.
      </Typography>
      <Typography variant="body1" paragraph>
        If you just want to re-display whichever banner or epic has been selected for you after
        closing the banner (or after clicking on an epic CTA to go to the landing page which then
        hides the epic from you), you can use the bookmarklets below to reinstate them.
      </Typography>
      <Typography variant="body1" paragraph>
        To make the bookmarklets available the next time you visit theguardian.com , you have two
        options:
      </Typography>
      <ol>
        <li>
          Just drag each button below in the grid below to your Chrome bookmarks bar. Then go to{' '}
          <a href="https://www.theguardian.com">theguardian.com</a> (CODE, or PROD) and click the
          one you want.
        </li>
        <li>
          If that doesn’t work or you want to import all of them at the same time, download the
          Bookmarklets file for Chrome import to your device (by clicking on the link) and use it to
          import the bookmarks directly in your browser. Instructions:
          <ol type="a">
            <li>
              Click this link to download the Reader Revenue bookmarklets for Chrome import:
              <br />
              {/* Find in the public/images directory */}
              <a href="/assets/rr-bookmarklets-for-chrome-import.html" download>
                Bookmarklets for Chrome import
              </a>
            </li>
            <li>
              Go to <strong>Bookmarks {'>'} Bookmark Manager</strong> in Chrome’s top menu
            </li>
            <li>Click the three dots in the top right corner of the Bookmark Manager</li>
            <li>
              Choose <strong>Import Bookmarks</strong>
            </li>
            <li>
              Select the <strong>rr-bookmarklets-for-chrome-import.html</strong> file you’ve just
              downloaded. It should be in your Downloads folder
            </li>
            <li>
              A folder <strong>Epic/banner</strong> will appear inside a folder{' '}
              <strong>Imported</strong>. You can drag Epic/banner to the top level of the Bookmarks
              Bar folder so it appears in your bookmarks bar
            </li>
          </ol>
        </li>
      </ol>
      <Typography variant="body1" paragraph>
        <Emphasis>
          NOTE: For use on <a href="https://www.theguardian.com">theguardian.com</a> only (they will
          not do anything when clicked if you’re not on The Guardian’s website)
        </Emphasis>
      </Typography>
      <Grid>
        <Column>
          <Typography variant="h3">As a non-supporter</Typography>
          <em color="text.secondary">(to see normal acquisition messaging)</em>
          <Tooltip title={instruction} arrow placement="bottom-end">
            <Btn href="javascript:window.guardian.readerRevenue.showMeTheEpic()" color="primary">
              Show me the epic!
            </Btn>
          </Tooltip>
          <Tooltip title={instruction} arrow placement="bottom-end">
            <Btn href="javascript:window.guardian.readerRevenue.showMeTheBanner()" color="primary">
              Show me the banner!
            </Btn>
          </Tooltip>
          <Tooltip title={instruction} arrow placement="bottom-end">
            <Btn
              href="javascript:window.guardian.readerRevenue.showMeTheDoubleBanner()"
              color="primary"
            >
              Show me the double banner!
            </Btn>
          </Tooltip>
          <Tooltip title={instruction} arrow placement="bottom-end">
            <Btn href="javascript:window.guardian.readerRevenue.showNextVariant()" color="primary">
              Next variant
            </Btn>
          </Tooltip>
          <Tooltip title={instruction} arrow placement="bottom-end">
            <Btn
              href="javascript:window.guardian.readerRevenue.showPreviousVariant()"
              color="primary"
            >
              Previous variant
            </Btn>
          </Tooltip>
          <Tooltip title={instruction} arrow placement="bottom-end">
            <Btn
              href="javascript:window.guardian.readerRevenue.changeGeolocation()"
              color="primary"
            >
              Change geolocation
            </Btn>
          </Tooltip>
        </Column>
        <Column>
          <Typography variant="h3">As a supporter</Typography>
          <em>(e.g. to see a supporter specific epic)</em>
          <Tooltip title={instruction} arrow placement="bottom-end">
            <Btn
              href="javascript:window.guardian.readerRevenue.showMeTheEpic(true);"
              color="primary"
            >
              Show me the epic!
            </Btn>
          </Tooltip>
          <Tooltip title={instruction} arrow placement="bottom-end">
            <Btn
              href="javascript:window.guardian.readerRevenue.showMeTheBanner(true)"
              color="primary"
            >
              Show me the banner!
            </Btn>
          </Tooltip>
          <Tooltip title={instruction} arrow placement="bottom-end">
            <Btn
              href="javascript:window.guardian.readerRevenue.showMeTheDoubleBanner(true)"
              color="primary"
            >
              Show me the double banner!
            </Btn>
          </Tooltip>
          <Tooltip title={instruction} arrow placement="bottom-end">
            <Btn
              href="javascript:window.guardian.readerRevenue.showNextVariant(true)"
              color="primary"
            >
              Next variant
            </Btn>
          </Tooltip>
          <Tooltip title={instruction} arrow placement="bottom-end">
            <Btn
              href="javascript:window.guardian.readerRevenue.showPreviousVariant(true)"
              color="primary"
            >
              Previous variant
            </Btn>
          </Tooltip>
          <Tooltip title={instruction} arrow placement="bottom-end">
            <Btn
              href="javascript:window.guardian.readerRevenue.changeGeolocation(true)"
              color="primary"
            >
              Change geolocation
            </Btn>
          </Tooltip>
        </Column>
      </Grid>
    </Container>
  );
};

export default Bookmarklets;
