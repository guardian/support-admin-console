import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { EpicVariant } from './epicTestsForm';
import { Cta, TickerSettings } from '../helpers/shared';
import { Theme, Typography, makeStyles, TextField } from '@material-ui/core';
import VariantEditorButtonsEditor from '../variantEditorButtonsEditor';
import EpicTestTickerEditor from './epicTestTickerEditor';
import { invalidTemplateValidator, EMPTY_ERROR_HELPER_TEXT } from '../helpers/validation';

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

const HEADER_DEFAULT_HELPER_TEXT = 'Assitive text';
const BODY_DEFAULT_HELPER_TEXT = 'Maximum 500 characters';
const HIGHTLIGHTED_TEXT_DEFAULT_HELPER_TEXT = 'Final sentence of body copy';
const IMAGE_URL_DEFAULT_HELPER_TEXT =
  'Image ratio should be 2.5:1. This will appear above everything except a ticker';
const FOOTER_DEFAULT_HELPER_TEXT = 'Bold text that appears below the button';

interface FormData {
  heading: string;
  body: string;
  highlightedText: string;
  backgroundImageUrl: string;
  footer: string;
}

interface EpicTestVariantEditorProps {
  variant: EpicVariant;
  onVariantChange: (updatedVariant: EpicVariant) => void;
  editMode: boolean;
  isLiveblog: boolean;
  onDelete: () => void;
  onValidationChange: (isValid: boolean) => void;
}

const EpicTestVariantEditor: React.FC<EpicTestVariantEditorProps> = ({
  variant,
  onVariantChange,
  editMode,
  isLiveblog,
  onValidationChange,
}: EpicTestVariantEditorProps) => {
  const classes = useStyles();

  const defaultValues: FormData = {
    heading: variant.heading || '',
    body: variant.paragraphs.join('\n'),
    highlightedText: variant.highlightedText || '',
    backgroundImageUrl: variant.backgroundImageUrl || '',
    footer: variant.footer || '',
  };

  const { register, handleSubmit, errors } = useForm<FormData>({ mode: 'onChange', defaultValues });

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
      heading,
      paragraphs,
      highlightedText,
      backgroundImageUrl,
      footer,
    });
  };

  const updatePrimaryCta = (updatedCta?: Cta): void => {
    onVariantChange({ ...variant, cta: updatedCta });
  };
  const updateSecondaryCta = (updatedCta?: Cta): void => {
    onVariantChange({ ...variant, secondaryCta: updatedCta });
  };
  const updateTickerSettings = (updatedTickerSettings?: TickerSettings): void => {
    onVariantChange({ ...variant, tickerSettings: updatedTickerSettings });
  };

  return (
    <div className={classes.container}>
      {!isLiveblog && (
        <TextField
          inputRef={register({ validate: invalidTemplateValidator })}
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
      )}

      <TextField
        inputRef={register({
          required: EMPTY_ERROR_HELPER_TEXT,
          validate: invalidTemplateValidator,
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

      {!isLiveblog && (
        <TextField
          inputRef={register({
            validate: invalidTemplateValidator,
          })}
          error={errors.highlightedText !== undefined}
          helperText={
            errors.highlightedText
              ? errors.highlightedText.message
              : HIGHTLIGHTED_TEXT_DEFAULT_HELPER_TEXT
          }
          onBlur={handleSubmit(onSubmit)}
          name="highlightedText"
          label="Hightlighted text"
          margin="normal"
          variant="outlined"
          disabled={!editMode}
          fullWidth
        />
      )}

      {!isLiveblog && (
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
      )}

      {!isLiveblog && (
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
      )}

      <div className={classes.sectionContainer}>
        <Typography className={classes.sectionHeader} variant="h4">
          Buttons
        </Typography>

        <VariantEditorButtonsEditor
          primaryCta={variant.cta}
          secondaryCta={variant.secondaryCta}
          updatePrimaryCta={updatePrimaryCta}
          updateSecondaryCta={updateSecondaryCta}
          isDisabled={!editMode}
          onValidationChange={onValidationChange}
        />
      </div>

      {!isLiveblog && (
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
    </div>
  );
};

export default EpicTestVariantEditor;
