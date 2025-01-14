import React, { useEffect, useState } from 'react';
import { GutterContent, GutterVariant } from '../../../models/gutter';
import useValidation from '../hooks/useValidation';
import { makeStyles } from '@mui/styles';
import { Theme, Typography } from '@mui/material';
import VariantCtasEditor from './variantCtasEditor';
import { EMPTY_ERROR_HELPER_TEXT, getEmptyParagraphError } from '../helpers/validation';
import { Cta } from '../helpers/shared';
import { Controller, useForm } from 'react-hook-form';
import { getRteCopyLength, RichTextEditor } from '../richTextEditor/richTextEditor';

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

const BODY_COPY_RECOMMENDED_LENGTH = 500;
// const HEADER_DEFAULT_HELPER_TEXT = 'Assistive text';
const BODY_DEFAULT_HELPER_TEXT = 'Main gutter message paragraph';

interface VariantContentEditorProps {
  content: GutterContent;
  onChange: (updatedContent: GutterContent) => void;
  onValidationChange: (isValid: boolean) => void;
  editMode: boolean;
}

// TODO: fix this data.
interface FormData {
  imageUrl: string; // should this be a URL type?
  altText: string; // this might be better in a new type - or perhaps one exists already.
  bodyCopy: string;
  cta?: Cta;
}

const VariantContentEditor: React.FC<VariantContentEditorProps> = ({
  content,
  onChange,
  onValidationChange,
  editMode,
}: VariantContentEditorProps) => {
  const classes = useStyles();

  const getBodyCopyLength = () => {
    const bodyCopyRecommendedLength = BODY_COPY_RECOMMENDED_LENGTH;

    if (content.bodyCopy != null) {
      return [getRteCopyLength([...content.bodyCopy]), bodyCopyRecommendedLength];
    }
    return [getRteCopyLength([content.bodyCopy]), bodyCopyRecommendedLength];
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

  const defaultValues: FormData = {
    imageUrl: content.imageUrl,
    altText: content.altText,
    bodyCopy: content.bodyCopy,
    cta: content.cta,
  };

  /**
   * Only some fields are validated by the useForm here.
   * Ideally we'd combine the validated fields with the rest of the variant fields in a callback (inside the RTE Controllers below).
   * But the callback closes over the old state of `content`, causing it to overwrite changes to non-validated fields.
   * So instead we write updates to the validated fields to the `validatedFields` state, and merge with the rest of
   * `content` in a useEffect.
   */
  const [validatedFields, setValidatedFields] = useState<FormData>(defaultValues);
  const { handleSubmit, control, errors, trigger } = useForm<FormData>({
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
    });
  }, [validatedFields]);

  useEffect(() => {
    const isValid = Object.keys(errors).length === 0;
    onValidationChange(isValid);
  }, [errors.imageUrl, errors.altText, errors.bodyCopy, errors.cta?.baseUrl, errors.cta?.text]);

  const updatePrimaryCta = (updatedCta?: Cta): void => {
    onChange({ ...content, cta: updatedCta });
  };

  return (
    <>
      {/* TODO: add image url and alt text fields here */}

      <Typography className={classes.sectionHeader} variant="h4">
        Body Copy
      </Typography>

      <div>
        <Controller
          name="bodyContent"
          control={control}
          rules={{
            required: true,
            validate: (pars: string) => getEmptyParagraphError(pars),
          }}
          render={data => {
            return (
              <RichTextEditor
                error={errors.bodyCopy !== undefined || copyLength > recommendedLength}
                helperText={
                  errors.bodyCopy
                    ? // @ts-ignore -- react-hook-form doesn't believe it has a message field
                      errors.bodyCopy.message || errors.bodyCopy.type
                    : getParagraphsHelperText()
                }
                copyData={data.value}
                updateCopy={pars => {
                  data.onChange(pars);
                  handleSubmit(setValidatedFields)();
                }}
                name="body copy"
                label="Body copy"
                disabled={!editMode}
              />
            );
          }}
        />

        <div className={classes.buttonsContainer}>
          <Typography className={classes.sectionHeader} variant="h4">
            Button
          </Typography>

          <VariantCtasEditor
            primaryCta={content.cta}
            updatePrimaryCta={updatePrimaryCta}
            isDisabled={!editMode}
            onValidationChange={onValidationChange}
          />
        </div>
      </div>
    </>
  );
};

interface GutterVariantEditorProps {
  variant: GutterVariant;
  onVariantChange: (updatedVariant: GutterVariant) => void;
  editMode: boolean;
  onValidationChange: (isValid: boolean) => void;
  onDelete: () => void;
}

const GutterVariantEditor: React.FC<GutterVariantEditorProps> = ({
  variant,
  onVariantChange,
  editMode,
  onValidationChange,
}: GutterVariantEditorProps) => {
  const classes = useStyles();
  const setValidationStatusForField = useValidation(onValidationChange);

  return (
    <div className={classes.container}>
      <div className={classes.sectionContainer}>
        <VariantContentEditor
          content={variant.gutterContent}
          onChange={(updatedContent: GutterContent): void =>
            onVariantChange({ ...variant, gutterContent: updatedContent })
          }
          onValidationChange={(isValid): void =>
            setValidationStatusForField('mainContent', isValid)
          }
          editMode={editMode}
        />
      </div>
    </div>
  );
};

export default GutterVariantEditor;
