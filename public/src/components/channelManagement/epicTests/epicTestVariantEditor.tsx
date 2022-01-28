import React, { useEffect } from 'react';
import { EpicVariant, SeparateArticleCount } from './epicTestsForm';
import {
  ContributionFrequency,
  Cta,
  EpicEditorConfig,
  SecondaryCta,
  TickerSettings,
} from '../helpers/shared';
import { makeStyles, TextField, Theme, Typography } from '@material-ui/core';
import EpicTestVariantEditorCtasEditor from './epicTestVariantEditorCtasEditor';
import VariantEditorSeparateArticleCountEditor from '../variantEditorSeparateArticleCountEditor';
import EpicTestTickerEditor from './epicTestTickerEditor';
import { EMPTY_ERROR_HELPER_TEXT, MAXLENGTH_ERROR_HELPER_TEXT } from '../helpers/validation';
import EpicTestChoiceCardsEditor from './epicTestChoiceCardsEditor';
import EpicTestSignInLinkEditor from './epicTestSignInLinkEditor';

import RichTextEditor from '../richTextEditor';

import { useForm } from 'react-hook-form';
import { templateValidatorForPlatform } from '../helpers/validation';


// CSS
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const getUseStyles = (shouldAddPadding: boolean) => {
  const useStyles = makeStyles(({ palette, spacing }: Theme) => ({
    container: {
      width: '100%',
      paddingTop: shouldAddPadding ? spacing(2) : 0,
      paddingLeft: shouldAddPadding ? spacing(4) : 0,
      paddingRight: shouldAddPadding ? spacing(10) : 0,

      '& > * + *': {
        marginTop: spacing(1),
      },
    },
    sectionHeader: {
      fontSize: 16,
      color: palette.grey[900],
      fontWeight: 500,
    },
    sectionContainer: {
      paddingTop: spacing(1),
      paddingBottom: spacing(2),

      '& > * + *': {
        marginTop: spacing(3),
      },
    },
  }));
  return useStyles;
};

// Hard-coded (magic) values
const PARAGRAPHS_MAX_LENGTH = 2000;

const HEADER_DEFAULT_HELPER_TEXT = 'Assitive text';
const BODY_DEFAULT_HELPER_TEXT = `Maximum ${PARAGRAPHS_MAX_LENGTH} characters`;
const HIGHTLIGHTED_TEXT_DEFAULT_HELPER_TEXT = 'Final sentence of body copy';
const IMAGE_URL_DEFAULT_HELPER_TEXT =
  'Image ratio should be 2.5:1. This will appear above everything except a ticker';
const FOOTER_DEFAULT_HELPER_TEXT = 'Bold text that appears below the button';

// Typescript
interface EpicTestVariantEditorProps {
  variant: EpicVariant;
  epicEditorConfig: EpicEditorConfig;
  onVariantChange: (updatedVariant: EpicVariant) => void;
  editMode: boolean;
  onDelete: () => void;
  onValidationChange: (isValid: boolean) => void;
}

interface EpicTestMuiTextFields {
  backgroundImageUrl: string;
}

// Component function
const EpicTestVariantEditor: React.FC<EpicTestVariantEditorProps> = ({
  variant,
  onVariantChange,
  editMode,
  epicEditorConfig,
  onValidationChange,
}: EpicTestVariantEditorProps) => {
  const classes = getUseStyles(epicEditorConfig.allowMultipleVariants)();

  // Handling MUI TextField updates
  const templateValidator = templateValidatorForPlatform('DOTCOM');

  const defaultValues: EpicTestMuiTextFields = {
    backgroundImageUrl: variant.backgroundImageUrl || '',
  };

  const { register, handleSubmit, errors, trigger } = useForm<EpicTestMuiTextFields>({
    mode: 'onChange',
    defaultValues,
  });

  useEffect(() => {
    console.log('trigger triggered', defaultValues);
    trigger();
  }, []);

  useEffect(() => {
    console.log('errors', errors, defaultValues);
    const isValid = Object.keys(errors).length === 0;
    onValidationChange(isValid);
  }, [errors.backgroundImageUrl]);

  const onSubmit = ({ backgroundImageUrl }: EpicTestMuiTextFields): void => {
    console.log('backgroundImageUrl', backgroundImageUrl, defaultValues);
    onVariantChange({ ...variant, backgroundImageUrl });
  };

  // Handling RTE Field updates
  const updateHeading = (updatedHeading: string[]): void => {
    onVariantChange({ ...variant, heading: updatedHeading[0] });
  };
  const updateParagraphs = (updatedParagraphs: string[]): void => {
    onVariantChange({ ...variant, paragraphs: updatedParagraphs });
  };
  const updateHighlightedText = (updatedHighlightedText: string[]): void => {
    onVariantChange({ ...variant, highlightedText: updatedHighlightedText[0] });
  };
  const updateFooter = (updatedFooter: string[]): void => {
    onVariantChange({ ...variant, footer: updatedFooter[0] });
  };

  // Handling other form field updates
  const updatePrimaryCta = (updatedCta?: Cta): void => {
    onVariantChange({ ...variant, cta: updatedCta });
  };
  const updateSecondaryCta = (updatedCta?: SecondaryCta): void => {
    onVariantChange({ ...variant, secondaryCta: updatedCta });
  };
  const updateSeparateArticleCount = (updatedSeparateArticleCount?: SeparateArticleCount): void => {
    onVariantChange({ ...variant, separateArticleCount: updatedSeparateArticleCount });
  };
  const updateTickerSettings = (updatedTickerSettings?: TickerSettings): void => {
    onVariantChange({ ...variant, tickerSettings: updatedTickerSettings });
  };
  const updateShowChoiceCards = (updatedshowChoiceCards?: boolean): void => {
    onVariantChange({ ...variant, showChoiceCards: updatedshowChoiceCards });
  };
  const updateDefaultChoiceCardFrequency = (
    updatedDefaultChoiceCardFrequency: ContributionFrequency,
  ): void => {
    onVariantChange({ ...variant, defaultChoiceCardFrequency: updatedDefaultChoiceCardFrequency });
  };
  const updateShowSignInLink = (updatedShowSignInLink?: boolean): void => {
    onVariantChange({ ...variant, showSignInLink: updatedShowSignInLink });
  };

  // RTE field validations
  const paragraphsLength = variant.paragraphs.join(' ').length;
  const getParagraphsHelperText = () => {
    if (!paragraphsLength) {
      return EMPTY_ERROR_HELPER_TEXT;
    }
    if (paragraphsLength > PARAGRAPHS_MAX_LENGTH) {
      return MAXLENGTH_ERROR_HELPER_TEXT;
    }
    return BODY_DEFAULT_HELPER_TEXT;
  };
  const checkForParagraphsError = () => {
    if (!paragraphsLength || paragraphsLength > PARAGRAPHS_MAX_LENGTH) {
      return true;
    }
    return false;
  };

  // Form
  return (
    <div className={classes.container}>
      {epicEditorConfig.allowVariantHeader && (
        <div>
          <RichTextEditor
            error={false}
            helperText={HEADER_DEFAULT_HELPER_TEXT}
            updateCopy={updateHeading}
            copyData={variant.heading}
            name="heading"
            label="Header"
            disabled={!editMode}
          />
        </div>
      )}
      <div>
        <RichTextEditor
          error={checkForParagraphsError()}
          helperText={getParagraphsHelperText()}
          copyData={variant.paragraphs}
          updateCopy={updateParagraphs}
          name="paragraphs"
          label="Body copy"
          disabled={!editMode}
        />
      </div>

      {epicEditorConfig.allowVariantHighlightedText && (
        <div>
          <RichTextEditor
            error={false}
            helperText={HIGHTLIGHTED_TEXT_DEFAULT_HELPER_TEXT}
            updateCopy={updateHighlightedText}
            copyData={variant.highlightedText}
            name="highlightedText"
            label="Highlighted text"
            disabled={!editMode}
          />
        </div>
      )}

      {epicEditorConfig.allowVariantImageUrl && (
        <div>
          <TextField
            inputRef={register({ validate: templateValidator })}
            error={errors.backgroundImageUrl !== undefined}
            helperText={IMAGE_URL_DEFAULT_HELPER_TEXT}
            onBlur={handleSubmit(onSubmit)}
            name="backgroundImageUrl"
            label="Image URL"
            margin="normal"
            variant="outlined"
            disabled={!editMode}
            fullWidth
          />
        </div>
      )}
{/*            inputRef={register({ validate: templateValidator })}
            error={errors.heading !== undefined}
            helperText={errors.heading ? errors.heading.message : HEADING_DEFAULT_HELPER_TEXT}
            onBlur={handleSubmit(onSubmit)}
            name="heading"
            label="Heading"
            margin="normal"
            variant="outlined"
            disabled={!editMode}
            fullWidth
*/}
      {epicEditorConfig.allowVariantFooter && (
        <div>
          <RichTextEditor
            error={false}
            helperText={FOOTER_DEFAULT_HELPER_TEXT}
            updateCopy={updateFooter}
            copyData={variant.footer}
            name="footer"
            label="Footer"
            disabled={!editMode}
          />
        </div>
      )}

      {epicEditorConfig.allowVariantCustomPrimaryCta && (
        <div className={classes.sectionContainer}>
          <Typography className={classes.sectionHeader} variant="h4">
            Buttons
          </Typography>

          <EpicTestVariantEditorCtasEditor
            primaryCta={variant.cta}
            secondaryCta={variant.secondaryCta}
            updatePrimaryCta={updatePrimaryCta}
            updateSecondaryCta={updateSecondaryCta}
            isDisabled={!editMode}
            onValidationChange={onValidationChange}
            supportSecondaryCta={epicEditorConfig.allowVariantCustomSecondaryCta}
          />
        </div>
      )}

      {epicEditorConfig.allowVariantSeparateArticleCount && (
        <div className={classes.sectionContainer}>
          <Typography className={classes.sectionHeader} variant="h4">
            Separate article count
          </Typography>

          <VariantEditorSeparateArticleCountEditor
            separateArticleCount={variant.separateArticleCount}
            updateSeparateArticleCount={updateSeparateArticleCount}
            isDisabled={!editMode}
          />
        </div>
      )}

      {epicEditorConfig.allowVariantTicker && (
        <div className={classes.sectionContainer}>
          <Typography className={classes.sectionHeader} variant="h4">
            Ticker
          </Typography>

          <EpicTestTickerEditor
            tickerSettings={variant.tickerSettings}
            updateTickerSettings={updateTickerSettings}
            isDisabled={!editMode}
            onValidationChange={onValidationChange}
          />
        </div>
      )}

      {epicEditorConfig.allowVariantChoiceCards && (
        <div className={classes.sectionContainer}>
          <Typography className={classes.sectionHeader} variant="h4">
            Choice Cards
          </Typography>

          <EpicTestChoiceCardsEditor
            showChoiceCards={variant.showChoiceCards}
            defaultFrequency={variant.defaultChoiceCardFrequency}
            updateShowChoiceCards={updateShowChoiceCards}
            updateDefaultFrequency={updateDefaultChoiceCardFrequency}
            isDisabled={!editMode}
          />
        </div>
      )}

      {epicEditorConfig.allowVariantSignInLink && (
        <div className={classes.sectionContainer}>
          <Typography className={classes.sectionHeader} variant="h4">
            Sign in link
          </Typography>

          <EpicTestSignInLinkEditor
            showSignInLink={variant.showSignInLink}
            updateShowSignInLink={updateShowSignInLink}
            isDisabled={!editMode}
          />
        </div>
      )}
    </div>
  );
};

export default EpicTestVariantEditor;
