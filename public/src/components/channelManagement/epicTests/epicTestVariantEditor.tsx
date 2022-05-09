import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { makeStyles, Theme, Typography } from '@material-ui/core';

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
  noHtmlValidator,
  templateValidatorForPlatform,
  VALID_TEMPLATES,
  CURRENCY_TEMPLATE,
  COUNTRY_NAME_TEMPLATE,
  ARTICLE_COUNT_TEMPLATE,
} from '../helpers/validation';
import {
  RichTextEditor,
  RichTextEditorSingleLine,
  getRteCopyLength,
} from '../richTextEditor/richTextEditor';
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
  const {
    allowMultipleVariants,
    allowVariantHeader,
    allowVariantHighlightedText,
    allowVariantFooter,
    allowVariantImageUrl,
    allowVariantCustomPrimaryCta,
    allowVariantCustomSecondaryCta,
    allowVariantSeparateArticleCount,
    allowVariantTicker,
    allowVariantChoiceCards,
    allowVariantSignInLink,
    platform,
    requireVariantHeader,
  } = epicEditorConfig;

  const classes = getUseStyles(allowMultipleVariants)();

  const templateValidator = templateValidatorForPlatform(platform);
  const lineValidator = (text: string) => templateValidator(text) ?? htmlValidator(text);

  const defaultValues: FormData = {
    heading: variant.heading,
    paragraphs: variant.paragraphs,
    highlightedText: variant.highlightedText,
    image: variant.image,
    footer: variant.footer,
  };

  const { handleSubmit, control, errors, trigger } = useForm<FormData>({
    mode: 'onChange',
    defaultValues,
  });

  const noHtml = platform !== 'DOTCOM';
  const htmlValidator = noHtml ? noHtmlValidator : () => undefined;

  const noCurrencyTemplate = !VALID_TEMPLATES[platform].includes(CURRENCY_TEMPLATE);
  const noCountryNameTemplate = !VALID_TEMPLATES[platform].includes(COUNTRY_NAME_TEMPLATE);
  const noArticleCountTemplate = !VALID_TEMPLATES[platform].includes(ARTICLE_COUNT_TEMPLATE);

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
      {allowVariantHeader && (
        <Controller
          name="heading"
          control={control}
          rules={{
            required: requireVariantHeader ? EMPTY_ERROR_HELPER_TEXT : undefined,
            validate: lineValidator,
          }}
          render={data => {
            return (
              <RichTextEditorSingleLine
                error={errors.heading !== undefined}
                helperText={
                  errors.heading
                    ? errors.heading.message || errors.heading.type
                    : HEADER_DEFAULT_HELPER_TEXT
                }
                copyData={data.value}
                updateCopy={value => {
                  data.onChange(value);
                  handleSubmit(onSubmit)();
                }}
                name="heading"
                label="Header"
                disabled={!editMode}
                rteMenuConstraints={{
                  noHtml,
                  noBold: true,
                  noCurrencyTemplate,
                  noCountryNameTemplate,
                  noArticleCountTemplate,
                  noPriceTemplates: true,
                }}
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
          validate: (pars: string[]) =>
            getEmptyParagraphsError(pars) ??
            pars.map(lineValidator).find((result: string | undefined) => !!result),
        }}
        render={data => {
          return (
            <RichTextEditor
              error={errors.paragraphs !== undefined}
              helperText={
                errors.paragraphs
                  ? // @ts-ignore -- react-hook-form doesn't believe it has a message field
                    errors.paragraphs.message || errors.paragraphs.type
                  : getParagraphsHelperText()
              }
              copyData={data.value}
              updateCopy={pars => {
                data.onChange(pars);
                handleSubmit(onSubmit)();
              }}
              name="paragraphs"
              label="Body copy"
              disabled={!editMode}
              rteMenuConstraints={{
                noHtml,
                noCurrencyTemplate,
                noCountryNameTemplate,
                noArticleCountTemplate,
                noPriceTemplates: true,
              }}
            />
          );
        }}
      />

      {allowVariantHighlightedText && (
        <Controller
          name="highlightedText"
          control={control}
          rules={{
            required: false,
            validate: lineValidator,
          }}
          render={data => {
            return (
              <RichTextEditorSingleLine
                error={errors.highlightedText !== undefined}
                helperText={
                  errors.highlightedText
                    ? errors.highlightedText.message || errors.highlightedText.type
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
                rteMenuConstraints={{
                  noHtml,
                  noBold: true,
                  noCurrencyTemplate,
                  noCountryNameTemplate,
                  noArticleCountTemplate,
                  noPriceTemplates: true,
                }}
              />
            );
          }}
        />
      )}

      {allowVariantFooter && (
        <Controller
          name="footer"
          control={control}
          rules={{
            validate: lineValidator,
          }}
          render={data => {
            return (
              <RichTextEditorSingleLine
                error={errors.footer !== undefined}
                helperText={
                  errors.footer
                    ? errors.footer.message || errors.footer.type
                    : FOOTER_DEFAULT_HELPER_TEXT
                }
                copyData={data.value}
                updateCopy={pars => {
                  data.onChange(pars);
                  handleSubmit(onSubmit)();
                }}
                name="footer"
                label="Footer"
                disabled={!editMode}
                rteMenuConstraints={{
                  noHtml,
                  noCurrencyTemplate,
                  noCountryNameTemplate,
                  noArticleCountTemplate,
                  noPriceTemplates: true,
                }}
              />
            );
          }}
        />
      )}

      {allowVariantImageUrl && (
        <ImageEditorToggle
          image={variant.image}
          updateImage={updateImage}
          isDisabled={!editMode}
          onValidationChange={onValidationChange}
          label={'Image - appears below the article count badge and ticker'}
          guidance={'Ratio should be 2.5:1'}
        />
      )}

      {allowVariantCustomPrimaryCta && (
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
            supportSecondaryCta={allowVariantCustomSecondaryCta}
          />
        </div>
      )}

      {allowVariantSeparateArticleCount && (
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

      {allowVariantTicker && (
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

      {allowVariantChoiceCards && (
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

      {allowVariantSignInLink && (
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
