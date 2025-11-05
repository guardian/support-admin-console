import { makeStyles } from '@mui/styles';
import React from 'react';
import { Theme } from '@mui/material/styles';

const useStyles = makeStyles(({ typography, palette }: Theme) => ({
  container: {
    margin: 'auto',
    maxWidth: '80%',
  },
  emphasis: {
    fontWeight: 700,
  },
  grid: {
    display: 'flex',
    justifyContent: 'space-around',
    overflow: 'hidden',
    gap: '15px',
  },
  column: {
    border: `solid 1px ${palette.grey[400]}`,
    padding: '5px 15px',
    margin: '5px',
    justifySelf: 'stretch',
    flexGrow: 1,
  },
  btn: {
    display: 'block',
    border: 'solid 2px #cccccc',
    width: '100%',
    margin: '15px 0',
    padding: '5px',
    borderRadius: '8px',
    backgroundColor: palette.grey[400],
    textDecoration: 'none',
    fontSize: typography.pxToRem(24),
  },
}));

const Bookmarklets: React.FC = () => {
  const classes = useStyles();
  const instruction = 'Drag me into your bookmarks bar to use when on the Guardian Website';
  return (
    <div className={classes.container}>
      <h2>Reader Revenue Bookmarklets</h2>

      <em className={classes.emphasis}>
        For use on <a href="https://www.theguardian.com">theguardian.com</a> (they will not do
        anything when clicked if you’re not on The Guardian’s website)
      </em>
      <p>
        Just drag each button below up to your Chrome bookmarks bar. Then go to theguardian.com
        (DEV, CODE, or PROD) and click them.
      </p>
      <p>Can’t drag to your bookmarks bar?</p>
      <ol>
        <li>
          Click this link to download the Reader Revenue bookmarklets for Chrome import:
          <br />
          {/* Find in the public/images directory */}
          <a href="/assets/images/rr-bookmarklets-for-chrome-import.html" download>
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
          <strong>Imported</strong>. You can drag Epic/banner to the top level of the Bookmarks Bar
          folder so it appears in your bookmarks bar
        </li>
      </ol>
      <div className={classes.grid}>
        <div className={classes.column}>
          <h3>As non-supporter</h3>
          <em>(to see normal acquisition messaging)</em>
          <a
            href="javascript:window.guardian.readerRevenue.showMeTheEpic()"
            title={instruction}
            className={classes.btn}
          >
            Show me the epic!
          </a>
          <a
            href="javascript:window.guardian.readerRevenue.showMeTheBanner()"
            title={instruction}
            className={classes.btn}
          >
            Show me the banner!
          </a>
          <a
            href="javascript:window.guardian.readerRevenue.showMeTheDoubleBanner()"
            title={instruction}
            className={classes.btn}
          >
            Show me the double banner!
          </a>
          <a
            href="javascript:window.guardian.readerRevenue.showNextVariant()"
            title={instruction}
            className={classes.btn}
          >
            Next variant
          </a>
          <a
            href="javascript:window.guardian.readerRevenue.showPreviousVariant()"
            title={instruction}
            className={classes.btn}
          >
            Previous variant
          </a>
          <a
            href="javascript:window.guardian.readerRevenue.changeGeolocation()"
            title={instruction}
            className={classes.btn}
          >
            Change geolocation
          </a>
        </div>
        <div className={classes.column}>
          <h3>As supporter</h3>
          <em>(e.g. to see supporter specific epic)</em>

          <a
            href="javascript:window.guardian.readerRevenue.showMeTheEpic(true);"
            title={instruction}
            className={classes.btn}
          >
            Show me the epic!
          </a>
          <a
            href="javascript:window.guardian.readerRevenue.showMeTheBanner(true)"
            title={instruction}
            className={classes.btn}
          >
            Show me the banner!
          </a>
          <a
            href="javascript:window.guardian.readerRevenue.showMeTheDoubleBanner(true)"
            title={instruction}
            className={classes.btn}
          >
            Show me the double banner!
          </a>
          <a
            href="javascript:window.guardian.readerRevenue.showNextVariant(true)"
            title={instruction}
            className={classes.btn}
          >
            Next variant
          </a>
          <a
            href="javascript:window.guardian.readerRevenue.showPreviousVariant(true)"
            title={instruction}
            className={classes.btn}
          >
            Previous variant
          </a>
          <a
            href="javascript:window.guardian.readerRevenue.changeGeolocation(true)"
            title={instruction}
            className={classes.btn}
          >
            Change geolocation
          </a>
        </div>
      </div>
    </div>
  );
};

export default Bookmarklets;
