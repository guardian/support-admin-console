import { makeStyles } from '@mui/styles';
import React from 'react';
import { Theme } from '@mui/material/styles';
import { Button, Tooltip, Typography } from '@mui/material';

const useStyles = makeStyles(({ typography, palette }: Theme) => ({
  container: {
    margin: 'auto',
    marginTop: '15px',
    maxWidth: '70%',
  },
  emphasis: {
    fontWeight: 700,
  },
  grid: {
    display: 'flex',
    justifyContent: 'space-between',
    overflow: 'hidden',
    gap: '15px',
  },
  column: {
    border: `solid 1px ${palette.grey[400]}`,
    padding: '5px 15px',
    margin: '5px',
    justifySelf: 'stretch',
    flexBasis: '50%',
    flexGrow: 0,
  },
  btn: {
    display: 'block',
    border: 'solid 1px #ccc',
    width: '100%',
    margin: '15px 0',
    padding: '5px',
    borderRadius: '8px',
    backgroundColor: palette.grey[300],
    textDecoration: 'none',
    fontSize: typography.pxToRem(20),
  },
}));

const Bookmarklets: React.FC = () => {
  const classes = useStyles();
  const instruction = 'Drag me into your bookmarks bar to use when on the Guardian Website';
  return (
    <div className={classes.container}>
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
          <a href="https://www.theguardian.com">theguardian.com</a> (DEV, CODE, or PROD) and click
          the one you want.
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
        <em className={classes.emphasis}>
          NOTE: For use on <a href="https://www.theguardian.com">theguardian.com</a> only (they will
          not do anything when clicked if you’re not on The Guardian’s website)
        </em>
      </Typography>
      <div className={classes.grid}>
        <div className={classes.column}>
          <Typography variant="h3">As a non-supporter</Typography>
          <em color="text.secondary">(to see normal acquisition messaging)</em>
          <Tooltip title={instruction} arrow>
            <Button
              href="javascript:window.guardian.readerRevenue.showMeTheEpic()"
              className={classes.btn}
              color="primary"
            >
              Show me the epic!
            </Button>
          </Tooltip>
          <Button
            href="javascript:window.guardian.readerRevenue.showMeTheBanner()"
            title={instruction}
            className={classes.btn}
            color="primary"
          >
            Show me the banner!
          </Button>
          <Button
            href="javascript:window.guardian.readerRevenue.showMeTheDoubleBanner()"
            title={instruction}
            className={classes.btn}
            color="primary"
          >
            Show me the double banner!
          </Button>
          <Button
            href="javascript:window.guardian.readerRevenue.showNextVariant()"
            title={instruction}
            className={classes.btn}
            color="primary"
          >
            Next variant
          </Button>
          <Button
            href="javascript:window.guardian.readerRevenue.showPreviousVariant()"
            title={instruction}
            className={classes.btn}
            color="primary"
          >
            Previous variant
          </Button>
          <Button
            href="javascript:window.guardian.readerRevenue.changeGeolocation()"
            title={instruction}
            className={classes.btn}
            color="primary"
          >
            Change geolocation
          </Button>
        </div>
        <div className={classes.column}>
          <Typography variant="h3">As a supporter</Typography>
          <em>(e.g. to see a supporter specific epic)</em>

          <Button
            href="javascript:window.guardian.readerRevenue.showMeTheEpic(true);"
            title={instruction}
            className={classes.btn}
            color="primary"
          >
            Show me the epic!
          </Button>
          <Button
            href="javascript:window.guardian.readerRevenue.showMeTheBanner(true)"
            title={instruction}
            className={classes.btn}
            color="primary"
          >
            Show me the banner!
          </Button>
          <Button
            href="javascript:window.guardian.readerRevenue.showMeTheDoubleBanner(true)"
            title={instruction}
            className={classes.btn}
            color="primary"
          >
            Show me the double banner!
          </Button>
          <Button
            href="javascript:window.guardian.readerRevenue.showNextVariant(true)"
            title={instruction}
            className={classes.btn}
            color="primary"
          >
            Next variant
          </Button>
          <Button
            href="javascript:window.guardian.readerRevenue.showPreviousVariant(true)"
            title={instruction}
            className={classes.btn}
            color="primary"
          >
            Previous variant
          </Button>
          <Button
            href="javascript:window.guardian.readerRevenue.changeGeolocation(true)"
            title={instruction}
            className={classes.btn}
            color="primary"
          >
            Change geolocation
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Bookmarklets;
