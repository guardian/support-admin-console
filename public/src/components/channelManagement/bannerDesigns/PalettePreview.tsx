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
}

const useStyles = makeStyles(({ spacing }: Theme) => ({
  container: {
    display: 'flex',
    justifyContent: 'center',
  },
  card: {
    borderRadius: 12,
    padding: spacing(2),
    minWidth: 418,
  },
  heading: {
    fontFamily: 'GH Guardian Headline',
    fontSize: 42,
    fontWeight: 500,
    lineHeight: 1.15,
    marginBottom: spacing('4px'),
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
  },
  button: {
    borderRadius: 1000,
    cursor: 'default',
    fontFamily: 'GuardianTextSans',
    fontSize: 17,
    fontWeight: 700,
    padding: '6px 18px',
    textAlign: 'center',
    width: '50%',
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
        <div className={classes.heading} style={{ color: colours.heading }}>
          Heading
        </div>
        <div className={classes.body} style={{ color: colours.bodyText }}>
          Body Text.
        </div>
        <div
          className={classes.highlight}
          style={{ color: colours.highlightText, background: colours.highlightBackground }}
        >
          Highlighted text.
        </div>
        <div className={classes.buttons}>
          <div
            className={classes.button}
            style={{
              color: colours.primaryCta.text,
              background: colours.primaryCta.background,
              border: colours.primaryCta.border ? `2px solid ${colours.primaryCta.border}` : 'none',
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
    </div>
  );
};

export default withPreviewStyles(PalettePreview);
