import React from 'react';
import { Theme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';

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
    borderRadius: 8,
    padding: spacing(2),
    maxWidth: 420,
    minWidth: 360,
  },
  heading: {
    fontSize: 28,
    fontWeight: 700,
    marginBottom: spacing(1),
  },
  body: {
    fontSize: 14,
    marginBottom: spacing(1),
  },
  highlight: {
    display: 'inline-block',
    padding: '2px 6px',
    borderRadius: 3,
    marginBottom: spacing(2),
  },
  buttons: {
    display: 'flex',
    gap: spacing(1.5),
  },
  button: {
    borderRadius: 1000,
    padding: '8px 14px',
    fontWeight: 600,
    cursor: 'default',
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

export default PalettePreview;
