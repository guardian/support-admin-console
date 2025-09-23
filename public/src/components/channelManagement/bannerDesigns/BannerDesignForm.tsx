import React from 'react';
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import {
  BannerDesign,
  BannerDesignHeaderImage,
  BannerDesignVisual,
  FontSize,
} from '../../../models/bannerDesign';
import { Theme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
// Removed granular colour editors in favour of palette selection
// import { BasicColoursEditor } from './BasicColoursEditor';
// import { HighlightedTextColoursEditor } from './HighlightedTextColoursEditor';
// import { CtaColoursEditor } from './CtaColoursEditor';
import { BannerDesignUsage } from './BannerDesignUsage';
// import { TickerDesignEditor } from './TickerDesignEditor';
import { HeaderImageEditor } from './HeaderImageEditor';
import { BannerVisualEditor } from './BannerVisualEditor';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { InfoOutlined } from '@mui/icons-material';
import { HeadlineSizeEditor } from './HeadlineSizeEditor';
import PaletteSelector, { SelectedPalette } from './PaletteSelector';
import { detectStyleAndThemeForDesign } from './utils/detectPalette';

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

  // Palette-driven: individual colour change handlers removed

  const onHeadlineSizeChange = (headerSize: FontSize): void => {
    onChange({
      ...design,
      fonts: {
        heading: {
          size: headerSize,
        },
      },
    });
  };

  // Palette-driven: CTA colour change handlers removed

  // Palette-driven: Ticker colour change handler removed

  const applySelectedPalette = (sp: SelectedPalette): void => {
    // Helper to convert '#RRGGBB' -> {r,g,b,kind:'hex'}
    const toHex = (hex: string) => {
      const value = hex.replace('#', '').toUpperCase();
      return {
        r: value.slice(0, 2),
        g: value.slice(2, 4),
        b: value.slice(4, 6),
        kind: 'hex' as const,
      };
    };

    const updated = {
      ...design,
      colours: {
        ...design.colours,
        basic: {
          background: toHex(sp.colours.background),
          bodyText: toHex(sp.colours.bodyText),
          headerText: toHex(sp.colours.heading),
          articleCountText: toHex(sp.colours.articleCountText || sp.colours.bodyText),
          logo: toHex(sp.colours.logo || '#000000'),
        },
        highlightedText: {
          text: toHex(sp.colours.highlightText),
          highlight: toHex(sp.colours.highlightBackground),
        },
        primaryCta: {
          default: {
            text: toHex(sp.colours.primaryCta.text),
            background: toHex(sp.colours.primaryCta.background),
            border: sp.colours.primaryCta.border ? toHex(sp.colours.primaryCta.border) : undefined,
          },
        },
        secondaryCta: {
          default: {
            text: toHex(sp.colours.secondaryCta.text),
            background: toHex(sp.colours.secondaryCta.background),
            border: sp.colours.secondaryCta.border
              ? toHex(sp.colours.secondaryCta.border)
              : undefined,
          },
        },
        closeButton: {
          default: {
            text: toHex(sp.colours.closeButton?.text || '#000000'),
            background: toHex(sp.colours.closeButton?.background || sp.colours.background),
            border: sp.colours.closeButton?.border
              ? toHex(sp.colours.closeButton.border)
              : toHex('#000000'),
          },
        },
        ticker: sp.colours.ticker
          ? {
              text: toHex(sp.colours.ticker.text), // deprecated
              filledProgress: toHex(sp.colours.ticker.filledProgress),
              progressBarBackground: toHex(sp.colours.ticker.progressBarBackground),
              goalMarker: toHex(sp.colours.ticker.goalMarker), // deprecated
              headlineColour: toHex(sp.colours.ticker.headlineColour),
              totalColour: toHex(sp.colours.ticker.totalColour),
              goalColour: toHex(sp.colours.ticker.goalColour),
            }
          : design.colours.ticker,
      },
    } as typeof design;

    // Apply choice card colours when the visual is ChoiceCards
    if (updated.visual?.kind === 'ChoiceCards' && sp.colours.choiceCards) {
      updated.visual = {
        ...updated.visual,
        buttonColour: toHex(sp.colours.choiceCards.buttonColour),
        buttonTextColour: toHex(sp.colours.choiceCards.buttonTextColour),
        buttonBorderColour: toHex(sp.colours.choiceCards.buttonBorderColour),
        buttonSelectColour: toHex(sp.colours.choiceCards.buttonSelectColour),
        buttonSelectTextColour: toHex(sp.colours.choiceCards.buttonSelectTextColour),
        buttonSelectBorderColour: toHex(sp.colours.choiceCards.buttonSelectBorderColour),
      } as typeof updated.visual;
    }

    onChange(updated);
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
            onChange={onHeadlineSizeChange}
          />
        </AccordionDetails>
      </Accordion>

      <Accordion className={classes.accordion}>
        <AccordionSummary className={classes.sectionHeader} expandIcon={<ExpandMoreIcon />}>
          Banner Design
        </AccordionSummary>
        <AccordionDetails>
          <PaletteSelector
            onChange={applySelectedPalette}
            initialStyleId={detectStyleAndThemeForDesign(design)?.styleId || 'business-as-usual'}
            initialThemeId={detectStyleAndThemeForDesign(design)?.themeId || 'support-default'}
          />
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default BannerDesignForm;
