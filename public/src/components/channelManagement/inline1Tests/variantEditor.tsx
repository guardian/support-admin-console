import { TextField, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Inline1Message, Inline1Variant } from '../../../models/inline1';
import type { Inline1MessageType } from '../../../models/inline1';
import VariantCtaFieldsEditor from '../../tests/variants/variantCtaFieldsEditor';
import { Image } from '../helpers/shared';
import { EMPTY_ERROR_HELPER_TEXT, templateValidatorForPlatform } from '../helpers/validation';
import useValidation from '../hooks/useValidation';
import { ImageEditorToggle } from '../imageEditor';
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
}

const SupportMessageEditor: React.FC<MessageEditorProps<SupportMessage>> = ({
  message,
  onChange,
  onValidationChange,
  isDisabled,
}: MessageEditorProps<SupportMessage>) => {
  const setValidationStatusForField = useValidation(onValidationChange);
  const templateValidator = templateValidatorForPlatform('DOTCOM');
  const {
    register,
    handleSubmit,
    reset,
    trigger,
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
        <SectionHeader variant="h4">Content</SectionHeader>
        <TextField
          error={errors.heading !== undefined}
          helperText={errors.heading?.message}
          {...register('heading', {
            required: EMPTY_ERROR_HELPER_TEXT,
            validate: templateValidator,
          })}
          onBlur={() => void handleSubmit(updateCopy)()}
          label="Heading"
          margin="normal"
          variant="outlined"
          disabled={isDisabled}
          fullWidth
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
    name: 'newsletterId' | 'frequency' | 'heading' | 'body';
    label: string;
  }> = [
    { name: 'newsletterId', label: 'Newsletter ID' },
    { name: 'frequency', label: 'Frequency' },
    { name: 'heading', label: 'Heading' },
    { name: 'body', label: 'Body' },
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
      <SectionHeader variant="h4">Newsletter</SectionHeader>
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

  return <Typography>Puzzles cannot be configured from RRCP.</Typography>;
};

interface Inline1VariantEditorProps {
  variant: Inline1Variant;
  onChange: (variant: Inline1Variant) => void;
  onValidationChange: (isValid: boolean) => void;
  onMessageTypeChange: (messageType: Inline1MessageType) => void;
  isDisabled: boolean;
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
