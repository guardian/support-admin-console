import React from 'react';
import { GutterVariant } from '../../../models/gutter';
import { buildStorybookUrl } from '../helpers/dcrStorybook';
import { Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';

interface GutterProps {
  url: string;
  onCtaClick: () => void; // current props.
  // TODO: once DCR done, implement the rest
}
// TODO: remove this lint line when props passed in properly later
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const buildProps = (variant: GutterVariant): GutterProps => ({
  url: ' ',
  onCtaClick: () => {},
  // TODO: update with proper props later!
});

const useStyles = makeStyles(({}: Theme) => ({
  container: {
    width: '620px',
  },
  iframe: {
    width: '620px',
    height: '800px',
  },
}));

interface GutterVariantPreviewProps {
  variant: GutterVariant;
}
/**
 * Uses the DCR storybook to render the component, iframed.
 * Props are passed in the args parameter in the url.
 */
const GutterVariantPreview: React.FC<GutterVariantPreviewProps> = ({
  variant,
}: GutterVariantPreviewProps) => {
  const classes = useStyles();

  const props = buildProps(variant);

  const storyName = 'components-marketing-gutterask--default';
  const storybookUrl = buildStorybookUrl(storyName, props);

  return (
    <div>
      <iframe className={classes.iframe} src={storybookUrl}></iframe>
    </div>
  );
};

export default GutterVariantPreview;
