import { TextField, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useCallback, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Inline1Message, Inline1Variant } from '../../../models/inline1';
import type { Inline1MessageType } from '../../../models/inline1';
import VariantCtaFieldsEditor from '../../tests/variants/variantCtaFieldsEditor';
import { Image, Inline1EditorConfig } from '../helpers/shared';
import {
  ARTICLE_COUNT_TEMPLATE,
  COUNTRY_NAME_TEMPLATE,
  CURRENCY_TEMPLATE,
  DATE,
  DAY_OF_THE_WEEK,
  EMPTY_ERROR_HELPER_TEXT,
  noHtmlValidator,
  templateValidatorForPlatform,
  VALID_TEMPLATES,
} from '../helpers/validation';
import useValidation from '../hooks/useValidation';
import { ImageEditorToggle } from '../imageEditor';
import { RichTextEditorSingleLine } from '../richTextEditor/richTextEditor';
import TypedRadioGroup from '../TypedRadioGroup';

const Container = styled('div')(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(2, 4),
  '& > * + *': {
    marginTop: theme.spacing(3),
  },
}));

const Section = styled('div')(({ theme }) => ({
  '& > * + *': {
    marginTop: theme.spacing(1),
  },
}));

const HorizontalRadioGroup = styled('div')({
  '& .MuiFormGroup-root': {
    flexDirection: 'row',
  },
});

const SectionHeader = styled(Typography)(({ theme }) => ({
  fontSize: 16,
  color: theme.palette.grey[900],
  fontWeight: 500,
}));

type SupportMessage = Extract<Inline1Message, { type: 'Inline1SupportMessage' }>;
type NewsletterMessage = Extract<Inline1Message, { type: 'Inline1NewsletterMessage' }>;
type SupportCopy = Pick<SupportMessage, 'heading' | 'body'>;

interface MessageEditorProps<M extends Inline1Message> {
  message: M;
  onChange: (message: M) => void;
  onValidationChange: (isValid: boolean) => void;
  isDisabled: boolean;
  inline1EditorConfig?: Inline1EditorConfig;
}

const SupportMessageEditor: React.FC<MessageEditorProps<SupportMessage>> = ({
  message,
  onChange,
  onValidationChange,
  isDisabled,
  inline1EditorConfig,
}: MessageEditorProps<SupportMessage>) => {
  const setValidationStatusForField = useValidation(onValidationChange);
  const templateValidator = templateValidatorForPlatform('DOTCOM');

  const { platform } = inline1EditorConfig ?? { platform: 'DOTCOM' };
  const enableHtml = platform === 'DOTCOM';
  const htmlValidator = enableHtml ? () => undefined : noHtmlValidator;
  const lineValidator = (text: string | undefined) => {
    if (text) {
      return templateValidator(text) ?? htmlValidator(text);
    }
  };
  const enableCurrencyTemplate = VALID_TEMPLATES[platform].includes(CURRENCY_TEMPLATE);
  const enableCountryNameTemplate = VALID_TEMPLATES[platform].includes(COUNTRY_NAME_TEMPLATE);
  const enableArticleCountTemplate = VALID_TEMPLATES[platform].includes(ARTICLE_COUNT_TEMPLATE);
  const enableDateTemplate = VALID_TEMPLATES[platform].includes(DATE);
  const enableDayTemplate = VALID_TEMPLATES[platform].includes(DAY_OF_THE_WEEK);

  const {
    register,
    handleSubmit,
    reset,
    trigger,
    control,
    formState: { errors },
  } = useForm<SupportCopy>({
    mode: 'onChange',
    defaultValues: { heading: message.heading, body: message.body },
  });

  useEffect(() => {
    reset({ heading: message.heading, body: message.body });
    void trigger();
  }, [message.heading, message.body, reset, trigger]);

  useEffect(() => {
    setValidationStatusForField('copy', errors.heading === undefined && errors.body === undefined);
  }, [errors.heading, errors.body, setValidationStatusForField]);

  const onImageValidationChange = useCallback(
    (isValid: boolean) => setValidationStatusForField('image', isValid),
    [setValidationStatusForField],
  );

  const updateCopy = ({ heading, body }: SupportCopy): void => {
    onChange({ ...message, heading, body });
  };

  const imageForEditor: Image | undefined = message.image
    ? {
        mainUrl:
          [message.image.desktopUrl, message.image.tabletUrl, message.image.mobileUrl].find(
            (url) => url.trim() !== '',
          ) ?? '',
        altText: message.image.altText,
      }
    : undefined;

  const updateImage = (image?: Image): void => {
    onChange({
      ...message,
      image: image
        ? {
            mobileUrl: image.mainUrl,
            tabletUrl: image.mainUrl,
            desktopUrl: image.mainUrl,
            altText: image.altText,
          }
        : undefined,
    });
  };

  return (
    <Container>
      <Section>
        <SectionHeader variant="h4">Supporter revenue message content</SectionHeader>
        <Controller
          name="heading"
          control={control}
          rules={{
            required: EMPTY_ERROR_HELPER_TEXT,
            validate: lineValidator,
          }}
          render={({ field }) => (
            <RichTextEditorSingleLine
              error={errors.heading !== undefined}
              helperText={errors.heading ? (errors.heading.message ?? errors.heading.type) : ''}
              copyData={field.value}
              updateCopy={(value) => {
                field.onChange(value);
                void handleSubmit(updateCopy)();
              }}
              name="heading"
              label="Heading"
              disabled={isDisabled}
              rteMenuConstraints={{
                enableHtml,
                enableItalic: true,
                enableStrikethrough: true,
                enableCopyTemplates: true,
                enableLink: true,
                enableCurrencyTemplate,
                enableCountryNameTemplate,
                enableArticleCountTemplate,
                enableDateTemplate,
                enableDayTemplate,
              }}
            />
          )}
        />

        <TextField
          error={errors.body !== undefined}
          helperText={errors.body?.message}
          {...register('body', {
            required: EMPTY_ERROR_HELPER_TEXT,
            validate: templateValidator,
          })}
          onBlur={() => void handleSubmit(updateCopy)()}
          label="Body"
          margin="normal"
          variant="outlined"
          disabled={isDisabled}
          multiline
          minRows={4}
          fullWidth
        />
      </Section>

      <Section>
        <SectionHeader variant="h4">Primary CTA</SectionHeader>
        <VariantCtaFieldsEditor
          cta={message.primaryCta}
          updateCta={(primaryCta) => onChange({ ...message, primaryCta })}
          onValidationChange={(isValid) => setValidationStatusForField('primaryCta', isValid)}
          isDisabled={isDisabled}
        />
      </Section>

      <Section>
        <SectionHeader variant="h4">Image</SectionHeader>
        <ImageEditorToggle
          image={imageForEditor}
          updateImage={updateImage}
          isDisabled={isDisabled}
          onValidationChange={onImageValidationChange}
          guidance=""
          label="Add an optional image"
        />
      </Section>
    </Container>
  );
};

const NewsletterMessageEditor: React.FC<MessageEditorProps<NewsletterMessage>> = ({
  message,
  onChange,
  onValidationChange,
  isDisabled,
}: MessageEditorProps<NewsletterMessage>) => {
  const templateValidator = templateValidatorForPlatform('DOTCOM');
  const {
    register,
    handleSubmit,
    reset,
    trigger,
    formState: { errors },
  } = useForm<NewsletterMessage>({ mode: 'onChange', defaultValues: message });

  useEffect(() => {
    reset(message);
    void trigger();
  }, [message, reset, trigger]);

  useEffect(() => {
    onValidationChange(
      errors.newsletterId === undefined &&
        errors.frequency === undefined &&
        errors.heading === undefined &&
        errors.body === undefined,
    );
  }, [errors.newsletterId, errors.frequency, errors.heading, errors.body, onValidationChange]);

  const requiredFields: Array<{
    name: 'heading' | 'body' | 'newsletterId' | 'frequency';
    label: string;
  }> = [
    { name: 'heading', label: 'Heading' },
    { name: 'body', label: 'Body' },
    { name: 'newsletterId', label: 'Newsletter ID' },
    { name: 'frequency', label: 'Frequency' },
  ];

  const updateNewsletterMessage = ({ imageUrl, ...updatedMessage }: NewsletterMessage): void => {
    const normalizedImageUrl = imageUrl?.trim();
    onChange({
      ...updatedMessage,
      imageUrl: normalizedImageUrl === '' ? undefined : normalizedImageUrl,
    });
  };

  return (
    <Container>
      <SectionHeader variant="h4">Newsletter signups content</SectionHeader>
      {requiredFields.map(({ name, label }) => (
        <TextField
          key={name}
          error={errors[name] !== undefined}
          helperText={errors[name]?.message}
          {...register(name, {
            required: EMPTY_ERROR_HELPER_TEXT,
            validate: name === 'heading' || name === 'body' ? templateValidator : undefined,
          })}
          onBlur={() => void handleSubmit(updateNewsletterMessage)()}
          label={label}
          margin="normal"
          variant="outlined"
          disabled={isDisabled}
          multiline={name === 'body'}
          minRows={name === 'body' ? 4 : undefined}
          fullWidth
        />
      ))}
      <TextField
        {...register('imageUrl')}
        onBlur={() => void handleSubmit(updateNewsletterMessage)()}
        label="Image URL (optional)"
        margin="normal"
        variant="outlined"
        disabled={isDisabled}
        fullWidth
      />
    </Container>
  );
};

const PuzzlesMessageEditor: React.FC<{
  onValidationChange: (isValid: boolean) => void;
}> = ({ onValidationChange }) => {
  useEffect(() => {
    onValidationChange(true);
  }, [onValidationChange]);

  return (
    <Container>
      <Typography variant="body1">
        Puzzle messages cannot be configured from Reader Revenue Control Panel.
      </Typography>
    </Container>
  );
};

interface Inline1VariantEditorProps {
  variant: Inline1Variant;
  onChange: (variant: Inline1Variant) => void;
  onValidationChange: (isValid: boolean) => void;
  onMessageTypeChange: (messageType: Inline1MessageType) => void;
  isDisabled: boolean;
  inline1EditorConfig: Inline1EditorConfig;
}

const Inline1VariantEditor: React.FC<Inline1VariantEditorProps> = ({
  variant,
  onChange,
  onValidationChange,
  onMessageTypeChange,
  isDisabled,
}: Inline1VariantEditorProps) => {
  let messageEditor: React.ReactElement;

  switch (variant.message.type) {
    case 'Inline1SupportMessage':
      messageEditor = (
        <SupportMessageEditor
          message={variant.message}
          onChange={(message) => onChange({ ...variant, message })}
          onValidationChange={onValidationChange}
          isDisabled={isDisabled}
        />
      );
      break;
    case 'Inline1PuzzlesMessage':
      messageEditor = <PuzzlesMessageEditor onValidationChange={onValidationChange} />;
      break;
    case 'Inline1NewsletterMessage':
      messageEditor = (
        <NewsletterMessageEditor
          message={variant.message}
          onChange={(message) => onChange({ ...variant, message })}
          onValidationChange={onValidationChange}
          isDisabled={isDisabled}
        />
      );
      break;
  }

  return (
    <>
      <HorizontalRadioGroup>
        <TypedRadioGroup<Inline1MessageType>
          selectedValue={variant.message.type}
          onChange={onMessageTypeChange}
          isDisabled={isDisabled}
          labels={{
            Inline1SupportMessage: 'Supporter revenue / App download',
            Inline1PuzzlesMessage: 'Puzzles',
            Inline1NewsletterMessage: 'Newsletter signups',
          }}
        />
      </HorizontalRadioGroup>
      {messageEditor}
    </>
  );
};

export default Inline1VariantEditor;
