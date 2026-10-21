import { Checkbox, FormControlLabel, MenuItem, TextField, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useCallback, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Inline1Message, Inline1Variant } from '../../../models/inline1';
import type { Inline1MessageType } from '../../../models/inline1';
import { ResponsiveImage } from '../../../models/shared';
import { ResponsiveImageEditor } from '../../shared/ResponsiveImageEditor';
import VariantCtaFieldsEditor from '../../tests/variants/variantCtaFieldsEditor';
import { Inline1EditorConfig } from '../helpers/shared';
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
import { RichTextEditorSingleLine, RteMenuConstraints } from '../richTextEditor/richTextEditor';
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

const HorizontalRadioGroup = styled('div')(({ theme }) => ({
  '& .MuiFormGroup-root': {
    flexDirection: 'row',
    columnGap: theme.spacing(8),
  },
}));

const SectionHeader = styled(Typography)(({ theme }) => ({
  fontSize: 16,
  color: theme.palette.grey[900],
  fontWeight: 500,
}));

type SupportMessage = Extract<Inline1Message, { type: 'Inline1SupportMessage' }>;
type NewsletterMessage = Extract<Inline1Message, { type: 'Inline1NewsletterMessage' }>;
type SupportCopy = Pick<SupportMessage, 'heading' | 'body'>;

const FREQUENCY_OPTIONS = [
  'Daily',
  'Weekdays',
  'Twice weekly',
  'Weekly',
  'Fortnightly',
  'Monthly',
] as const;

interface MessageEditorProps<M extends Inline1Message> {
  variant?: Inline1Variant;
  message: M;
  onChange: (message: M) => void;
  onValidationChange: (isValid: boolean) => void;
  isDisabled: boolean;
  inline1EditorConfig?: Inline1EditorConfig;
}

interface CopyFieldConfig {
  validateCopy: (text: string | undefined) => string | undefined;
  rteMenuConstraints: RteMenuConstraints;
}

// Derives the heading/body rich text validation + toolbar config from the editor's platform.
// Shared by both the support-revenue message and newsletter message editors below.
const buildCopyFieldConfig = (inline1EditorConfig?: Inline1EditorConfig): CopyFieldConfig => {
  const templateValidator = templateValidatorForPlatform('DOTCOM');
  const { platform } = inline1EditorConfig ?? { platform: 'DOTCOM' };
  const enableHtml = platform === 'DOTCOM';
  const htmlValidator = enableHtml ? () => undefined : noHtmlValidator;

  return {
    validateCopy: (text) => (text ? (templateValidator(text) ?? htmlValidator(text)) : undefined),
    rteMenuConstraints: {
      enableHtml,
      enableBold: true,
      enableItalic: true,
      enableStrikethrough: true,
      enableCopyTemplates: true,
      enableLink: true,
      enableCurrencyTemplate: VALID_TEMPLATES[platform].includes(CURRENCY_TEMPLATE),
      enableCountryNameTemplate: VALID_TEMPLATES[platform].includes(COUNTRY_NAME_TEMPLATE),
      enableArticleCountTemplate: VALID_TEMPLATES[platform].includes(ARTICLE_COUNT_TEMPLATE),
      enableDateTemplate: VALID_TEMPLATES[platform].includes(DATE),
      enableDayTemplate: VALID_TEMPLATES[platform].includes(DAY_OF_THE_WEEK),
    },
  };
};

const SupportMessageEditor: React.FC<MessageEditorProps<SupportMessage>> = ({
  variant,
  message,
  onChange,
  onValidationChange,
  isDisabled,
  inline1EditorConfig,
}: MessageEditorProps<SupportMessage>) => {
  const setValidationStatusForField = useValidation(onValidationChange);
  const { validateCopy, rteMenuConstraints } = buildCopyFieldConfig(inline1EditorConfig);
  const [hasImage, setHasImage] = useState<boolean>(message.image !== undefined);

  const {
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

  useEffect(() => {
    setHasImage(message.image !== undefined);
  }, [message.image]);

  useEffect(() => {
    if (!hasImage) {
      setValidationStatusForField('image', true);
    }
  }, [hasImage, setValidationStatusForField]);

  const onImageValidationChange = useCallback(
    (isValid: boolean) => setValidationStatusForField('image', isValid),
    [setValidationStatusForField],
  );

  const updateCopy = ({ heading, body }: SupportCopy): void => {
    onChange({ ...message, heading, body });
  };

  const updateImage = (image: ResponsiveImage): void => {
    onChange({ ...message, image });
  };

  const updateHasImage = (checked: boolean): void => {
    setHasImage(checked);
    if (!checked) {
      onChange({ ...message, image: undefined });
    }
  };

  return (
    <Container>
      <Section>
        <SectionHeader variant="h4">Supporter revenue message content</SectionHeader>
        <Controller
          name="heading"
          control={control}
          rules={{ required: EMPTY_ERROR_HELPER_TEXT, validate: validateCopy }}
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
              rteMenuConstraints={rteMenuConstraints}
            />
          )}
        />

        <Controller
          name="body"
          control={control}
          rules={{ required: EMPTY_ERROR_HELPER_TEXT, validate: validateCopy }}
          render={({ field }) => (
            <RichTextEditorSingleLine
              error={errors.body !== undefined}
              helperText={errors.body ? (errors.body.message ?? errors.body.type) : ''}
              copyData={field.value}
              updateCopy={(value) => {
                field.onChange(value);
                void handleSubmit(updateCopy)();
              }}
              name="body"
              label="Body"
              disabled={isDisabled}
              rteMenuConstraints={rteMenuConstraints}
            />
          )}
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
        <FormControlLabel
          control={
            <Checkbox
              checked={hasImage}
              onChange={(e) => updateHasImage(e.target.checked)}
              disabled={isDisabled}
            />
          }
          label="Include an image"
        />
        {hasImage && (
          <ResponsiveImageEditor
            variant={variant ?? { name: 'CONTROL', message }}
            isDisabled={isDisabled}
            onValidationChange={onImageValidationChange}
            onChange={updateImage}
          />
        )}
      </Section>
    </Container>
  );
};

const NewsletterMessageEditor: React.FC<MessageEditorProps<NewsletterMessage>> = ({
  message,
  onChange,
  onValidationChange,
  isDisabled,
  inline1EditorConfig,
}: MessageEditorProps<NewsletterMessage>) => {
  const { validateCopy, rteMenuConstraints } = buildCopyFieldConfig(inline1EditorConfig);
  const {
    register,
    handleSubmit,
    reset,
    trigger,
    control,
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
      <Controller
        name="heading"
        control={control}
        rules={{ required: EMPTY_ERROR_HELPER_TEXT, validate: validateCopy }}
        render={({ field }) => (
          <RichTextEditorSingleLine
            error={errors.heading !== undefined}
            helperText={errors.heading ? (errors.heading.message ?? errors.heading.type) : ''}
            copyData={field.value}
            updateCopy={(value) => {
              field.onChange(value);
              void handleSubmit(updateNewsletterMessage)();
            }}
            name="heading"
            label="Heading"
            disabled={isDisabled}
            rteMenuConstraints={rteMenuConstraints}
          />
        )}
      />
      <Controller
        name="body"
        control={control}
        rules={{ required: EMPTY_ERROR_HELPER_TEXT, validate: validateCopy }}
        render={({ field }) => (
          <RichTextEditorSingleLine
            error={errors.body !== undefined}
            helperText={errors.body ? (errors.body.message ?? errors.body.type) : ''}
            copyData={field.value}
            updateCopy={(value) => {
              field.onChange(value);
              void handleSubmit(updateNewsletterMessage)();
            }}
            name="body"
            label="Body"
            disabled={isDisabled}
            rteMenuConstraints={rteMenuConstraints}
          />
        )}
      />
      <TextField
        error={errors.newsletterId !== undefined}
        helperText={errors.newsletterId?.message}
        {...register('newsletterId', {
          required: EMPTY_ERROR_HELPER_TEXT,
        })}
        onBlur={() => void handleSubmit(updateNewsletterMessage)()}
        label="Newsletter ID"
        margin="normal"
        variant="outlined"
        disabled={isDisabled}
        fullWidth
      />
      <Controller
        name="frequency"
        control={control}
        rules={{ required: EMPTY_ERROR_HELPER_TEXT }}
        render={({ field: { ref, ...field } }) => (
          <TextField
            {...field}
            inputRef={ref}
            value={field.value ?? ''}
            select
            error={errors.frequency !== undefined}
            helperText={errors.frequency?.message}
            onBlur={() => {
              field.onBlur();
              void handleSubmit(updateNewsletterMessage)();
            }}
            label="Frequency"
            margin="normal"
            variant="outlined"
            disabled={isDisabled}
            fullWidth
          >
            {FREQUENCY_OPTIONS.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        )}
      />

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
  inline1EditorConfig,
}: Inline1VariantEditorProps) => {
  let messageEditor: React.ReactElement;

  switch (variant.message.type) {
    case 'Inline1SupportMessage':
      messageEditor = (
        <SupportMessageEditor
          variant={variant}
          message={variant.message}
          onChange={(message) => onChange({ ...variant, message })}
          onValidationChange={onValidationChange}
          isDisabled={isDisabled}
          inline1EditorConfig={inline1EditorConfig}
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
          inline1EditorConfig={inline1EditorConfig}
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
