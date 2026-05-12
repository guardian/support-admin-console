import { Theme, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { GutterContent, GutterVariant } from '../../../models/gutter';
import PromoCodesEditor from '../../shared/PromoCodesEditor';
import { Cta, Image } from '../helpers/shared';
import {
  EMPTY_ERROR_HELPER_TEXT,
  getEmptyParagraphsError,
  templateValidatorForPlatform,
} from '../helpers/validation';
import useValidation from '../hooks/useValidation';
import { ImageEditorToggle } from '../imageEditor';
import { getRteCopyLength, RichTextEditor } from '../richTextEditor/richTextEditor';
import { DEFAULT_IMAGE_ALT, DEFAULT_IMAGE_URL } from './utils/defaults';
import VariantCtasEditor from './variantCtasEditor';

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
const CTA_COPY_MAX_LENGTH = 15;

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
    return [getRteCopyLength([...variant.bodyCopy]), bodyCopyRecommendedLength];
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

  const defaultValues = useMemo<FormData>(
    () => ({
      image: { ...variant.image },
      bodyCopy: [...variant.bodyCopy],
      cta: variant.cta ? { ...variant.cta } : undefined,
    }),
    [variant.image, variant.bodyCopy, variant.cta],
  );

  /**
   * Only some fields are validated by the useForm here.
   * Ideally we'd combine the validated fields with the rest of the variant fields in a callback (inside the RTE Controllers below).
   * But the callback closes over the old state of `content`, causing it to overwrite changes to non-validated fields.
   * So instead we write updates to the validated fields to the `validatedFields` state, and merge with the rest of
   * `content` in a useEffect.
   */
  const [validatedFields, setValidatedFields] = useState<FormData>(defaultValues);
  const setContentValidationStatusForField = useValidation(onValidationChange);

  // Use refs to stabilize callback dependencies and prevent infinite render loops
  const onVariantChangeRef = useRef(onVariantChange);
  const setContentValidationStatusForFieldRef = useRef(setContentValidationStatusForField);
  const variantRef = useRef(variant);

  useEffect(() => {
    onVariantChangeRef.current = onVariantChange;
    setContentValidationStatusForFieldRef.current = setContentValidationStatusForField;
    variantRef.current = variant;
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

  const prevBodyCopyIsValidRef = useRef<boolean | null>(null);

  useEffect(() => {
    const isValid = errors.bodyCopy === undefined;
    if (prevBodyCopyIsValidRef.current !== isValid) {
      prevBodyCopyIsValidRef.current = isValid;
      setContentValidationStatusForFieldRef.current('bodyCopy', isValid);
    }
  }, [errors.bodyCopy]);

  const onImageValidationChange = useCallback((isValid: boolean): void => {
    setContentValidationStatusForFieldRef.current('image', isValid);
  }, []);

  const onCtaValidationChange = useCallback((isValid: boolean): void => {
    setContentValidationStatusForFieldRef.current('cta', isValid);
  }, []);

  const prevValidatedFieldsRef = useRef<FormData>(validatedFields);

  useEffect(() => {
    // Only call onVariantChange if validatedFields has actually changed
    const prev = prevValidatedFieldsRef.current;
    const hasChanged =
      prev.bodyCopy.length !== validatedFields.bodyCopy.length ||
      prev.bodyCopy.some((p, i) => p !== validatedFields.bodyCopy[i]) ||
      prev.image.mainUrl !== validatedFields.image.mainUrl ||
      prev.image.altText !== validatedFields.image.altText ||
      prev.cta?.text !== validatedFields.cta?.text ||
      prev.cta?.baseUrl !== validatedFields.cta?.baseUrl;

    if (hasChanged) {
      prevValidatedFieldsRef.current = validatedFields;
      onVariantChangeRef.current({
        ...variantRef.current,
        ...validatedFields,
      });
    }
  }, [validatedFields]);

  const updateImage = (image?: Image): void => {
    if (image) {
      setValidatedFields((current) => {
        if (current.image.mainUrl === image.mainUrl && current.image.altText === image.altText) {
          return current;
        }
        return { ...current, image };
      });
    } else {
      setValidatedFields((current) => ({
        ...current,
        image: { mainUrl: DEFAULT_IMAGE_URL, altText: DEFAULT_IMAGE_ALT },
      }));
    }
  };

  const updatePrimaryCta = (updatedCta?: Cta): void => {
    setValidatedFields((current) => {
      if (current.cta?.text === updatedCta?.text && current.cta?.baseUrl === updatedCta?.baseUrl) {
        return current;
      }
      return { ...current, cta: updatedCta };
    });
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
          onValidationChange={onImageValidationChange}
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
                      (errors.bodyCopy.message ?? errors.bodyCopy.type)
                    : getParagraphsHelperText()
                }
                copyData={field.value}
                updateCopy={(paras) => {
                  field.onChange(paras);
                  void handleSubmit(setValidatedFields)();
                }}
                name="copy"
                label="Body copy"
                disabled={!editMode}
                rteMenuConstraints={{
                  enableHtml: true,
                  enableStrikethrough: true,
                  enableCopyTemplates: true,
                  enableLink: true,
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
          onValidationChange={onCtaValidationChange}
          copyLength={CTA_COPY_MAX_LENGTH}
        />
      </div>
    </div>
  );
};

interface GutterVariantEditorProps {
  variant: GutterVariant;
  onVariantChange: (update: (current: GutterVariant) => GutterVariant) => void;
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
  const onVariantChangeRef = useRef(onVariantChange);
  const setValidationStatusForFieldRef = useRef(setValidationStatusForField);

  useEffect(() => {
    onVariantChangeRef.current = onVariantChange;
    setValidationStatusForFieldRef.current = setValidationStatusForField;
  });

  const onContentChange = useCallback((updatedContent: GutterContent): void => {
    onVariantChangeRef.current((current) => {
      if (current.content === updatedContent) {
        return current;
      }
      return { ...current, content: updatedContent };
    });
  }, []);

  const onMainContentValidationChange = useCallback((isValid: boolean): void => {
    setValidationStatusForFieldRef.current('mainContent', isValid);
  }, []);

  const updatePromoCodes = useCallback((promoCodes: string[]): void => {
    onVariantChangeRef.current((current) => {
      const currentPromoCodes = current.promoCodes ?? [];
      if (
        currentPromoCodes.length === promoCodes.length &&
        currentPromoCodes.every((promoCode, index) => promoCode === promoCodes[index])
      ) {
        return current;
      }
      return { ...current, promoCodes };
    });
  }, []);

  return (
    <div className={classes.container}>
      <div className={classes.sectionContainer}>
        <VariantContentEditor
          variant={variant.content}
          onVariantChange={onContentChange}
          onValidationChange={onMainContentValidationChange}
          editMode={editMode}
        />
        <PromoCodesEditor
          promoCodes={variant.promoCodes ?? []}
          updatePromoCodes={updatePromoCodes}
          isDisabled={!editMode}
        />
      </div>
    </div>
  );
};

export default GutterVariantEditor;
