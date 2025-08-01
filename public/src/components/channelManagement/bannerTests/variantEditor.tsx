import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { FormControlLabel, Radio, RadioGroup, Theme, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import VariantCtasEditor from './variantCtasEditor';
import {
  EMPTY_ERROR_HELPER_TEXT,
  getEmptyParagraphsError,
  templateValidatorForPlatform,
} from '../helpers/validation';
import { Cta, SecondaryCta } from '../helpers/shared';
import BannerDesignSelector from './bannerDesignSelector';
import { BannerContent, BannerUi, BannerVariant } from '../../../models/banner';
import { getDefaultVariant } from './utils/defaults';
import useValidation from '../hooks/useValidation';
import {
  getRteCopyLength,
  RichTextEditor,
  RichTextEditorSingleLine,
} from '../richTextEditor/richTextEditor';
import TickerEditor from '../tickerEditor';
import { BannerDesign } from '../../../models/bannerDesign';
import VariantSeparateArticleCountEditor from '../../tests/variants/variantSeparateArticleCountEditor';
import { SeparateArticleCount } from '../../../models/epic';
import ChoiceCardsEditor from '../choiceCards/ChoiceCardsEditor';
import { ChoiceCardsSettings } from '../../../models/choiceCards';
import Alert from '@mui/lab/Alert';
import PromoCodesEditor from '../choiceCards/PromoCodesEditor';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const useStyles = makeStyles(({ palette, spacing }: Theme) => ({
  container: {
    width: '100%',
    paddingTop: spacing(2),
    paddingLeft: spacing(4),
    paddingRight: spacing(10),

    '& > * + *': {
      marginTop: spacing(3),
    },
  },
  hook: {
    maxWidth: '400px',
  },
  sectionHeader: {
    fontSize: 16,
    color: palette.grey[900],
    fontWeight: 500,
  },
  sectionContainer: {
    paddingTop: spacing(2),
    paddingBottom: spacing(2),
    borderBottom: `1px solid ${palette.grey[500]}`,
    '& > * + *': {
      marginTop: spacing(3),
    },
  },
  contentContainer: {
    marginLeft: spacing(2),
  },
  buttonsContainer: {
    marginTop: spacing(2),
  },
  switchContainer: {
    display: 'flex',
    alignItems: 'center',

    '& > * + *': {
      marginLeft: spacing(1),
    },
  },
  switchLabel: {
    fontSize: '14px',
    fontWeight: 500,
  },
}));

const BODY_DEFAULT_HELPER_TEXT = 'Main banner message paragraph';
const HIGHTLIGHTED_TEXT_HELPER_TEXT = 'Final sentence of body copy';

const BODY_COPY_WITHOUT_SECONDARY_CTA_RECOMMENDED_LENGTH = 500;
const BODY_COPY_WITH_SECONDARY_CTA_RECOMMENDED_LENGTH = 500;

type DeviceType = 'ALL' | 'MOBILE' | 'NOT_MOBILE';

const getLabelSuffix = (deviceType: DeviceType): string => {
  switch (deviceType) {
    case 'MOBILE':
      return ' (mobile only)';
    case 'NOT_MOBILE':
      return ' (tablet + desktop)';
    default:
      return ' (all devices)';
  }
};

interface VariantContentEditorProps {
  content: BannerContent;
  template: BannerUi;
  onChange: (updatedContent: BannerContent) => void;
  onValidationChange: (isValid: boolean) => void;
  editMode: boolean;
  deviceType: DeviceType;
}

interface FormData {
  heading?: string;
  paragraphs: string[];
  highlightedText?: string;
}

// Temporary, while we migrate from messageText to paragraphs
const getParagraphsOrMessageText = (
  paras: string[] | undefined,
  text: string | undefined,
): string[] => {
  const bodyCopy = [];

  if (paras != null) {
    bodyCopy.push(...paras);
  } else if (text != null) {
    bodyCopy.push(text);
  }
  return bodyCopy;
};

const VariantContentEditor: React.FC<VariantContentEditorProps> = ({
  content,
  onChange,
  onValidationChange,
  editMode,
  deviceType,
}: VariantContentEditorProps) => {
  const classes = useStyles();

  const templateValidator = templateValidatorForPlatform('DOTCOM');

  const defaultValues: FormData = {
    heading: content.heading || '',
    paragraphs: getParagraphsOrMessageText(content.paragraphs, content.messageText),
    highlightedText: content.highlightedText || '',
  };

  /**
   * Only some fields are validated by the useForm here.
   * Ideally we'd combine the validated fields with the rest of the variant fields in a callback (inside the RTE Controllers below).
   * But the callback closes over the old state of `content`, causing it to overwrite changes to non-validated fields.
   * So instead we write updates to the validated fields to the `validatedFields` state, and merge with the rest of
   * `content` in a useEffect.
   */
  const [validatedFields, setValidatedFields] = useState<FormData>(defaultValues);
  const {
    handleSubmit,
    control,
    trigger,

    formState: { errors },
  } = useForm<FormData>({
    mode: 'onChange',
    defaultValues,
  });

  useEffect(() => {
    trigger();
  }, []);

  useEffect(() => {
    onChange({
      ...content,
      ...validatedFields,
      messageText: undefined,
    });
  }, [validatedFields]);

  useEffect(() => {
    const isValid = Object.keys(errors).length === 0;
    onValidationChange(isValid);
  }, [errors.heading, errors.paragraphs, errors.highlightedText]);

  const updatePrimaryCta = (updatedCta?: Cta): void => {
    onChange({ ...content, cta: updatedCta });
  };
  const updateSecondaryCta = (updatedCta?: SecondaryCta): void => {
    onChange({ ...content, secondaryCta: updatedCta });
  };

  const labelSuffix = getLabelSuffix(deviceType);

  const getBodyCopyLength = () => {
    const bodyCopyRecommendedLength = content.secondaryCta
      ? BODY_COPY_WITH_SECONDARY_CTA_RECOMMENDED_LENGTH
      : BODY_COPY_WITHOUT_SECONDARY_CTA_RECOMMENDED_LENGTH;

    if (content.paragraphs != null) {
      return [
        getRteCopyLength([...content.paragraphs, content.highlightedText || '']),
        bodyCopyRecommendedLength,
      ];
    }
    return [
      getRteCopyLength([content.messageText || '', content.highlightedText || '']),
      bodyCopyRecommendedLength,
    ];
  };

  const [copyLength, recommendedLength] = getBodyCopyLength();

  const getParagraphsHelperText = () => {
    if (!copyLength) {
      return EMPTY_ERROR_HELPER_TEXT;
    }
    if (copyLength > recommendedLength) {
      return `This copy is longer than the recommended length (${recommendedLength} chars). Please preview across breakpoints before publishing.`;
    }
    return `${BODY_DEFAULT_HELPER_TEXT} (${recommendedLength} chars)`;
  };

  return (
    <>
      <Typography className={classes.sectionHeader} variant="h4">
        {`Content${labelSuffix}`}
      </Typography>

      <div className={classes.contentContainer}>
        <Controller
          name="heading"
          control={control}
          rules={{
            validate: templateValidator,
          }}
          render={({ field }) => {
            return (
              <RichTextEditorSingleLine
                error={errors.heading !== undefined}
                helperText={errors.heading ? errors.heading.message || errors.heading.type : ''}
                copyData={field.value}
                updateCopy={pars => {
                  field.onChange(pars);
                  handleSubmit(setValidatedFields)();
                }}
                name="heading"
                label="Header"
                disabled={!editMode}
                rteMenuConstraints={{
                  noBold: true,
                }}
              />
            );
          }}
        />

        <div>
          <Controller
            name="paragraphs"
            control={control}
            rules={{
              required: true,
              validate: (pars: string[]) =>
                getEmptyParagraphsError(pars) ??
                pars.map(templateValidator).find((result: string | undefined) => !!result),
            }}
            render={({ field }) => {
              return (
                <RichTextEditor
                  error={errors.paragraphs !== undefined || copyLength > recommendedLength}
                  helperText={
                    errors.paragraphs
                      ? // @ts-ignore -- react-hook-form doesn't believe it has a message field
                        errors.paragraphs.message || errors.paragraphs.type
                      : getParagraphsHelperText()
                  }
                  copyData={field.value}
                  updateCopy={pars => {
                    field.onChange(pars);
                    handleSubmit(setValidatedFields)();
                  }}
                  name="paragraphs"
                  label="Body copy"
                  disabled={!editMode}
                />
              );
            }}
          />

          <Controller
            name="highlightedText"
            control={control}
            rules={{
              validate: templateValidator,
            }}
            render={({ field }) => {
              return (
                <RichTextEditorSingleLine
                  error={errors.highlightedText !== undefined}
                  helperText={
                    errors.highlightedText
                      ? errors.highlightedText.message || errors.highlightedText.type
                      : HIGHTLIGHTED_TEXT_HELPER_TEXT
                  }
                  copyData={field.value}
                  updateCopy={pars => {
                    field.onChange(pars);
                    handleSubmit(setValidatedFields)();
                  }}
                  name="highlightedText"
                  label="Highlighted text"
                  disabled={!editMode}
                  rteMenuConstraints={{
                    noBold: true,
                  }}
                />
              );
            }}
          />
        </div>

        <div className={classes.buttonsContainer}>
          <Typography className={classes.sectionHeader} variant="h4">
            {`Buttons${labelSuffix}`}
          </Typography>

          <VariantCtasEditor
            primaryCta={content.cta}
            secondaryCta={content.secondaryCta}
            updatePrimaryCta={updatePrimaryCta}
            updateSecondaryCta={updateSecondaryCta}
            isDisabled={!editMode}
            onValidationChange={onValidationChange}
            supportSecondaryCta={true}
          />
        </div>
      </div>
    </>
  );
};

interface VariantEditorProps {
  variant: BannerVariant;
  onVariantChange: (update: (current: BannerVariant) => BannerVariant) => void;
  editMode: boolean;
  onDelete: () => void;
  onValidationChange: (isValid: boolean) => void;
  designs: BannerDesign[];
}

const VariantEditor: React.FC<VariantEditorProps> = ({
  variant,
  editMode,
  onValidationChange,
  onVariantChange,
  designs,
}: VariantEditorProps) => {
  const classes = useStyles();
  const setValidationStatusForField = useValidation(onValidationChange);

  const onMobileContentRadioChange = (): void => {
    if (variant.mobileBannerContent === undefined) {
      onVariantChange(current => ({
        ...current,
        mobileBannerContent: getDefaultVariant().bannerContent,
      }));
    } else {
      // remove mobile content and clear any validation errors
      setValidationStatusForField('mobileContent', true);
      onVariantChange(current => ({
        ...current,
        mobileBannerContent: undefined,
      }));
    }
  };

  const updateSeparateArticleCountSettings = (
    updatedSeparateArticleCountSettings?: SeparateArticleCount,
  ): void => {
    onVariantChange(current => ({
      ...current,
      separateArticleCountSettings: updatedSeparateArticleCountSettings,
    }));
  };

  const updateChoiceCardsSettings = (
    showChoiceCards: boolean, // unused for banners, as this comes from the banner design
    choiceCardsSettings?: ChoiceCardsSettings,
  ): void => {
    onVariantChange(current => ({
      ...current,
      choiceCardsSettings,
    }));
  };

  const updatePromoCodes = (promoCodes: string[]): void => {
    onVariantChange(current => ({
      ...current,
      promoCodes,
    }));
  };

  const designHasChoiceCards =
    designs.find(d => d.name === variant.template.designName)?.visual?.kind === 'ChoiceCards';

  return (
    <div className={classes.container}>
      <div className={classes.sectionContainer}>
        <Typography className={classes.sectionHeader} variant="h4">
          Banner design
        </Typography>
        <BannerDesignSelector
          designName={variant.template.designName}
          onUiChange={(ui: BannerUi): void =>
            onVariantChange(current => ({
              ...current,
              template: ui,
            }))
          }
          editMode={editMode}
          designs={designs}
          onValidationChange={(isValid): void => setValidationStatusForField('template', isValid)}
        />
      </div>

      <div className={classes.sectionContainer}>
        <VariantContentEditor
          content={variant.bannerContent}
          template={variant.template}
          onChange={(updatedContent: BannerContent): void =>
            onVariantChange(current => ({ ...current, bannerContent: updatedContent }))
          }
          onValidationChange={(isValid): void =>
            setValidationStatusForField('mainContent', isValid)
          }
          editMode={editMode}
          deviceType={variant.mobileBannerContent === undefined ? 'ALL' : 'NOT_MOBILE'}
        />

        <RadioGroup
          value={variant.mobileBannerContent !== undefined ? 'enabled' : 'disabled'}
          onChange={onMobileContentRadioChange}
        >
          <FormControlLabel
            value="disabled"
            key="disabled"
            control={<Radio />}
            label="Show the same copy across devices"
            disabled={!editMode}
          />
          <FormControlLabel
            value="enabled"
            key="enabled"
            control={<Radio />}
            label="Show different copy on mobile"
            disabled={!editMode}
          />
        </RadioGroup>
        {variant.mobileBannerContent && (
          <VariantContentEditor
            content={variant.mobileBannerContent}
            template={variant.template}
            onChange={(updatedContent: BannerContent): void =>
              onVariantChange(current => ({ ...current, mobileBannerContent: updatedContent }))
            }
            onValidationChange={(isValid): void =>
              setValidationStatusForField('mobileContent', isValid)
            }
            editMode={editMode}
            deviceType={'MOBILE'}
          />
        )}

        <PromoCodesEditor
          promoCodes={variant.promoCodes ?? []}
          updatePromoCodes={updatePromoCodes}
          isDisabled={!editMode}
        />
      </div>

      <div className={classes.sectionContainer}>
        <Typography className={classes.sectionHeader} variant="h4">
          Choice Cards
        </Typography>
        {!designHasChoiceCards && (
          <Alert severity="info">The selected design does not have choice cards</Alert>
        )}

        {designHasChoiceCards && (
          <ChoiceCardsEditor
            showChoiceCards={true}
            allowNoChoiceCards={false}
            choiceCardsSettings={variant.choiceCardsSettings}
            updateChoiceCardsSettings={updateChoiceCardsSettings}
            isDisabled={!editMode}
            onValidationChange={(isValid): void =>
              setValidationStatusForField('choiceCardsSettings', isValid)
            }
          />
        )}
      </div>

      <div className={classes.sectionContainer}>
        <Typography className={classes.sectionHeader} variant="h4">
          Separate article count
        </Typography>

        <VariantSeparateArticleCountEditor
          separateArticleCount={variant.separateArticleCountSettings}
          updateSeparateArticleCount={updateSeparateArticleCountSettings}
          isDisabled={!editMode}
        />
      </div>

      <div className={classes.sectionContainer}>
        <Typography className={classes.sectionHeader} variant="h4">
          Ticker
        </Typography>

        <TickerEditor
          tickerSettings={variant.tickerSettings}
          updateTickerSettings={tickerSettings =>
            onVariantChange(current => ({
              ...current,
              tickerSettings,
            }))
          }
          isDisabled={!editMode}
          onValidationChange={onValidationChange}
        />
      </div>
    </div>
  );
};

export default VariantEditor;
