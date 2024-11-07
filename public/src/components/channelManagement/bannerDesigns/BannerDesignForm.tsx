import React from 'react';
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import {
  BannerDesign,
  BannerDesignHeaderImage,
  BannerDesignVisual,
  BasicColours,
  CtaDesign,
  HighlightedTextColours,
  TickerDesign,
} from '../../../models/bannerDesign';
import { Theme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import { BasicColoursEditor } from './BasicColoursEditor';
import { HighlightedTextColoursEditor } from './HighlightedTextColoursEditor';
import { CtaColoursEditor } from './CtaColoursEditor';
import { BannerDesignUsage } from './BannerDesignUsage';
import { TickerDesignEditor } from './TickerDesignEditor';
import { HeaderImageEditor } from './HeaderImageEditor';
import { BannerVisualEditor } from './BannerVisualEditor';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { InfoOutlined } from '@mui/icons-material';
import { HeadlineSizeEditor } from './HeadlineSizeEditor';

type Props = {
  design: BannerDesign;
  setValidationStatus: (scope: string, isValid: boolean) => void;
  isDisabled: boolean;
  onChange: (design: BannerDesign) => void;
};

export const useStyles = makeStyles(({ spacing, palette }: Theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '100%',
    background: palette.background.paper, // #FFFFFF
    '& > * + *': {
      marginTop: spacing(1),
    },
  },
  colourSectionContainer: {
    '& input': {
      textTransform: 'uppercase',
    },
  },
  ctaEditors: {
    '& > * + *': {
      marginTop: spacing(4),
    },
    display: 'flex',
    flexDirection: 'column',
  },
  accordion: {
    border: `1px solid ${palette.grey[700]}`,
    borderRadius: 4,
    boxShadow: 'none',
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 500,
    color: palette.grey[700],
  },
  info: {
    display: 'flex',
    marginBottom: spacing(1),
    alignItems: 'center',
    '& > * + *': {
      marginLeft: spacing(1),
    },
  },
}));

const BannerDesignForm: React.FC<Props> = ({
  design,
  setValidationStatus,
  isDisabled,
  onChange,
}: Props) => {
  const classes = useStyles();

  const onValidationChange = (fieldName: string, isValid: boolean): void => {
    setValidationStatus(fieldName, isValid);
  };

  const onVisualChange = (visual?: BannerDesignVisual): void => {
    onChange({
      ...design,
      visual,
    });
  };

  const onHeaderImageChange = (headerImage?: BannerDesignHeaderImage): void => {
    onChange({
      ...design,
      headerImage,
    });
  };

  const onBasicColoursChange = (basicColours: BasicColours): void => {
    onChange({
      ...design,
      colours: {
        ...design.colours,
        basic: basicColours,
      },
    });
  };

  const onHighlightedTextColoursChange = (highlightedTextColours: HighlightedTextColours): void => {
    onChange({
      ...design,
      colours: {
        ...design.colours,
        highlightedText: highlightedTextColours,
      },
    });
  };

  const onHeadlineSizeChange = (headerSize: 'small' | 'medium' | 'large' = 'medium'): void => {
    onChange({
      ...design,
      fonts: {
        heading: {
          size: headerSize,
        },
      },
    });
  };

  const onCtaColoursChange = (name: 'primaryCta' | 'secondaryCta' | 'closeButton') => (
    cta: CtaDesign,
  ): void => {
    onChange({
      ...design,
      colours: {
        ...design.colours,
        [name]: cta,
      },
    });
  };

  const onTickerDesignChange = (ticker: TickerDesign): void => {
    onChange({
      ...design,
      colours: {
        ...design.colours,
        ticker,
      },
    });
  };

  return (
    <div className={classes.container}>
      <div className={classes.info}>
        <InfoOutlined />
        <span>
          Create accessible designs that always meet WCAG Grading of AAA or AA. Check for colour
          contrast at <a href="https://www.whocanuse.com/">whocanuse.com</a>
        </span>
      </div>
      <Accordion className={classes.accordion}>
        <AccordionSummary className={classes.sectionHeader} expandIcon={<ExpandMoreIcon />}>
          Usage
        </AccordionSummary>
        <AccordionDetails>
          <BannerDesignUsage designName={design.name} />
        </AccordionDetails>
      </Accordion>

      <Accordion className={classes.accordion}>
        <AccordionSummary className={classes.sectionHeader} expandIcon={<ExpandMoreIcon />}>
          Main Image or Choice Cards
        </AccordionSummary>
        <AccordionDetails>
          <BannerVisualEditor
            visual={design.visual}
            isDisabled={isDisabled}
            onValidationChange={onValidationChange}
            onChange={onVisualChange}
          />
        </AccordionDetails>
      </Accordion>

      <Accordion className={classes.accordion}>
        <AccordionSummary className={classes.sectionHeader} expandIcon={<ExpandMoreIcon />}>
          Header image
        </AccordionSummary>
        <AccordionDetails>
          <HeaderImageEditor
            headerImage={design.headerImage}
            isDisabled={isDisabled}
            onValidationChange={onValidationChange}
            onChange={onHeaderImageChange}
          />
        </AccordionDetails>
      </Accordion>

      <Accordion className={classes.accordion}>
        <AccordionSummary className={classes.sectionHeader} expandIcon={<ExpandMoreIcon />}>
          Headline Size
        </AccordionSummary>
        <AccordionDetails>
          <HeadlineSizeEditor
            headerSize={design.fonts?.heading?.size}
            isDisabled={isDisabled}
            onValidationChange={onValidationChange}
            onChange={onHeadlineSizeChange}
          />
        </AccordionDetails>
      </Accordion>

      <Accordion className={classes.accordion}>
        <AccordionSummary className={classes.sectionHeader} expandIcon={<ExpandMoreIcon />}>
          Basic Colours
        </AccordionSummary>
        <AccordionDetails>
          <BasicColoursEditor
            basicColours={design.colours.basic}
            isDisabled={isDisabled}
            onChange={onBasicColoursChange}
            onValidationChange={onValidationChange}
          />
        </AccordionDetails>
      </Accordion>

      <Accordion className={classes.accordion}>
        <AccordionSummary className={classes.sectionHeader} expandIcon={<ExpandMoreIcon />}>
          Highlighted Text Colours
        </AccordionSummary>
        <AccordionDetails>
          <HighlightedTextColoursEditor
            colours={design.colours.highlightedText}
            isDisabled={isDisabled}
            onChange={onHighlightedTextColoursChange}
            onValidationChange={onValidationChange}
          />
        </AccordionDetails>
      </Accordion>

      <Accordion className={[classes.accordion, classes.colourSectionContainer].join(' ')}>
        <AccordionSummary className={classes.sectionHeader} expandIcon={<ExpandMoreIcon />}>
          CTA Colours
        </AccordionSummary>

        <AccordionDetails className={classes.ctaEditors}>
          <CtaColoursEditor
            cta={design.colours.primaryCta}
            isDisabled={isDisabled}
            onChange={onCtaColoursChange('primaryCta')}
            onValidationChange={onValidationChange}
            name={'colours.primaryCta'}
            label="Primary CTA"
          />
          <CtaColoursEditor
            cta={design.colours.secondaryCta}
            isDisabled={isDisabled}
            onChange={onCtaColoursChange('secondaryCta')}
            onValidationChange={onValidationChange}
            name={'colours.secondaryCta'}
            label="Secondary CTA"
          />
          <CtaColoursEditor
            cta={design.colours.closeButton}
            isDisabled={isDisabled}
            onChange={onCtaColoursChange('closeButton')}
            onValidationChange={onValidationChange}
            name={'colours.closeButton'}
            label="Close button"
          />
        </AccordionDetails>
      </Accordion>

      <Accordion className={[classes.accordion, classes.colourSectionContainer].join(' ')}>
        <AccordionSummary className={classes.sectionHeader} expandIcon={<ExpandMoreIcon />}>
          Ticker Colours
        </AccordionSummary>

        <AccordionDetails>
          <TickerDesignEditor
            ticker={design.colours.ticker}
            isDisabled={isDisabled}
            onChange={onTickerDesignChange}
            onValidationChange={onValidationChange}
          />
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default BannerDesignForm;
