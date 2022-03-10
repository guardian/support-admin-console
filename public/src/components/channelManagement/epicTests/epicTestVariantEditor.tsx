import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
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
  SecondaryCta,
  TickerSettings,
} from '../helpers/shared';
import {
  EMPTY_ERROR_HELPER_TEXT,
  MAXLENGTH_ERROR_HELPER_TEXT,
  templateValidatorForPlatform,
} from '../helpers/validation';
import {RichTextEditor, getRteCopyLength, RichTextEditorSingleLine} from '../richTextEditor';
import VariantEditorSeparateArticleCountEditor from '../variantEditorSeparateArticleCountEditor';

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

const HEADER_DEFAULT_HELPER_TEXT = `Assitive text`;
const BODY_DEFAULT_HELPER_TEXT = `Maximum ${PARAGRAPHS_MAX_LENGTH} characters.`;
const HIGHTLIGHTED_TEXT_DEFAULT_HELPER_TEXT = `Final sentence of body copy.`;
const IMAGE_URL_DEFAULT_HELPER_TEXT =
  'Image ratio should be 2.5:1. This will appear above everything except a ticker';
const FOOTER_DEFAULT_HELPER_TEXT = `Bold text below the button.`;

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
  heading: string | undefined;
  paragraphs: string[];
  highlightedText: string | undefined;
  backgroundImageUrl: string | undefined;
  footer: string | undefined;
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
    heading: variant.heading || '',
    paragraphs: variant.paragraphs || [],
    highlightedText: variant.highlightedText || '',
    backgroundImageUrl: variant.backgroundImageUrl || '',
    footer: variant.footer || '',
  };

  const { register, handleSubmit, control, errors, trigger } = useForm<EpicTestMuiTextFields>({
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
    errors.paragraphs,
    errors.highlightedText,
    errors.backgroundImageUrl,
    errors.footer,
  ]);

  const onSubmit = ({
    heading,
    paragraphs,
    highlightedText,
    backgroundImageUrl,
    footer,
  }: EpicTestMuiTextFields): void => {
    onVariantChange({
      ...variant,
      heading,
      paragraphs,
      highlightedText,
      backgroundImageUrl,
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

  // RTE field validations
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

  // Form
  return (
    <div className={classes.container}>
      {epicEditorConfig.allowVariantHeader && (
        <Controller
          name="heading"
          control={control}
          rules={{
            required: epicEditorConfig.requireVariantHeader ? EMPTY_ERROR_HELPER_TEXT : undefined,
            validate: templateValidator,
          }}
          render={data => {
            return (
              <RichTextEditorSingleLine
                error={errors.heading !== undefined}
                helperText={errors.heading ? errors.heading.message : HEADER_DEFAULT_HELPER_TEXT}
                copyData={data.value}
                updateCopy={pars => {
                  data.onChange(pars);
                  handleSubmit(onSubmit)();
                }}
                name="heading"
                label="Header"
                disabled={!editMode}
              />
            );
          }}
        />
      )}

      <Controller
        name="paragraphs"
        control={control}
        rules={{
          required: true,
          validate: (pars: string[]) => pars.map(templateValidator).find(result => result !== true),
        }}
        render={data => {
          return (
            <RichTextEditor
              error={errors.paragraphs !== undefined}
              helperText={errors?.paragraphs?.message || getParagraphsHelperText()}
              copyData={data.value}
              updateCopy={pars => {
                data.onChange(pars);
                handleSubmit(onSubmit)();
              }}
              name="paragraphs"
              label="Body copy"
              disabled={!editMode}
            />
          );
        }}
      />

      {epicEditorConfig.allowVariantHighlightedText && (
        <Controller
          name="highlightedText"
          control={control}
          rules={{
            validate: templateValidator,
          }}
          render={data => {
            return (
              <RichTextEditorSingleLine
                error={errors.highlightedText !== undefined}
                helperText={
                  errors.highlightedText
                    ? errors.highlightedText.message
                    : HIGHTLIGHTED_TEXT_DEFAULT_HELPER_TEXT
                }
                copyData={data.value}
                updateCopy={pars => {
                  data.onChange(pars);
                  handleSubmit(onSubmit)();
                }}
                name="highlightedText"
                label="Highlighted text"
                disabled={!editMode}
              />
            );
          }}
        />
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

      {epicEditorConfig.allowVariantFooter && (
        <Controller
          name="footer"
          control={control}
          rules={{
            validate: templateValidator,
          }}
          render={data => {
            return (
              <RichTextEditorSingleLine
                error={errors.footer !== undefined}
                helperText={errors.footer ? errors.footer.message : FOOTER_DEFAULT_HELPER_TEXT}
                copyData={data.value}
                updateCopy={pars => {
                  data.onChange(pars);
                  handleSubmit(onSubmit)();
                }}
                name="footer"
                label="Footer"
                disabled={!editMode}
              />
            );
          }}
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
