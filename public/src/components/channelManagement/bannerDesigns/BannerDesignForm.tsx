import { InfoOutlined } from '@mui/icons-material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';
import {
  BannerDesign,
  BannerDesignHeaderImage,
  BannerDesignVisual,
  FontSize,
} from '../../../models/bannerDesign';
import { stringToHexColour } from '../../../utils/bannerDesigns';
import { BannerDesignUsage } from './BannerDesignUsage';
import { BannerVisualEditor } from './BannerVisualEditor';
import { HeaderImageEditor } from './HeaderImageEditor';
import { HeadlineSizeEditor } from './HeadlineSizeEditor';
import PaletteSelector, { SelectedPalette } from './PaletteSelector';

type Props = {
  design: BannerDesign;
  setValidationStatus: (scope: string, isValid: boolean) => void;
  isDisabled: boolean;
  onChange: (design: BannerDesign) => void;
};

const Container = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  width: '100%',
  background: theme.palette.background.paper,
  '& > * + *': {
    marginTop: theme.spacing(1),
  },
}));

const StyledAccordion = styled(Accordion)(({ theme }) => ({
  border: `1px solid ${theme.palette.grey[700]}`,
  borderRadius: 4,
  boxShadow: 'none',
}));

const SectionHeader = styled(AccordionSummary)(({ theme }) => ({
  fontSize: 18,
  fontWeight: 500,
  color: theme.palette.grey[700],
}));

const Info = styled('div')(({ theme }) => ({
  display: 'flex',
  marginBottom: theme.spacing(1),
  alignItems: 'center',
  '& > * + *': {
    marginLeft: theme.spacing(1),
  },
}));

const BannerDesignForm: React.FC<Props> = ({
  design,
  setValidationStatus,
  isDisabled,
  onChange,
}: Props) => {
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
    if (!selectedPalette.styleId || !selectedPalette.themeId || !selectedPalette.colours) {
      setValidationStatus('colourTheme', false);
      return;
    }

    const updated: BannerDesign = {
      ...design,
      style: selectedPalette.styleId,
      colourTheme: selectedPalette.themeId,
      colours: {
        ...design.colours,
        basic: {
          background: stringToHexColour(selectedPalette.colours.background),
          bodyText: stringToHexColour(selectedPalette.colours.bodyText),
          headerText: stringToHexColour(selectedPalette.colours.heading),
          articleCountText: stringToHexColour(
            selectedPalette.colours.articleCountText || selectedPalette.colours.bodyText,
          ),
          logo: stringToHexColour(selectedPalette.colours.logo),
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
            text: stringToHexColour(selectedPalette.colours.closeButton.text || '#000000'),
            background: stringToHexColour(
              selectedPalette.colours.closeButton.background || selectedPalette.colours.background,
            ),
            border: selectedPalette.colours.closeButton.border
              ? stringToHexColour(selectedPalette.colours.closeButton.border)
              : stringToHexColour('#000000'),
          },
        },
        ticker: {
          filledProgress: stringToHexColour(selectedPalette.colours.ticker.filledProgress),
          progressBarBackground: stringToHexColour(
            selectedPalette.colours.ticker.progressBarBackground,
          ),
          headlineColour: stringToHexColour(selectedPalette.colours.ticker.headlineColour),
          totalColour: stringToHexColour(selectedPalette.colours.ticker.totalColour),
          goalColour: stringToHexColour(selectedPalette.colours.ticker.goalColour),
        },
      },
    };

    if (updated.visual?.kind === 'ChoiceCards') {
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

    setValidationStatus('colourTheme', true);
    onChange(updated);
  };

  return (
    <Container>
      <Info>
        <InfoOutlined />
        <span>
          Create accessible designs that always meet WCAG Grading of AAA or AA. Check for colour
          contrast at <a href="https://www.whocanuse.com/">whocanuse.com</a>
        </span>
      </Info>
      <StyledAccordion>
        <SectionHeader expandIcon={<ExpandMoreIcon />}>Usage</SectionHeader>
        <AccordionDetails>
          <BannerDesignUsage designName={design.name} />
        </AccordionDetails>
      </StyledAccordion>

      <StyledAccordion>
        <SectionHeader expandIcon={<ExpandMoreIcon />}>Banner Theme</SectionHeader>
        <AccordionDetails>
          <>
            <BannerVisualEditor
              visual={design.visual}
              isDisabled={isDisabled}
              onValidationChange={onValidationChange}
              onChange={onVisualChange}
            />
            <PaletteSelector
              key={`${design.style}-${design.colourTheme}-${design.visual?.kind}`}
              onChange={applySelectedPalette}
              initialStyleId={design.style}
              initialThemeId={design.colourTheme}
              visualKind={design.visual?.kind ?? 'Image'}
              isDisabled={isDisabled}
            />
          </>
        </AccordionDetails>
      </StyledAccordion>

      <StyledAccordion>
        <SectionHeader expandIcon={<ExpandMoreIcon />}>Header image</SectionHeader>
        <AccordionDetails>
          <HeaderImageEditor
            headerImage={design.headerImage}
            isDisabled={isDisabled}
            onValidationChange={onValidationChange}
            onChange={onHeaderImageChange}
          />
        </AccordionDetails>
      </StyledAccordion>

      <StyledAccordion>
        <SectionHeader expandIcon={<ExpandMoreIcon />}>Headline Size</SectionHeader>
        <AccordionDetails>
          <HeadlineSizeEditor
            headerSize={design.fonts?.heading?.size}
            isDisabled={isDisabled}
            onChange={onHeadlineSizeChange}
          />
        </AccordionDetails>
      </StyledAccordion>
    </Container>
  );
};

export default BannerDesignForm;
