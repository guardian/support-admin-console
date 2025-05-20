import React, { useEffect, useState } from 'react';
import { GutterContent, GutterVariant } from '../../../models/gutter';
import useValidation from '../hooks/useValidation';
import { makeStyles } from '@mui/styles';
import { Theme, Typography } from '@mui/material';
import VariantCtasEditor from './variantCtasEditor';
import {
  EMPTY_ERROR_HELPER_TEXT,
  getEmptyParagraphsError,
  templateValidatorForPlatform,
} from '../helpers/validation';
import { Cta, Image } from '../helpers/shared';
import { Controller, useForm } from 'react-hook-form';
import { getRteCopyLength, RichTextEditor } from '../richTextEditor/richTextEditor';
import { ImageEditorToggle } from '../imageEditor';
import { DEFAULT_IMAGE_URL, DEFAULT_IMAGE_ALT } from './utils/defaults';

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

const BODY_COPY_RECOMMENDED_LENGTH = 300;
const BODY_DEFAULT_HELPER_TEXT = 'Main gutter message paragraph';

interface FormData {
  image: Image;
  bodyCopy: string[];
  cta?: Cta;
}
interface VariantContentEditorProps {
  variant: GutterContent;
  onVariantChange: (updatedContent: GutterContent) => void;
  onValidationChange: (isValid: boolean) => void;
  editMode: boolean;
}

const VariantContentEditor: React.FC<VariantContentEditorProps> = ({
  variant,
  onVariantChange,
  onValidationChange,
  editMode,
}: VariantContentEditorProps) => {
  const classes = useStyles();

  const getBodyCopyLength = () => {
    const bodyCopyRecommendedLength = BODY_COPY_RECOMMENDED_LENGTH;

    if (variant.bodyCopy != null) {
      return [getRteCopyLength([...variant.bodyCopy]), bodyCopyRecommendedLength];
    }
    return [getRteCopyLength([variant.bodyCopy]), bodyCopyRecommendedLength];
  };

  const [copyLength, recommendedLength] = getBodyCopyLength();

  const getParagraphsHelperText = () => {
    if (!copyLength) {
      return EMPTY_ERROR_HELPER_TEXT;
    }
    if (copyLength > recommendedLength) {
      return `This copy is longer than the recommended length (${recommendedLength} chars). Please preview before publishing.`;
    }
    return `${BODY_DEFAULT_HELPER_TEXT} (${recommendedLength} chars)`;
  };
  const templateValidator = templateValidatorForPlatform('DOTCOM');

  const defaultValues: FormData = {
    image: variant.image,
    bodyCopy: variant.bodyCopy,
    cta: variant.cta,
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
    onVariantChange({
      ...variant,
      ...validatedFields,
    });
  }, [validatedFields]);

  useEffect(() => {
    const isValid = Object.keys(errors).length === 0;
    onValidationChange(isValid);
  }, [errors.image, errors.bodyCopy, errors.cta?.baseUrl, errors.cta?.text]);

  const updateImage = (image?: Image): void => {
    if (image) {
      onVariantChange({ ...variant, image });
    } else {
      onVariantChange({
        ...variant,
        image: { mainUrl: DEFAULT_IMAGE_URL, altText: DEFAULT_IMAGE_ALT },
      });
    }
  };

  const updatePrimaryCta = (updatedCta?: Cta): void => {
    onVariantChange({ ...variant, cta: updatedCta });
  };

  return (
    <div className={classes.container}>
      <div className={classes.sectionContainer}>
        <Typography className={classes.sectionHeader} variant="h4">
          Header Image
        </Typography>

        <ImageEditorToggle
          image={variant.image}
          updateImage={updateImage}
          isDisabled={!editMode}
          onValidationChange={onValidationChange}
          label={'Image - appears above copy instead of a heading.'}
          guidance={
            'The viewbox needs dimensions of 0, 0, 150, 100 and the file format should be SVG. The background colour will be Guardian blue.'
          }
        />
      </div>

      <div className={classes.sectionContainer}>
        <Typography className={classes.sectionHeader} variant="h4">
          Body Copy
        </Typography>

        <Controller
          name="bodyCopy"
          control={control}
          rules={{
            required: true,
            validate: (paras: string[]) =>
              getEmptyParagraphsError(paras) ??
              paras.map(templateValidator).find((result: string | undefined) => !!result),
          }}
          render={({ field }) => {
            return (
              <RichTextEditor
                error={errors.bodyCopy !== undefined || copyLength > recommendedLength}
                helperText={
                  errors.bodyCopy
                    ? // @ts-ignore -- react-hook-form doesn't believe it has a message field
                      errors.bodyCopy.message || errors.bodyCopy.type
                    : getParagraphsHelperText()
                }
                copyData={field.value}
                updateCopy={paras => {
                  field.onChange(paras);
                  handleSubmit(setValidatedFields)();
                }}
                name="copy"
                label="Body copy"
                disabled={!editMode}
                rteMenuConstraints={{
                  noHtml: true,
                  noCurrencyTemplate: true,
                  noCountryNameTemplate: true,
                  noArticleCountTemplate: true,
                  noPriceTemplates: true,
                  noDateTemplate: true,
                  noDayTemplate: true,
                }}
              />
            );
          }}
        />
      </div>

      <div className={classes.buttonsContainer}>
        <Typography className={classes.sectionHeader} variant="h4">
          Button
        </Typography>

        <VariantCtasEditor
          primaryCta={variant.cta}
          updatePrimaryCta={updatePrimaryCta}
          isDisabled={!editMode}
          onValidationChange={onValidationChange}
        />
      </div>
    </div>
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
          variant={variant.content}
          onVariantChange={(updatedContent: GutterContent): void =>
            onVariantChange({ ...variant, content: updatedContent })
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
