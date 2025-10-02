import React from 'react';
import { Theme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import { withPreviewStyles } from '../previewContainer';

export interface PreviewColours {
  background: string; // hex with '#'
  heading: string;
  bodyText: string;
  highlightText: string;
  highlightBackground: string;
  primaryCta: { text: string; background: string; border?: string | null };
  secondaryCta: { text: string; background: string; border?: string | null };
  ticker?: {
    filledProgress: string;
    progressBarBackground: string;
    headlineColour: string; // not used here but available
    totalColour: string;
    goalColour: string;
  };
  choiceCards?: {
    buttonColour: string;
    buttonTextColour: string;
    buttonBorderColour: string;
    buttonSelectColour: string;
    buttonSelectTextColour: string;
    buttonSelectBorderColour: string;
    buttonSelectMarkerColour: string;
    pillBackgroundColour: string;
    pillTextColour: string;
  };
}

const useStyles = makeStyles(({ breakpoints, spacing }: Theme) => ({
  container: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    maxWidth: 320,
    [breakpoints.up('md')]: {
      flexDirection: 'row',
      maxWidth: 'unset',
    },
  },
  card: {
    borderRadius: 12,
    padding: spacing(2),
    width: '100%',
  },
  contentRow: {
    display: 'flex',
    gap: spacing(2),
    alignItems: 'flex-start',
    flexDirection: 'column',
    width: '100%',
    maxWidth: 320,
    [breakpoints.up('md')]: {
      flexDirection: 'row',
      maxWidth: 'max-content',
    },
  },
  leftCol: {
    width: 286,
  },
  rightCol: {
    flex: 1,
    minWidth: 286,
    display: 'flex',
    flexDirection: 'column',
    gap: spacing(1.5),
    [breakpoints.up('md')]: {
      minWidth: 370,
    },
  },
  heading: {
    fontFamily: 'GH Guardian Headline',
    fontSize: 42,
    fontWeight: 500,
    lineHeight: 1.15,
    marginBottom: spacing('4px'),
  },
  tickerContainer: {
    margin: `${spacing(1)} 0`,
  },
  tickerBar: {
    height: 12,
    width: '100%',
    background: '#EEE',
    borderRadius: 6,
    overflow: 'hidden',
  },
  tickerFill: {
    height: '100%',
    width: '50%',
    borderRadius: 6,
  },
  tickerText: {
    fontFamily: 'GuardianTextSans',
    fontSize: 15,
    fontWeight: 400,
    lineHeight: 1.3,
    marginTop: spacing(0.5),
  },
  body: {
    fontFamily: 'GuardianTextSans',
    fontSize: 15,
    fontWeight: 400,
    lineHeight: 1.3,
  },
  highlight: {
    fontFamily: 'GuardianTextSans',
    fontSize: 15,
    fontWeight: 700,
    lineHeight: 1.3,
    display: 'inline-block',
    marginBottom: spacing(2),
  },
  buttons: {
    display: 'flex',
    gap: spacing(1.5),
    flexDirection: 'column',

    [breakpoints.up('md')]: {
      flexDirection: 'row',
    },
  },
  button: {
    borderRadius: 1000,
    cursor: 'default',
    fontFamily: 'GuardianTextSans',
    fontSize: 17,
    fontWeight: 700,
    padding: '6px 18px',
    textAlign: 'center',
    width: '100%',
    [breakpoints.up('md')]: {
      width: '50%',
    },
  },
  choiceCard: {
    borderRadius: 12,
    padding: spacing(1.25),
    display: 'flex',
    flexDirection: 'column',
    gap: spacing(1),
    position: 'relative',
  },
  choiceHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing(1),
    fontFamily: 'GuardianTextSans',
    fontSize: 17,
    fontWeight: 700,
  },
  choiceOption: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing(1),
    fontFamily: 'GuardianTextSans',
    fontSize: 17,
    fontWeight: 400,
  },
  radio: {
    width: 18,
    height: 18,
    borderRadius: '50%',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flex: '0 0 18px',
  },
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
  },
  radioRing: {
    width: 15,
    height: 15,
    borderRadius: '50%',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recommendedBadge: {
    position: 'absolute',
    top: -12,
    right: 8,
    borderRadius: 4,
    padding: '4px 8px',
    fontFamily: 'GuardianTextSans',
    fontSize: 12,
    fontWeight: 700,
    lineHeight: 1.2,
  },
  choiceList: {
    margin: 0,
    paddingLeft: spacing(0.5),
    fontFamily: 'GuardianTextSans',
    fontSize: 14,
    fontWeight: 400,
    lineHeight: 1.4,
    listStyle: 'none',
  },
  choiceItem: { display: 'flex', alignItems: 'center', gap: spacing(0.5) },
  imagePreviewContainer: {
    alignItems: 'center',
    display: 'flex',
    flexGrow: 1,
    justifyContent: 'center',
    minHeight: 208,
    backgroundColor: 'rgba(241,248,252,0.2)',
  },
}));

type Props = {
  colours: PreviewColours;
};

const PalettePreview: React.FC<Props> = ({ colours }) => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <div
        className={classes.card}
        style={{ background: colours.background }}
        aria-label="Banner preview"
      >
        <div className={classes.contentRow}>
          <div className={classes.leftCol}>
            <div className={classes.heading} style={{ color: colours.heading }}>
              Heading
            </div>
            {colours.ticker && (
              <div className={classes.tickerContainer}>
                <div
                  className={classes.tickerBar}
                  style={{ background: colours.ticker.progressBarBackground }}
                >
                  <div
                    className={classes.tickerFill}
                    style={{ background: colours.ticker.filledProgress }}
                  />
                </div>
                <div className={classes.tickerText}>
                  <span style={{ color: colours.ticker.totalColour, fontWeight: 700 }}>
                    $500,000
                  </span>{' '}
                  <span style={{ color: colours.ticker.goalColour }}>of $1,500,000 goal</span>
                </div>
              </div>
            )}
            <div className={classes.body} style={{ color: colours.bodyText }}>
              Body Text.
            </div>
            <div
              className={classes.highlight}
              style={{ color: colours.highlightText, background: colours.highlightBackground }}
            >
              Highlighted text.
            </div>
          </div>
          {colours.choiceCards && (
            <div className={classes.rightCol}>
              <div
                className={classes.choiceCard}
                style={{
                  background: colours.choiceCards.buttonSelectColour,
                  border: `2px solid ${colours.choiceCards.buttonSelectBorderColour}`,
                  color: colours.choiceCards.buttonSelectTextColour,
                }}
              >
                <div
                  className={classes.recommendedBadge}
                  style={{
                    background: colours.choiceCards.pillBackgroundColour,
                    color: colours.choiceCards.pillTextColour,
                  }}
                >
                  Recommended
                </div>
                <div className={classes.choiceHeader}>
                  <span
                    className={classes.radio}
                    style={{ border: `2px solid ${colours.choiceCards.buttonSelectBorderColour}` }}
                  >
                    <span
                      className={classes.radioRing}
                      style={{
                        border: `1px solid ${colours.choiceCards.buttonSelectBorderColour}`,
                      }}
                    >
                      <span
                        className={classes.radioDot}
                        style={{ background: colours.choiceCards.buttonSelectBorderColour }}
                      />
                    </span>
                  </span>
                  Support £XX/month
                </div>
                <ul
                  className={classes.choiceList}
                  style={{ color: colours.choiceCards.buttonSelectTextColour }}
                >
                  <li className={classes.choiceItem}>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 5 5"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M2.771 0.4245C3.96324 0.424652 4.93018 1.3914 4.93018 2.58368C4.93001 3.77582 3.96313 4.74173 2.771 4.74188C1.57873 4.74188 0.611979 3.77591 0.611816 2.58368C0.611816 1.39131 1.57863 0.4245 2.771 0.4245ZM2.38818 3.04657L1.89795 2.5788L1.7251 2.75067L2.31006 3.57001H2.40771L4.01709 1.90399L3.84033 1.73114L2.38818 3.04657Z"
                        fill={colours.choiceCards.buttonSelectMarkerColour}
                      />
                    </svg>
                    Item 1
                  </li>
                  <li className={classes.choiceItem}>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 5 5"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M2.771 0.4245C3.96324 0.424652 4.93018 1.3914 4.93018 2.58368C4.93001 3.77582 3.96313 4.74173 2.771 4.74188C1.57873 4.74188 0.611979 3.77591 0.611816 2.58368C0.611816 1.39131 1.57863 0.4245 2.771 0.4245ZM2.38818 3.04657L1.89795 2.5788L1.7251 2.75067L2.31006 3.57001H2.40771L4.01709 1.90399L3.84033 1.73114L2.38818 3.04657Z"
                        fill={colours.choiceCards.buttonSelectMarkerColour}
                      />
                    </svg>
                    Item 2
                  </li>
                </ul>
              </div>
              {/** Unselected card */}
              <div
                className={classes.choiceCard}
                style={{
                  background: colours.choiceCards.buttonColour,
                  border: `1px solid ${colours.choiceCards.buttonBorderColour}`,
                  color: colours.choiceCards.buttonTextColour,
                }}
              >
                <div className={classes.choiceOption}>
                  <span
                    className={classes.radio}
                    style={{ border: `1px solid ${colours.choiceCards.buttonBorderColour}` }}
                  />
                  Support with £X/month
                </div>
              </div>

              <div className={classes.buttons}>
                <div
                  className={classes.button}
                  style={{
                    color: colours.primaryCta.text,
                    background: colours.primaryCta.background,
                    border: colours.primaryCta.border
                      ? `2px solid ${colours.primaryCta.border}`
                      : 'none',
                  }}
                >
                  Primary action
                </div>
                <div
                  className={classes.button}
                  style={{
                    color: colours.secondaryCta.text,
                    background: colours.secondaryCta.background,
                    border: colours.secondaryCta.border
                      ? `2px solid ${colours.secondaryCta.border}`
                      : 'none',
                  }}
                >
                  Secondary action
                </div>
              </div>
            </div>
          )}
          <div className={classes.rightCol}>
            <div className={classes.imagePreviewContainer}>
              <svg
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                width="100"
                height="100"
                viewBox="0 0 53 53"
              >
                <path
                  d="M0 0 C0.99 0 1.98 0 3 0 C3 2.31 3 4.62 3 7 C15.21 7 27.42 7 40 7 C40 18.88 40 30.76 40 43 C41.98 43 43.96 43 46 43 C46 43.99 46 44.98 46 46 C44.02 46 42.04 46 40 46 C40 48.31 40 50.62 40 53 C39.01 53 38.02 53 37 53 C37 50.69 37 48.38 37 46 C24.79 46.33 12.58 46.66 0 47 C0 34.79 0 22.58 0 10 C-1.98 10 -3.96 10 -6 10 C-6 9.01 -6 8.02 -6 7 C-4.02 7 -2.04 7 0 7 C0 4.69 0 2.38 0 0 Z M3 10 C3 19.9 3 29.8 3 40 C6.88896818 35.19158627 6.88896818 35.19158627 8 30 C8.97850195 28.97895449 9.97980427 27.9793879 11 27 C11.309375 26.13375 11.61875 25.2675 11.9375 24.375 C13 22 13 22 15.125 21.1875 C15.74375 21.125625 16.3625 21.06375 17 21 C17.28875 21.804375 17.5775 22.60875 17.875 23.4375 C18.73262568 26.1326468 18.73262568 26.1326468 21 27 C21.144375 27.61875 21.28875 28.2375 21.4375 28.875 C22.11644634 31.4399084 22.83351692 32.47543783 25 34 C27.16299211 33.77242269 27.16299211 33.77242269 29 33 C29.33 31.68 29.66 30.36 30 29 C30.99 29 31.98 29 33 29 C34.32 30.32 35.64 31.64 37 33 C37 25.41 37 17.82 37 10 C25.78 10 14.56 10 3 10 Z "
                  fill="#2B2B2B"
                  transform="translate(6,0)"
                />
                <path
                  d="M0 0 C0.99 0 1.98 0 3 0 C3 2.31 3 4.62 3 7 C15.21 7 27.42 7 40 7 C40 18.88 40 30.76 40 43 C41.98 43 43.96 43 46 43 C46 43.33 46 43.66 46 44 C43.69 44 41.38 44 39 44 C39 32.12 39 20.24 39 8 C37.69338505 9.08108449 37.69338505 9.08108449 37.88647461 11.68383789 C37.89171143 12.85164795 37.89694824 14.01945801 37.90234375 15.22265625 C37.90556641 16.48271484 37.90878906 17.74277344 37.91210938 19.04101562 C37.92046597 20.38151109 37.92893093 21.72200588 37.9375 23.0625 C37.9425134 24.40689942 37.94707658 25.7513006 37.95117188 27.09570312 C37.96300512 30.39717941 37.97949029 33.69856803 38 37 C36.01025197 33.69959882 35.81130172 31.39656905 36.0234375 27.578125 C36.06903809 26.65418945 36.11463867 25.73025391 36.16162109 24.77832031 C36.23203613 23.61397461 36.30245117 22.44962891 36.375 21.25 C36.58125 17.5375 36.7875 13.825 37 10 C25.78 10 14.56 10 3 10 C3.33 20.23 3.66 30.46 4 41 C3.01 41.495 3.01 41.495 2 42 C1.67 42.99 1.34 43.98 1 45 C13.21 45 25.42 45 38 45 C38 47.64 38 50.28 38 53 C37.67 53 37.34 53 37 53 C37 50.69 37 48.38 37 46 C24.79 46.33 12.58 46.66 0 47 C0 34.79 0 22.58 0 10 C-1.98 10 -3.96 10 -6 10 C-6 9.01 -6 8.02 -6 7 C-4.02 7 -2.04 7 0 7 C0 4.69 0 2.38 0 0 Z "
                  fill="#191919"
                  transform="translate(6,0)"
                />
                <path
                  d="M0 0 C2 0.125 2 0.125 4 1 C5.3125 2.9375 5.3125 2.9375 6 5 C5.67 5.66 5.34 6.32 5 7 C3.02 7 1.04 7 -1 7 C-1.625 4.625 -1.625 4.625 -2 2 C-1.34 1.34 -0.68 0.68 0 0 Z "
                  fill="#1D1D1D"
                  transform="translate(30,15)"
                />
                <path d="" fill="#000000" transform="translate(0,0)" />
                <path d="" fill="#000000" transform="translate(0,0)" />
                <path d="" fill="#000000" transform="translate(0,0)" />
                <path d="" fill="#000000" transform="translate(0,0)" />
                <path d="" fill="#000000" transform="translate(0,0)" />
                <path d="" fill="#000000" transform="translate(0,0)" />
                <path d="" fill="#000000" transform="translate(0,0)" />
                <path d="" fill="#000000" transform="translate(0,0)" />
                <path d="" fill="#000000" transform="translate(0,0)" />
                <path d="" fill="#000000" transform="translate(0,0)" />
                <path d="" fill="#000000" transform="translate(0,0)" />
                <path d="" fill="#000000" transform="translate(0,0)" />
                <path d="" fill="#000000" transform="translate(0,0)" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withPreviewStyles(PalettePreview);
