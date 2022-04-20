import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { makeStyles, TextField, Theme, Typography } from '@material-ui/core';

import EpicTestChoiceCardsEditor from './epicTestChoiceCardsEditor';
import { EpicVariant, SeparateArticleCount } from './epicTestsForm';
import EpicTestSignInLinkEditor from './epicTestSignInLinkEditor';
import EpicTestTickerEditor from './epicTestTickerEditor';
import EpicTestVariantEditorCtasEditor from './epicTestVariantEditorCtasEditor';

import {
  ContributionFrequency,
  Cta,
  EpicEditorConfig,
  Image,
  SecondaryCta,
  TickerSettings,
} from '../helpers/shared';
import {
  EMPTY_ERROR_HELPER_TEXT,
  getEmptyParagraphsError,
  MAXLENGTH_ERROR_HELPER_TEXT,
  templateValidatorForPlatform,
} from '../helpers/validation';
import { getRteCopyLength } from '../richTextEditor/richTextEditor';
import VariantEditorSeparateArticleCountEditor from '../variantEditorSeparateArticleCountEditor';
import { ImageEditorToggle } from '../imageEditor';

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

const PARAGRAPHS_MAX_LENGTH = 2000;

const HEADER_DEFAULT_HELPER_TEXT = `Assitive text`;
const BODY_DEFAULT_HELPER_TEXT = `Maximum ${PARAGRAPHS_MAX_LENGTH} characters.`;
const HIGHTLIGHTED_TEXT_DEFAULT_HELPER_TEXT = `Final sentence of body copy.`;
const FOOTER_DEFAULT_HELPER_TEXT = `Bold text below the button.`;

interface FormData {
  heading?: string;
  paragraphs: string[];
  highlightedText?: string;
  image?: Image;
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
    paragraphs: variant.paragraphs,
    highlightedText: variant.highlightedText,
    image: variant.image,
    footer: variant.footer,
  };

  const { handleSubmit, errors, trigger, register, control } = useForm<FormData>({
    mode: 'onChange',
    defaultValues,
  });

  useEffect(() => {
    trigger();
  }, []);

  useEffect(() => {
    const isValid = Object.keys(errors).length === 0;
    onValidationChange(isValid);
  }, [errors.heading, errors.paragraphs, errors.highlightedText, errors.image, errors.footer]);

  const onSubmit = ({ heading, paragraphs, highlightedText, image, footer }: FormData): void => {
    onVariantChange({
      ...variant,
      heading,
      paragraphs,
      highlightedText,
      image,
      footer,
    });
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
  const updateImage = (image?: Image): void => {
    onVariantChange({ ...variant, image });
  };

  const getParagraphsHelperText = () => {
    const paragraphsLength = getRteCopyLength(variant.paragraphs);

    if (!paragraphsLength) {
      return EMPTY_ERROR_HELPER_TEXT;
    }
    if (paragraphsLength > PARAGRAPHS_MAX_LENGTH) {
      return MAXLENGTH_ERROR_HELPER_TEXT;
    }
    return BODY_DEFAULT_HELPER_TEXT;
  };

  return (
    <div className={classes.container}>
      {epicEditorConfig.allowVariantHeader && (
        <TextField
          inputRef={register({
            required: epicEditorConfig.requireVariantHeader ? EMPTY_ERROR_HELPER_TEXT : undefined,
            validate: templateValidator,
          })}
          error={errors.heading !== undefined}
          helperText={
            errors.heading
              ? errors.heading.message || errors.heading.type
              : HEADER_DEFAULT_HELPER_TEXT
          }
          onBlur={handleSubmit(onSubmit)}
          name="heading"
          label="Header"
          margin="normal"
          variant="outlined"
          disabled={!editMode}
          fullWidth
        />
      )}

      <Controller
        name="paragraphs"
        control={control}
        rules={{
          required: true,
          validate: (pars: string[]) =>
            getEmptyParagraphsError(pars) ??
            pars.map(templateValidator).find(result => result !== true),
        }}
        render={data => {
          return (
            <TextField
              value={data.value.join('\n')}
              error={errors.paragraphs !== undefined}
              helperText={
                errors.paragraphs
                  ? // @ts-ignore -- react-hook-form doesn't believe it has a message field
                    errors.paragraphs.message || errors.paragraphs.type
                  : getParagraphsHelperText()
              }
              onBlur={handleSubmit(onSubmit)}
              onChange={update => {
                console.log('onChange', update.target.value.split('\n'));
                data.onChange(update.target.value.split('\n'));
              }}
              name="paragraphs"
              label="Body copy"
              margin="normal"
              variant="outlined"
              multiline
              rows={10}
              disabled={!editMode}
              fullWidth
            />
          );
        }}
      />

      {epicEditorConfig.allowVariantHighlightedText && (
        <TextField
          inputRef={register({
            required: false,
            validate: templateValidator,
          })}
          error={errors.highlightedText !== undefined}
          helperText={
            errors.highlightedText
              ? errors.highlightedText.message || errors.highlightedText.type
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
      )}

      {epicEditorConfig.allowVariantFooter && (
        <TextField
          inputRef={register({
            required: false,
            validate: templateValidator,
          })}
          error={errors.footer !== undefined}
          helperText={
            errors.footer ? errors.footer.message || errors.footer.type : FOOTER_DEFAULT_HELPER_TEXT
          }
          onBlur={handleSubmit(onSubmit)}
          name="footer"
          label="Footer"
          margin="normal"
          variant="outlined"
          disabled={!editMode}
          fullWidth
        />
      )}

      {epicEditorConfig.allowVariantImageUrl && (
        <ImageEditorToggle
          image={variant.image}
          updateImage={updateImage}
          isDisabled={!editMode}
          onValidationChange={onValidationChange}
          label={'Image - appears below the article count badge and ticker'}
          guidance={'Ratio should be 2.5:1'}
        />
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
