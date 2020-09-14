import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  createStyles,
  TextField,
  Theme,
  Typography,
  WithStyles,
  withStyles,
} from '@material-ui/core';
import VariantEditorButtonsEditor from '../variantEditorButtonsEditor';
import { invalidTemplateValidator, EMPTY_ERROR_HELPER_TEXT } from '../helpers/validation';
import { Cta } from '../helpers/shared';
import BannerTemplateSelector from './bannerTemplateSelector';
import { BannerTemplate, BannerVariant } from '../../../models/banner';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const styles = ({ palette, spacing }: Theme) =>
  createStyles({
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
      paddingTop: spacing(1),
      paddingBottom: spacing(2),
      borderBottom: `1px solid ${palette.grey[500]}`,
      '& > * + *': {
        marginTop: spacing(3),
      },
    },
  });

const HEADER_DEFAULT_HELPER_TEXT = 'Assitive text';
const BODY_DEFAULT_HELPER_TEXT = 'Main banner message, including paragraph breaks';
const HIGHTLIGHTED_TEXT_HELPER_TEXT = 'Final sentence of body copy';

interface FormData {
  heading: string;
  body: string;
  highlightedText: string;
}

interface BannerTestVariantEditorProps extends WithStyles<typeof styles> {
  variant: BannerVariant;
  onVariantChange: (updatedVariant: BannerVariant) => void;
  editMode: boolean;
  onDelete: () => void;
  onValidationChange: (isValid: boolean) => void;
}

const BannerTestVariantEditor: React.FC<BannerTestVariantEditorProps> = ({
  classes,
  variant,
  editMode,
  onValidationChange,
  onVariantChange,
}: BannerTestVariantEditorProps) => {
  const defaultValues: FormData = {
    heading: variant.heading || '',
    body: variant.body,
    highlightedText: variant.highlightedText || '',
  };

  const { register, handleSubmit, errors } = useForm<FormData>({ mode: 'onChange', defaultValues });

  useEffect(() => {
    const isValid = Object.keys(errors).length === 0;
    onValidationChange(isValid);
  }, [errors.body, errors.heading, errors.highlightedText]);

  const onSubmit = ({ heading, body, highlightedText }: FormData): void => {
    onVariantChange({ ...variant, heading, body, highlightedText });
  };

  const updatePrimaryCta = (updatedCta?: Cta): void => {
    onVariantChange({ ...variant, cta: updatedCta });
  };
  const updateSecondaryCta = (updatedCta?: Cta): void => {
    onVariantChange({ ...variant, secondaryCta: updatedCta });
  };

  return (
    <div className={classes.container}>
      <div className={classes.sectionContainer}>
        <Typography className={classes.sectionHeader} variant="h4">
          Banner template
        </Typography>
        <BannerTemplateSelector
          variant={variant}
          onVariantChange={onVariantChange}
          editMode={editMode}
        />
      </div>

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

      {variant.template === BannerTemplate.ContributionsBanner && (
        <TextField
          inputRef={register({
            validate: invalidTemplateValidator,
          })}
          error={errors.highlightedText !== undefined}
          helperText={
            errors.highlightedText ? errors.highlightedText.message : HIGHTLIGHTED_TEXT_HELPER_TEXT
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
    </div>
  );
};

export default withStyles(styles)(BannerTestVariantEditor);
