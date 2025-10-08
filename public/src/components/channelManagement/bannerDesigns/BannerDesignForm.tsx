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
import { BannerDesignUsage } from './BannerDesignUsage';
import { HeaderImageEditor } from './HeaderImageEditor';
import { BannerVisualEditor } from './BannerVisualEditor';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { InfoOutlined } from '@mui/icons-material';
import { HeadlineSizeEditor } from './HeadlineSizeEditor';
import PaletteSelector, { SelectedPalette } from './PaletteSelector';
import { stringToHexColour } from '../../../utils/bannerDesigns';

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
    background: palette.background.paper,
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

  const applySelectedPalette = (sp: SelectedPalette): void => {
    const updated: BannerDesign = {
      ...design,
      colours: {
        ...design.colours,
        basic: {
          background: stringToHexColour(sp.colours.background),
          bodyText: stringToHexColour(sp.colours.bodyText),
          headerText: stringToHexColour(sp.colours.heading),
          articleCountText: stringToHexColour(sp.colours.articleCountText || sp.colours.bodyText),
          logo: stringToHexColour(sp.colours.logo || '#000000'),
        },
        highlightedText: {
          text: stringToHexColour(sp.colours.highlightText),
          highlight: stringToHexColour(sp.colours.highlightBackground),
        },
        primaryCta: {
          default: {
            text: stringToHexColour(sp.colours.primaryCta.text),
            background: stringToHexColour(sp.colours.primaryCta.background),
            border: sp.colours.primaryCta.border
              ? stringToHexColour(sp.colours.primaryCta.border)
              : undefined,
          },
        },
        secondaryCta: {
          default: {
            text: stringToHexColour(sp.colours.secondaryCta.text),
            background: stringToHexColour(sp.colours.secondaryCta.background),
            border: sp.colours.secondaryCta.border
              ? stringToHexColour(sp.colours.secondaryCta.border)
              : undefined,
          },
        },
        closeButton: {
          default: {
            text: stringToHexColour(sp.colours.closeButton?.text || '#000000'),
            background: stringToHexColour(
              sp.colours.closeButton?.background || sp.colours.background,
            ),
            border: sp.colours.closeButton?.border
              ? stringToHexColour(sp.colours.closeButton.border)
              : stringToHexColour('#000000'),
          },
        },
        ticker: sp.colours.ticker
          ? {
              filledProgress: stringToHexColour(sp.colours.ticker.filledProgress),
              progressBarBackground: stringToHexColour(sp.colours.ticker.progressBarBackground),
              headlineColour: stringToHexColour(sp.colours.ticker.headlineColour),
              totalColour: stringToHexColour(sp.colours.ticker.totalColour),
              goalColour: stringToHexColour(sp.colours.ticker.goalColour),
            }
          : design.colours.ticker,
      },
    };

    if (updated.visual?.kind === 'ChoiceCards' && sp.colours.choiceCards) {
      updated.visual = {
        ...updated.visual,
        buttonColour: stringToHexColour(sp.colours.choiceCards.buttonColour),
        buttonTextColour: stringToHexColour(sp.colours.choiceCards.buttonTextColour),
        buttonBorderColour: stringToHexColour(sp.colours.choiceCards.buttonBorderColour),
        buttonSelectColour: stringToHexColour(sp.colours.choiceCards.buttonSelectColour),
        buttonSelectTextColour: stringToHexColour(sp.colours.choiceCards.buttonSelectTextColour),
        buttonSelectBorderColour: stringToHexColour(
          sp.colours.choiceCards.buttonSelectBorderColour,
        ),
        buttonSelectMarkerColour: stringToHexColour(
          sp.colours.choiceCards.buttonSelectMarkerColour,
        ),
        pillTextColour: stringToHexColour(sp.colours.choiceCards.pillTextColour),
        pillBackgroundColour: stringToHexColour(sp.colours.choiceCards.pillBackgroundColour),
      };
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
          Banner Theme
        </AccordionSummary>
        <AccordionDetails>
          <>
            <BannerVisualEditor
              visual={design.visual}
              isDisabled={isDisabled}
              onValidationChange={onValidationChange}
              onChange={onVisualChange}
            />
            <PaletteSelector
              onChange={applySelectedPalette}
              initialStyleId={design?.style || 'business-as-usual'}
              initialThemeId={design?.colourTheme || 'support-default'}
              visualKind={design.visual?.kind ?? 'None'}
            />
          </>
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
    </div>
  );
};

export default BannerDesignForm;
