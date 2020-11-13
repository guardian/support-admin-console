import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { EpicVariant } from './epicTestsForm';
import { Cta, EpicType, TickerSettings } from '../helpers/shared';
import { Theme, Typography, makeStyles, TextField } from '@material-ui/core';
import VariantEditorButtonsEditor from '../variantEditorButtonsEditor';
import EpicTestTickerEditor from './epicTestTickerEditor';
import { invalidTemplateValidator, EMPTY_ERROR_HELPER_TEXT } from '../helpers/validation';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const getUseStyles = (isOffPlatform: boolean) => {
  const useStyles = makeStyles(({ palette, spacing }: Theme) => ({
    container: {
      width: '100%',
      paddingTop: isOffPlatform ? 0 : spacing(2),
      paddingLeft: isOffPlatform ? 0 : spacing(4),
      paddingRight: isOffPlatform ? 0 : spacing(10),

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
  epicType: EpicType;
  onVariantChange: (updatedVariant: EpicVariant) => void;
  editMode: boolean;
  onDelete: () => void;
  onValidationChange: (isValid: boolean) => void;
}

const EpicTestVariantEditor: React.FC<EpicTestVariantEditorProps> = ({
  variant,
  onVariantChange,
  editMode,
  epicType,
  onValidationChange,
}: EpicTestVariantEditorProps) => {
  const isLiveblog = epicType === 'LIVEBLOG';
  const isOffPlatform = epicType === 'APPLE_NEWS' || epicType === 'AMP';

  const classes = getUseStyles(isOffPlatform)();

  const defaultValues: FormData = {
    heading: variant.heading || '',
    body: variant.paragraphs.join('\n'),
    highlightedText: variant.highlightedText || '',
    backgroundImageUrl: variant.backgroundImageUrl || '',
    footer: variant.footer || '',
  };

  const { register, handleSubmit, errors, trigger } = useForm<FormData>({
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
        <div>
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
        </div>
      )}

      <div>
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
      </div>

      {!isLiveblog && (
        <div>
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
        </div>
      )}

      {!isLiveblog && !isOffPlatform && (
        <div>
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
        </div>
      )}

      {!isLiveblog && !isOffPlatform && (
        <div>
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
        </div>
      )}

      {epicType !== 'APPLE_NEWS' && (
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
            supportSecondaryCta={!isOffPlatform}
          />
        </div>
      )}

      {!isLiveblog && !isOffPlatform && (
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
