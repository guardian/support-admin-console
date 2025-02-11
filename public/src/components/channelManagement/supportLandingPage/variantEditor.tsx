import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Theme, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import {
  EMPTY_ERROR_HELPER_TEXT,
  getEmptyParagraphsError,
  templateValidatorForPlatform,
} from '../helpers/validation';
import { BannerContent } from '../../../models/banner';
import { getDefaultVariant } from './utils/defaults';
import useValidation from '../hooks/useValidation';
import {
  getRteCopyLength,
  RichTextEditor,
  RichTextEditorSingleLine,
} from '../richTextEditor/richTextEditor';
import {
  SupportLandingPageContent,
  SupportLandingPageVariant,
} from '../../../models/supportLandingPage';
import ConfigureComponentsEditor from './configureComponentsEditor';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
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

const HEADER_DEFAULT_HELPER_TEXT = 'Assitive text';
const BODY_DEFAULT_HELPER_TEXT = 'Main banner message paragraph';

const BODY_COPY_WITHOUT_SECONDARY_CTA_RECOMMENDED_LENGTH = 500;
const BODY_COPY_WITH_SECONDARY_CTA_RECOMMENDED_LENGTH = 500;

type DeviceType = 'ALL' | 'MOBILE' | 'NOT_MOBILE';

const getLabelSuffix = (deviceType: DeviceType): string => {
  switch (deviceType) {
    case 'MOBILE':
      return ' (mobile only)';
    case 'NOT_MOBILE':
      return ' (tablet + desktop)';
    default:
      return ' (all devices)';
  }
};

interface VariantContentEditorProps {
  content: SupportLandingPageContent;
  onChange: (updatedContent: BannerContent) => void;
  onValidationChange?: (isValid: boolean) => void;
  editMode: boolean;
  deviceType: DeviceType;
  showHeader: boolean;
  showBody: boolean;
}

interface FormData {
  heading?: string;
  paragraphs: string[];
  highlightedText?: string;
}

// Temporary, while we migrate from messageText to paragraphs
const getParagraphsOrMessageText = (
  paras: string[] | undefined,
  text: string | undefined,
): string[] => {
  const bodyCopy = [];

  if (paras != null) {
    bodyCopy.push(...paras);
  } else if (text != null) {
    bodyCopy.push(text);
  }
  return bodyCopy;
};

export const VariantContentEditor: React.FC<VariantContentEditorProps> = ({
  content,
  onChange,
  onValidationChange,
  editMode,
  deviceType,
  showHeader,
  showBody,
}: VariantContentEditorProps) => {
  const classes = useStyles();

  const templateValidator = templateValidatorForPlatform('DOTCOM');

  const defaultValues: FormData = {
    heading: content.heading || '',
    paragraphs: getParagraphsOrMessageText(content.paragraphs, content.messageText),
    highlightedText: content.highlightedText || '',
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
      messageText: undefined,
    });
  }, [validatedFields]);

  useEffect(() => {
    const isValid = Object.keys(errors).length === 0;
    onValidationChange(isValid);
  }, [errors.heading, errors.paragraphs, errors.highlightedText]);

  const labelSuffix = getLabelSuffix(deviceType);

  const getBodyCopyLength = () => {
    const bodyCopyRecommendedLength = content.secondaryCta
      ? BODY_COPY_WITH_SECONDARY_CTA_RECOMMENDED_LENGTH
      : BODY_COPY_WITHOUT_SECONDARY_CTA_RECOMMENDED_LENGTH;

    if (content.paragraphs != null) {
      return [
        getRteCopyLength([...content.paragraphs, content.highlightedText || '']),
        bodyCopyRecommendedLength,
      ];
    }
    return [
      getRteCopyLength([content.messageText || '', content.highlightedText || '']),
      bodyCopyRecommendedLength,
    ];
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

  console.log('showHeader', showHeader);
  console.log('showBody', showBody);
  return (
    <>
      <Typography className={classes.sectionHeader} variant="h4">
        {`Content${labelSuffix}`}
      </Typography>

      <div className={classes.contentContainer}>
        {showHeader && (
          <Controller
            name="heading"
            control={control}
            rules={{
              validate: templateValidator,
            }}
            render={data => {
              return (
                <RichTextEditorSingleLine
                  error={errors.heading !== undefined}
                  helperText={
                    errors.heading
                      ? errors.heading.message || errors.heading.type
                      : HEADER_DEFAULT_HELPER_TEXT
                  }
                  copyData={data.value}
                  updateCopy={pars => {
                    data.onChange(pars);
                    handleSubmit(setValidatedFields)();
                  }}
                  name="heading"
                  label="Header"
                  disabled={!editMode}
                  rteMenuConstraints={{
                    noBold: true,
                  }}
                />
              );
            }}
          />
        )}

        <div>
          {showBody && (
            <Controller
              name="paragraphs"
              control={control}
              rules={{
                required: true,
                validate: (pars: string[]) =>
                  getEmptyParagraphsError(pars) ??
                  pars.map(templateValidator).find((result: string | undefined) => !!result),
              }}
              render={data => {
                return (
                  <RichTextEditor
                    error={errors.paragraphs !== undefined || copyLength > recommendedLength}
                    helperText={
                      errors.paragraphs
                        ? // @ts-ignore -- react-hook-form doesn't believe it has a message field
                          errors.paragraphs.message || errors.paragraphs.type
                        : getParagraphsHelperText()
                    }
                    copyData={data.value}
                    updateCopy={pars => {
                      data.onChange(pars);
                      handleSubmit(setValidatedFields)();
                    }}
                    name="paragraphs"
                    label="Body copy"
                    disabled={!editMode}
                  />
                );
              }}
            />
          )}
        </div>
      </div>
    </>
  );
};

interface VariantEditorProps {
  variant: SupportLandingPageVariant;
  onVariantChange: (updatedVariant: SupportLandingPageVariant) => void;
  editMode: boolean;
  onDelete: () => void;
  onValidationChange: (isValid: boolean) => void;
}

const VariantEditor: React.FC<VariantEditorProps> = ({
  variant,
  editMode,
  onValidationChange,
  onVariantChange,
}: VariantEditorProps) => {
  const classes = useStyles();
  const setValidationStatusForField = useValidation(onValidationChange);

  const onMobileContentRadioChange = (): void => {
    if (variant.mobileLandingPageContent === undefined) {
      onVariantChange({
        ...variant,
        mobileLandingPageContent: getDefaultVariant().landingPageContent,
      });
    } else {
      // remove mobile content and clear any validation errors
      setValidationStatusForField('mobileContent', true);
      onVariantChange({
        ...variant,
        mobileLandingPageContent: undefined,
      });
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.sectionContainer}>
        <div className={classes.sectionContainer}>
          <Typography variant={'h3'} className={classes.sectionHeader}>
            Configure Components
          </Typography>
          <div>
            <ConfigureComponentsEditor
              variant={variant}
              onVariantChange={onVariantChange}
              content={variant.landingPageContent}
              onChange={(updatedContent: SupportLandingPageContent): void =>
                onVariantChange({ ...variant, landingPageContent: updatedContent })
              }
              onValidationChange={(isValid: boolean): void =>
                setValidationStatusForField(variant.name, isValid)
              }
              editMode={editMode}
              deviceType={variant.mobileLandingPageContent === undefined ? 'ALL' : 'NOT_MOBILE'}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VariantEditor;
