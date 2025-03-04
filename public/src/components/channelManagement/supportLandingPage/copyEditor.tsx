import { SupportLandingPageCopy } from '../../../models/supportLandingPage';
import React, { useEffect, useState } from 'react';
import { templateValidatorForPlatform } from '../helpers/validation';
import { Controller, useForm } from 'react-hook-form';
import { getRteCopyLength, RichTextEditorSingleLine } from '../richTextEditor/richTextEditor';
import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material';

const useStyles = makeStyles(({ spacing }: Theme) => ({
  contentContainer: {
    marginLeft: spacing(2),
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
