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
        </div>
      </div>
    </div>
  );
};

export default withPreviewStyles(PalettePreview);
