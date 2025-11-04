import { makeStyles } from '@mui/styles';
import React from 'react';

const useStyles = makeStyles(() => ({
  container: {
    margin: '50px',
  },
  grid: {
    display: 'flex',
    justifyContent: 'space-around',
    overflow: 'hidden',
    gap: '10px',
  },
  column: {
    border: 'solid 1px black',
    padding: '15px',
    margin: '5px',
    justifySelf: 'stretch',
    flexGrow: 1,
  },
  btn: {
    display: 'block',
    border: 'solid 2px pink',
    width: '80%',
    margin: '1px',
    padding: '5px',
    borderRadius: '8px',
    backgroundColor: 'pink',
  },
}));

const Bookmarklets: React.FC = () => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <h2>Reader Revenue Bookmarklets</h2>

      <em>
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
      <hr />
      <div className={classes.grid}>
        <div className={classes.column}>
          <h3>As non-supporter</h3>
          <em>(to see normal acquisition messaging)</em>

          <a
            href="javascript:window.guardian.readerRevenue.showMeTheEpic()"
            className={classes.btn}
          >
            Show me the epic!
          </a>
          <br />
          <a
            href="javascript:window.guardian.readerRevenue.showMeTheBanner()"
            className={classes.btn}
          >
            Show me the banner!
          </a>
          <br />
          <a
            href="javascript:window.guardian.readerRevenue.showMeTheDoubleBanner()"
            className={classes.btn}
          >
            Show me the double banner!
          </a>
          <br />
          <a
            href="javascript:window.guardian.readerRevenue.showNextVariant()"
            className={classes.btn}
          >
            Next variant
          </a>
          <br />
          <a
            href="javascript:window.guardian.readerRevenue.showPreviousVariant()"
            className={classes.btn}
          >
            Previous variant
          </a>
          <br />
          <a
            href="javascript:window.guardian.readerRevenue.changeGeolocation()"
            className={classes.btn}
          >
            Change geolocation
          </a>
        </div>
        <div className={classes.column}>
          <h3>As supporter</h3>
          <em>(e.g. to see thank you epic)</em>
          <br />
          <a
            href="javascript:window.guardian.readerRevenue.showMeTheEpic(true);"
            className={classes.btn}
          >
            Show me the epic!
          </a>
          <br />
          <a
            href="javascript:window.guardian.readerRevenue.showMeTheBanner(true)"
            className={classes.btn}
          >
            Show me the banner!
          </a>
          <br />
          <a
            href="javascript:window.guardian.readerRevenue.showMeTheDoubleBanner(true)"
            className={classes.btn}
          >
            Show me the double banner!
          </a>
          <br />
          <a
            href="javascript:window.guardian.readerRevenue.showNextVariant(true)"
            className={classes.btn}
          >
            Next variant
          </a>
          <br />
          <a
            href="javascript:window.guardian.readerRevenue.showPreviousVariant(true)"
            className={classes.btn}
          >
            Previous variant
          </a>
          <br />
          <a
            href="javascript:window.guardian.readerRevenue.changeGeolocation(true)"
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
