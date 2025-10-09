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

  const applySelectedPalette = (selectedPalette: SelectedPalette): void => {
    const updated: BannerDesign = {
      ...design,
      colours: {
        ...design.colours,
        basic: {
          background: stringToHexColour(selectedPalette.colours.background),
          bodyText: stringToHexColour(selectedPalette.colours.bodyText),
          headerText: stringToHexColour(selectedPalette.colours.heading),
          articleCountText: stringToHexColour(
            selectedPalette.colours.articleCountText || selectedPalette.colours.bodyText,
          ),
          logo: stringToHexColour(selectedPalette.colours.logo || '#000000'),
        },
        highlightedText: {
          text: stringToHexColour(selectedPalette.colours.highlightText),
          highlight: stringToHexColour(selectedPalette.colours.highlightBackground),
        },
        primaryCta: {
          default: {
            text: stringToHexColour(selectedPalette.colours.primaryCta.text),
            background: stringToHexColour(selectedPalette.colours.primaryCta.background),
            border: selectedPalette.colours.primaryCta.border
              ? stringToHexColour(selectedPalette.colours.primaryCta.border)
              : undefined,
          },
        },
        secondaryCta: {
          default: {
            text: stringToHexColour(selectedPalette.colours.secondaryCta.text),
            background: stringToHexColour(selectedPalette.colours.secondaryCta.background),
            border: selectedPalette.colours.secondaryCta.border
              ? stringToHexColour(selectedPalette.colours.secondaryCta.border)
              : undefined,
          },
        },
        closeButton: {
          default: {
            text: stringToHexColour(selectedPalette.colours.closeButton?.text || '#000000'),
            background: stringToHexColour(
              selectedPalette.colours.closeButton?.background || selectedPalette.colours.background,
            ),
            border: selectedPalette.colours.closeButton?.border
              ? stringToHexColour(selectedPalette.colours.closeButton.border)
              : stringToHexColour('#000000'),
          },
        },
        ticker: selectedPalette.colours.ticker
          ? {
              filledProgress: stringToHexColour(selectedPalette.colours.ticker.filledProgress),
              progressBarBackground: stringToHexColour(
                selectedPalette.colours.ticker.progressBarBackground,
              ),
              headlineColour: stringToHexColour(selectedPalette.colours.ticker.headlineColour),
              totalColour: stringToHexColour(selectedPalette.colours.ticker.totalColour),
              goalColour: stringToHexColour(selectedPalette.colours.ticker.goalColour),
            }
          : design.colours.ticker,
      },
    };

    if (updated.visual?.kind === 'ChoiceCards' && selectedPalette.colours.choiceCards) {
      updated.visual = {
        ...updated.visual,
        buttonColour: stringToHexColour(selectedPalette.colours.choiceCards.buttonColour),
        buttonTextColour: stringToHexColour(selectedPalette.colours.choiceCards.buttonTextColour),
        buttonBorderColour: stringToHexColour(
          selectedPalette.colours.choiceCards.buttonBorderColour,
        ),
        buttonSelectColour: stringToHexColour(
          selectedPalette.colours.choiceCards.buttonSelectColour,
        ),
        buttonSelectTextColour: stringToHexColour(
          selectedPalette.colours.choiceCards.buttonSelectTextColour,
        ),
        buttonSelectBorderColour: stringToHexColour(
          selectedPalette.colours.choiceCards.buttonSelectBorderColour,
        ),
        buttonSelectMarkerColour: stringToHexColour(
          selectedPalette.colours.choiceCards.buttonSelectMarkerColour,
        ),
        pillTextColour: stringToHexColour(selectedPalette.colours.choiceCards.pillTextColour),
        pillBackgroundColour: stringToHexColour(
          selectedPalette.colours.choiceCards.pillBackgroundColour,
        ),
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
              initialThemeId={
                design?.colourTheme ||
                (design.visual?.kind === 'ChoiceCards'
                  ? 'support-default'
                  : 'support-default-image')
              }
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
