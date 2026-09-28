import { Box, FormControlLabel, Radio, RadioGroup, Typography } from '@mui/material';
import Alert from '@mui/material/Alert';
import { styled } from '@mui/material/styles';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { BannerContent, BannerStepMode, BannerUi, BannerVariant } from '../../../models/banner';
import { BannerDesign } from '../../../models/bannerDesign';
import { ChoiceCardsSettings } from '../../../models/choiceCards';
import { SeparateArticleCount } from '../../../models/epic';
import PromoCodesEditor from '../../shared/PromoCodesEditor';
import VariantSeparateArticleCountEditor from '../../tests/variants/variantSeparateArticleCountEditor';
import ChoiceCardsEditor from '../choiceCards/ChoiceCardsEditor';
import { Cta, SecondaryCta } from '../helpers/shared';
import {
  EMPTY_ERROR_HELPER_TEXT,
  getEmptyParagraphsError,
  templateValidatorForPlatform,
} from '../helpers/validation';
import useValidation from '../hooks/useValidation';
import {
  getRteCopyLength,
  RichTextEditor,
  RichTextEditorSingleLine,
} from '../richTextEditor/richTextEditor';
import TickerEditor from '../tickerEditor';
import BannerDesignSelector from './bannerDesignSelector';
import IsCollapsibleEditor from './isCollapsibleEditor';
import { getDefaultVariant } from './utils/defaults';
import VariantCtasEditor from './variantCtasEditor';

const Container = styled(Box)(({ theme }) => ({
  width: '100%',
  paddingTop: theme.spacing(2),
  paddingLeft: theme.spacing(4),
  paddingRight: theme.spacing(10),

  '& > * + *': {
    marginTop: theme.spacing(3),
  },
}));

const SectionHeader = styled(Typography)(({ theme }) => ({
  fontSize: 16,
  color: theme.palette.grey[900],
  fontWeight: 500,
}));

const SectionContainer = styled(Box)(({ theme }) => ({
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.grey[500]}`,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
}));
const BannerDesignSelectorContainer = styled('div')({
  alignSelf: 'flex-start',
});

const ContentContainer = styled(Box)(({ theme }) => ({
  marginLeft: theme.spacing(2),
}));

const ButtonsContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
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
  showMParticleMenu: boolean;
  isPrimaryCtaUrlDisabled?: boolean;
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
  showMParticleMenu,
  isPrimaryCtaUrlDisabled,
}: VariantContentEditorProps) => {
  const templateValidator = templateValidatorForPlatform('DOTCOM');

  const defaultValues: FormData = {
    heading: content.heading ?? '',
    paragraphs: getParagraphsOrMessageText(content.paragraphs, content.messageText),
    highlightedText: content.highlightedText ?? '',
  };

  /**
   * Only some fields are validated by the useForm here.
   * Ideally we'd combine the validated fields with the rest of the variant fields in a callback (inside the RTE Controllers below).
   * But the callback closes over the old state of `content`, causing it to overwrite changes to non-validated fields.
   * So instead we write updates to the validated fields to the `validatedFields` state, and merge with the rest of
   * `content` in a useEffect.
   */
  const [validatedFields, setValidatedFields] = useState<FormData>(defaultValues);

  // Use refs to stabilize callback dependencies and prevent infinite render loops
  const onChangeRef = useRef(onChange);
  const contentRef = useRef(content);
  const setValidationStatusForField = useValidation(onValidationChange);

  useEffect(() => {
    onChangeRef.current = onChange;
    contentRef.current = content;
  });

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
    void trigger();
  }, [trigger]);

  useEffect(() => {
    onChangeRef.current({
      ...contentRef.current,
      ...validatedFields,
      messageText: undefined,
    });
  }, [validatedFields]);

  useEffect(() => {
    const isValid =
      errors.heading === undefined &&
      errors.paragraphs === undefined &&
      errors.highlightedText === undefined;
    setValidationStatusForField('copy', isValid);
  }, [errors.heading, errors.paragraphs, errors.highlightedText, setValidationStatusForField]);

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

    return [
      getRteCopyLength([...content.paragraphs, content.highlightedText ?? '']),
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
      <SectionHeader variant="h4">{`Content${labelSuffix}`}</SectionHeader>

      <ContentContainer>
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
                helperText={errors.heading ? (errors.heading.message ?? errors.heading.type) : ''}
                copyData={field.value}
                updateCopy={(pars) => {
                  field.onChange(pars);
                  void handleSubmit(setValidatedFields)();
                }}
                name="heading"
                label="Header"
                disabled={!editMode}
                rteMenuConstraints={{
                  enableHtml: true,
                  enableItalic: true,
                  enableStrikethrough: true,
                  enableCopyTemplates: true,
                  enableCurrencyTemplate: true,
                  enableCountryNameTemplate: true,
                  enableArticleCountTemplate: true,
                  enableDateTemplate: true,
                  enableDayTemplate: true,
                  enableLink: true,
                  enableMParticleTemplates: showMParticleMenu,
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
                        (errors.paragraphs.message ?? errors.paragraphs.type)
                      : getParagraphsHelperText()
                  }
                  copyData={field.value}
                  updateCopy={(pars) => {
                    field.onChange(pars);
                    void handleSubmit(setValidatedFields)();
                  }}
                  name="paragraphs"
                  label="Body copy"
                  disabled={!editMode}
                  rteMenuConstraints={{
                    enableHtml: true,
                    enableBold: true,
                    enableItalic: true,
                    enableStrikethrough: true,
                    enableCopyTemplates: true,
                    enableCurrencyTemplate: true,
                    enableCountryNameTemplate: true,
                    enableArticleCountTemplate: true,
                    enableDateTemplate: true,
                    enableDayTemplate: true,
                    enablePriceTemplates: true,
                    enableLink: true,
                    enableMParticleTemplates: showMParticleMenu,
                  }}
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
                      ? (errors.highlightedText.message ?? errors.highlightedText.type)
                      : HIGHTLIGHTED_TEXT_HELPER_TEXT
                  }
                  copyData={field.value}
                  updateCopy={(pars) => {
                    field.onChange(pars);
                    void handleSubmit(setValidatedFields)();
                  }}
                  name="highlightedText"
                  label="Highlighted text"
                  disabled={!editMode}
                  rteMenuConstraints={{
                    enableHtml: true,
                    enableBold: false,
                    enableItalic: true,
                    enableStrikethrough: true,
                    enableCopyTemplates: true,
                    enableCurrencyTemplate: true,
                    enableCountryNameTemplate: true,
                    enableArticleCountTemplate: true,
                    enableDateTemplate: true,
                    enableDayTemplate: true,
                    enableMParticleTemplates: showMParticleMenu,
                    enableLink: true,
                  }}
                />
              );
            }}
          />
        </div>

        <ButtonsContainer>
          <SectionHeader variant="h4">{`Buttons${labelSuffix}`}</SectionHeader>

          <VariantCtasEditor
            primaryCta={content.cta}
            secondaryCta={content.secondaryCta}
            updatePrimaryCta={updatePrimaryCta}
            updateSecondaryCta={updateSecondaryCta}
            isDisabled={!editMode}
            onValidationChange={(isValid) => setValidationStatusForField('cta', isValid)}
            supportSecondaryCta={true}
            isPrimaryCtaUrlDisabled={isPrimaryCtaUrlDisabled}
          />
        </ButtonsContainer>
      </ContentContainer>
    </>
  );
};

interface VariantEditorProps {
  variant: BannerVariant;
  showMParticleMenu: boolean;
  onVariantChange: (update: (current: BannerVariant) => BannerVariant) => void;
  editMode: boolean;
  onDelete: () => void;
  onValidationChange: (isValid: boolean) => void;
  designs: BannerDesign[];
}

const VariantEditor: React.FC<VariantEditorProps> = ({
  variant,
  showMParticleMenu,
  editMode,
  onValidationChange,
  onVariantChange,
  designs,
}: VariantEditorProps) => {
  const setValidationStatusForField = useValidation(onValidationChange);

  // Memoize callbacks to prevent infinite render loops in child components
  const onMainContentChange = useCallback(
    (updatedContent: BannerContent): void =>
      onVariantChange((current) => ({ ...current, bannerContent: updatedContent })),
    [onVariantChange],
  );

  const onMainContentValidationChange = useCallback(
    (isValid: boolean): void => setValidationStatusForField('mainContent', isValid),
    [setValidationStatusForField],
  );

  const onMobileContentChange = useCallback(
    (updatedContent: BannerContent): void =>
      onVariantChange((current) => ({ ...current, mobileBannerContent: updatedContent })),
    [onVariantChange],
  );

  const onMobileContentValidationChange = useCallback(
    (isValid: boolean): void => setValidationStatusForField('mobileContent', isValid),
    [setValidationStatusForField],
  );

  const onTemplateValidationChange = useCallback(
    (isValid: boolean): void => setValidationStatusForField('template', isValid),
    [setValidationStatusForField],
  );

  const onChoiceCardsValidationChange = useCallback(
    (isValid: boolean): void => setValidationStatusForField('choiceCardsSettings', isValid),
    [setValidationStatusForField],
  );

  const onMobileContentRadioChange = (): void => {
    if (variant.mobileBannerContent === undefined) {
      onVariantChange((current) => ({
        ...current,
        mobileBannerContent: getDefaultVariant().bannerContent,
      }));
    } else {
      // remove mobile content and clear any validation errors
      setValidationStatusForField('mobileContent', true);
      onVariantChange((current) => ({
        ...current,
        mobileBannerContent: undefined,
      }));
    }
  };

  const updateSeparateArticleCountSettings = (
    updatedSeparateArticleCountSettings?: SeparateArticleCount,
  ): void => {
    onVariantChange((current) => ({
      ...current,
      separateArticleCountSettings: updatedSeparateArticleCountSettings,
    }));
  };

  const updateChoiceCardsSettings = (
    showChoiceCards: boolean, // unused for banners, as this comes from the banner design
    choiceCardsSettings?: ChoiceCardsSettings,
  ): void => {
    onVariantChange((current) => ({
      ...current,
      choiceCardsSettings,
    }));
  };

  const updatePromoCodes = (promoCodes: string[]): void => {
    onVariantChange((current) => ({
      ...current,
      promoCodes,
    }));
  };

  const updateBannerStepModeSettings = (bannerStepMode: BannerStepMode): void => {
    onVariantChange((current) => ({
      ...current,
      bannerStepMode,
      isCollapsible: bannerStepMode !== BannerStepMode.OneStep,
    }));
  };

  const designHasChoiceCards =
    designs.find((d) => d.name === variant.template.designName)?.visual?.kind === 'ChoiceCards';

  useEffect(() => {
    if (!designHasChoiceCards) {
      setValidationStatusForField('choiceCardsSettings', true);
    }
  }, [designHasChoiceCards, setValidationStatusForField]);

  return (
    <Container>
      <SectionContainer>
        <SectionHeader variant="h4">Banner design</SectionHeader>
        <BannerDesignSelectorContainer>
          <BannerDesignSelector
            designName={variant.template.designName}
            onUiChange={(ui: BannerUi): void =>
              onVariantChange((current) => ({
                ...current,
                template: ui,
              }))
            }
            editMode={editMode}
            designs={designs}
            onValidationChange={onTemplateValidationChange}
          />
        </BannerDesignSelectorContainer>
      </SectionContainer>

      <SectionContainer>
        <VariantContentEditor
          content={variant.bannerContent}
          template={variant.template}
          showMParticleMenu={showMParticleMenu}
          onChange={onMainContentChange}
          onValidationChange={onMainContentValidationChange}
          editMode={editMode}
          deviceType={variant.mobileBannerContent === undefined ? 'ALL' : 'NOT_MOBILE'}
          isPrimaryCtaUrlDisabled={designHasChoiceCards}
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
            showMParticleMenu={showMParticleMenu}
            onChange={onMobileContentChange}
            onValidationChange={onMobileContentValidationChange}
            editMode={editMode}
            deviceType={'MOBILE'}
            isPrimaryCtaUrlDisabled={designHasChoiceCards}
          />
        )}

        <PromoCodesEditor
          promoCodes={variant.promoCodes ?? []}
          updatePromoCodes={updatePromoCodes}
          isDisabled={!editMode}
        />
      </SectionContainer>

      <SectionContainer>
        <SectionHeader variant="h4">Choice Cards</SectionHeader>
        {!designHasChoiceCards && (
          <Alert severity="info">The selected design does not have choice cards</Alert>
        )}

        {designHasChoiceCards && (
          <ChoiceCardsEditor
            showChoiceCards={true}
            channel="banner"
            allowNoChoiceCards={false}
            choiceCardsSettings={variant.choiceCardsSettings}
            updateChoiceCardsSettings={updateChoiceCardsSettings}
            isDisabled={!editMode}
            onValidationChange={onChoiceCardsValidationChange}
          />
        )}
      </SectionContainer>

      <SectionContainer>
        <SectionHeader variant="h4">Separate article count</SectionHeader>

        <VariantSeparateArticleCountEditor
          separateArticleCount={variant.separateArticleCountSettings}
          updateSeparateArticleCount={updateSeparateArticleCountSettings}
          isDisabled={!editMode}
        />
      </SectionContainer>

      <SectionContainer>
        <SectionHeader variant="h4">Ticker</SectionHeader>

        <TickerEditor
          tickerSettings={variant.tickerSettings}
          updateTickerSettings={(tickerSettings) =>
            onVariantChange((current) => ({
              ...current,
              tickerSettings,
            }))
          }
          isDisabled={!editMode}
          onValidationChange={(isValid) => setValidationStatusForField('ticker', isValid)}
        />
      </SectionContainer>
      <SectionContainer>
        <SectionHeader variant="h4">Two step banner</SectionHeader>
        <IsCollapsibleEditor
          isCollapsible={variant.isCollapsible}
          bannerStepMode={variant.bannerStepMode}
          isDisabled={!editMode}
          updateBannerStepModeSettings={updateBannerStepModeSettings}
        />
      </SectionContainer>
    </Container>
  );
};

export default VariantEditor;
