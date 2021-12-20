import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
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
import { EMPTY_ERROR_HELPER_TEXT, templateValidatorForPlatform } from '../helpers/validation';
import EpicTestChoiceCardsEditor from './epicTestChoiceCardsEditor';
import EpicTestSignInLinkEditor from './epicTestSignInLinkEditor';

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

const HEADER_DEFAULT_HELPER_TEXT = 'Assitive text';
const BODY_DEFAULT_HELPER_TEXT = 'Maximum 500 characters';
const HIGHTLIGHTED_TEXT_DEFAULT_HELPER_TEXT = 'Final sentence of body copy';
const IMAGE_URL_DEFAULT_HELPER_TEXT =
  'Image ratio should be 2.5:1. This will appear above everything except a ticker';
const FOOTER_DEFAULT_HELPER_TEXT = 'Bold text that appears below the button';

interface FormData {
  heading?: string;
  body: string;
  highlightedText?: string;
  backgroundImageUrl?: string;
  footer?: string;
}

interface EpicTestVariantEditorProps {
  variant: EpicVariant;
  epicEditorConfig: EpicEditorConfig;
  onVariantChange: (updatedVariant: EpicVariant) => void;
  editMode: boolean;
  onDelete: () => void;
  onValidationChange: (isValid: boolean) => void;
}

const EpicTestVariantEditor: React.FC<EpicTestVariantEditorProps> = ({
  variant,
  onVariantChange,
  editMode,
  epicEditorConfig,
  onValidationChange,
}: EpicTestVariantEditorProps) => {
  const classes = getUseStyles(epicEditorConfig.allowMultipleVariants)();

  const templateValidator = templateValidatorForPlatform(epicEditorConfig.platform);

  const defaultValues: FormData = {
    heading: variant.heading,
    body: variant.paragraphs.join('\n'),
    highlightedText: variant.highlightedText,
    backgroundImageUrl: variant.backgroundImageUrl,
    footer: variant.footer,
  };

  const { register, handleSubmit, errors, trigger } = useForm<FormData>({
    mode: 'onChange',
    defaultValues,
  });

  useEffect(() => {
    trigger();
  }, []);

  useEffect(() => {
    const isValid = Object.keys(errors).length === 0;
    onValidationChange(isValid);
  }, [
    errors.heading,
    errors.body,
    errors.highlightedText,
    errors.backgroundImageUrl,
    errors.footer,
  ]);

  const onSubmit = ({
    heading,
    body,
    highlightedText,
    backgroundImageUrl,
    footer,
  }: FormData): void => {
    const paragraphs = body.split('\n');

    onVariantChange({
      ...variant,
      heading: heading || undefined,
      paragraphs,
      highlightedText: highlightedText || undefined,
      backgroundImageUrl: backgroundImageUrl || undefined,
      footer: footer || undefined,
    });
  };

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

  return (
    <div className={classes.container}>
      {epicEditorConfig.allowVariantHeader && (
        <div>
          <TextField
            inputRef={register({
              required: epicEditorConfig.requireVariantHeader ? EMPTY_ERROR_HELPER_TEXT : undefined,
              validate: templateValidator,
            })}
            error={errors.heading !== undefined}
            helperText={errors.heading ? errors.heading.message : HEADER_DEFAULT_HELPER_TEXT}
            onBlur={handleSubmit(onSubmit)}
            name="heading"
            label="Header"
            margin="normal"
            variant="outlined"
            disabled={!editMode}
            fullWidth
          />
        </div>
      )}

      <div>
        <TextField
          inputRef={register({
            required: EMPTY_ERROR_HELPER_TEXT,
            validate: templateValidator,
          })}
          error={errors.body !== undefined}
          helperText={errors.body ? errors.body.message : BODY_DEFAULT_HELPER_TEXT}
          onBlur={handleSubmit(onSubmit)}
          name="body"
          label="Body copy"
          margin="normal"
          variant="outlined"
          multiline
          rows={10}
          disabled={!editMode}
          fullWidth
        />
      </div>

      {epicEditorConfig.allowVariantHighlightedText && (
        <div>
          <TextField
            inputRef={register({
              validate: templateValidator,
            })}
            error={errors.highlightedText !== undefined}
            helperText={
              errors.highlightedText
                ? errors.highlightedText.message
                : HIGHTLIGHTED_TEXT_DEFAULT_HELPER_TEXT
            }
            onBlur={handleSubmit(onSubmit)}
            name="highlightedText"
            label="Highlighted text"
            margin="normal"
            variant="outlined"
            disabled={!editMode}
            fullWidth
          />
        </div>
      )}

      {epicEditorConfig.allowVariantImageUrl && (
        <div>
          <TextField
            inputRef={register()}
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

      {epicEditorConfig.allowVariantFooter && (
        <div>
          <TextField
            inputRef={register()}
            helperText={FOOTER_DEFAULT_HELPER_TEXT}
            onBlur={handleSubmit(onSubmit)}
            name="footer"
            label="Footer"
            margin="normal"
            variant="outlined"
            disabled={!editMode}
            fullWidth
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
