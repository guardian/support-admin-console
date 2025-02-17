import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Theme, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { templateValidatorForPlatform } from '../helpers/validation';
import { getRteCopyLength, RichTextEditorSingleLine } from '../richTextEditor/richTextEditor';
import {
  SupportLandingPageCopy,
  SupportLandingPageVariant,
} from '../../../models/supportLandingPage';

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

const HEADER_DEFAULT_HELPER_TEXT = 'Heading text';
const SUBHEADING_DEFAULT_HELPER_TEXT = 'Subheading text';

const headingCopyRecommendedLength = 500;
const subheadingCopyRecommendedLength = 500;

interface VariantContentEditorProps {
  copy: SupportLandingPageCopy;
  onChange: (updatedCopy: SupportLandingPageCopy) => void;
  onValidationChange?: (isValid: boolean) => void;
  editMode: boolean;
}

interface FormData {
  heading?: string;
  subheading?: string;
}

export const VariantContentEditor: React.FC<VariantContentEditorProps> = ({
  copy,
  onChange,
  onValidationChange,
  editMode,
}: VariantContentEditorProps) => {
  const classes = useStyles();

  const templateValidator = templateValidatorForPlatform('DOTCOM');

  const defaultValues: FormData = {
    heading: copy.heading || '',
    subheading: copy.subheading || '',
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
      ...copy,
      ...validatedFields,
    });
  }, [validatedFields]);

  useEffect(() => {
    const isValid = Object.keys(errors).length === 0;
    if (onValidationChange) {
      onValidationChange(isValid);
    }
  }, [errors.heading, errors.subheading]);

  const getSubheadingCopyLength = () => {
    if (copy.heading != null) {
      return [
        getRteCopyLength([...copy.heading, copy.heading || '']),
        headingCopyRecommendedLength,
      ];
    }
    return [
      getRteCopyLength([copy.subheading, copy.subheading || '']),
      subheadingCopyRecommendedLength,
    ];
  };

  const [copyLength, recommendedLength] = getSubheadingCopyLength();

  return (
    <>
      <div className={classes.contentContainer}>
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
                label="Heading copy"
                disabled={!editMode}
                rteMenuConstraints={{
                  noArticleCountTemplate: true,
                  noCurrencyTemplate: true,
                  noCountryNameTemplate: true,
                  noDayTemplate: true,
                  noDateTemplate: true,
                  noPriceTemplates: true,
                }}
              />
            );
          }}
        />

        <div>
          <Controller
            name="subheading"
            control={control}
            rules={{
              validate: templateValidator,
            }}
            render={data => {
              return (
                <RichTextEditorSingleLine
                  error={errors.subheading !== undefined || copyLength > recommendedLength}
                  helperText={
                    errors.subheading
                      ? errors.subheading.message || errors.subheading.type
                      : SUBHEADING_DEFAULT_HELPER_TEXT
                  }
                  copyData={data.value}
                  updateCopy={pars => {
                    data.onChange(pars);
                    handleSubmit(setValidatedFields)();
                  }}
                  name="subheading"
                  label="Subheading copy"
                  disabled={!editMode}
                  rteMenuConstraints={{
                    noArticleCountTemplate: true,
                    noCurrencyTemplate: true,
                    noCountryNameTemplate: true,
                    noDayTemplate: true,
                    noDateTemplate: true,
                    noPriceTemplates: true,
                  }}
                />
              );
            }}
          />
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

  return (
    <div className={classes.container}>
      <Typography variant={'h3'} className={classes.sectionHeader}>
        Configure Components
      </Typography>
      <div>
        <VariantContentEditor
          copy={variant.copy}
          onChange={(updatedCopy: SupportLandingPageCopy): void =>
            onVariantChange({ ...variant, copy: updatedCopy })
          }
          onValidationChange={onValidationChange}
          editMode={editMode}
        />
      </div>
    </div>
  );
};

export default VariantEditor;
