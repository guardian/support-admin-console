import React from 'react';
import { Accordion, AccordionDetails, AccordionSummary } from '@material-ui/core';
import {
  BannerDesign,
  BannerDesignVisual,
  BasicColours,
  CtaDesign,
  GuardianRoundel,
  HighlightedTextColours,
  TickerDesign,
} from '../../../models/bannerDesign';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { BasicColoursEditor } from './BasicColoursEditor';
import { HighlightedTextColoursEditor } from './HighlightedTextColoursEditor';
import { CtaColoursEditor } from './CtaColoursEditor';
import TypedRadioGroup from '../TypedRadioGroup';
import { BannerDesignUsage } from './BannerDesignUsage';
import { TickerDesignEditor } from './TickerDesignEditor';
import { BannerVisualEditor } from './BannerVisualEditor';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

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

  const onRoundelChange = (roundel: GuardianRoundel): void => {
    onChange({
      ...design,
      colours: {
        ...design.colours,
        guardianRoundel: roundel,
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
          Visual
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

      <Accordion
        className={[classes.accordion, classes.colourSectionContainer].join(' ')}
      >
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

      <Accordion
        className={[classes.accordion, classes.colourSectionContainer].join(' ')}
      >
        <AccordionSummary className={classes.sectionHeader} expandIcon={<ExpandMoreIcon />}>
          Roundel style
        </AccordionSummary>

        <AccordionDetails>
          <TypedRadioGroup
            selectedValue={design.colours.guardianRoundel}
            onChange={onRoundelChange}
            isDisabled={isDisabled}
            labels={{
              default: 'Default',
              brand: 'Brand',
              inverse: 'Inverse',
            }}
          />
        </AccordionDetails>
      </Accordion>
      <Accordion
        className={[classes.accordion, classes.colourSectionContainer].join(' ')}
      >
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
