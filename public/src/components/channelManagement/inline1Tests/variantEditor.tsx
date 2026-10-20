import { TextField, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Inline1Message, Inline1Variant } from '../../../models/inline1';
import VariantCtaFieldsEditor from '../../tests/variants/variantCtaFieldsEditor';
import { EMPTY_ERROR_HELPER_TEXT, templateValidatorForPlatform } from '../helpers/validation';
import useValidation from '../hooks/useValidation';

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

const SectionHeader = styled(Typography)(({ theme }) => ({
  fontSize: 16,
  color: theme.palette.grey[900],
  fontWeight: 500,
}));

type SupportMessage = Extract<Inline1Message, { type: 'Inline1SupportMessage' }>;
type NewsletterMessage = Extract<Inline1Message, { type: 'Inline1NewsletterMessage' }>;
type SupportFields = Pick<SupportMessage, 'heading' | 'body' | 'imageUrl'>;

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
  } = useForm<SupportFields>({
    mode: 'onChange',
    defaultValues: { heading: message.heading, body: message.body, imageUrl: message.imageUrl },
  });

  useEffect(() => {
    reset({ heading: message.heading, body: message.body, imageUrl: message.imageUrl });
    void trigger();
  }, [message.heading, message.body, message.imageUrl, reset, trigger]);

  useEffect(() => {
    setValidationStatusForField('copy', errors.heading === undefined && errors.body === undefined);
  }, [errors.heading, errors.body, setValidationStatusForField]);

  const updateSupportMessage = ({ heading, body, imageUrl }: SupportFields): void => {
    const normalizedImageUrl = imageUrl?.trim();
    onChange({
      ...message,
      heading,
      body,
      imageUrl: normalizedImageUrl === '' ? undefined : normalizedImageUrl,
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
          onBlur={() => void handleSubmit(updateSupportMessage)()}
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
          onBlur={() => void handleSubmit(updateSupportMessage)()}
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
        <TextField
          {...register('imageUrl')}
          onBlur={() => void handleSubmit(updateSupportMessage)()}
          label="Image URL (optional)"
          margin="normal"
          variant="outlined"
          disabled={isDisabled}
          fullWidth
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
  isDisabled: boolean;
}

const Inline1VariantEditor: React.FC<Inline1VariantEditorProps> = ({
  variant,
  onChange,
  onValidationChange,
  isDisabled,
}: Inline1VariantEditorProps) => {
  switch (variant.message.type) {
    case 'Inline1SupportMessage':
      return (
        <SupportMessageEditor
          message={variant.message}
          onChange={(message) => onChange({ ...variant, message })}
          onValidationChange={onValidationChange}
          isDisabled={isDisabled}
        />
      );
    case 'Inline1PuzzlesMessage':
      return <PuzzlesMessageEditor onValidationChange={onValidationChange} />;
    case 'Inline1NewsletterMessage':
      return (
        <NewsletterMessageEditor
          message={variant.message}
          onChange={(message) => onChange({ ...variant, message })}
          onValidationChange={onValidationChange}
          isDisabled={isDisabled}
        />
      );
  }
};

export default Inline1VariantEditor;
