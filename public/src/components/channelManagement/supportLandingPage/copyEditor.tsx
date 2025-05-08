import { SupportLandingPageCopy } from '../../../models/supportLandingPage';
import React, { useEffect, useState } from 'react';
import { copyLengthValidator, templateValidatorForPlatform } from '../helpers/validation';
import { Controller, useForm } from 'react-hook-form';
import { RichTextEditorSingleLine } from '../richTextEditor/richTextEditor';
import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material';

const useStyles = makeStyles(({ spacing }: Theme) => ({
  container: {
    marginLeft: spacing(2),
  },
}));

interface CopyEditorProps {
  copy: SupportLandingPageCopy;
  onChange: (updatedCopy: SupportLandingPageCopy) => void;
  onValidationChange?: (isValid: boolean) => void;
  editMode: boolean;
}

interface FormData {
  heading: string;
  subheading: string;
}

export const CopyEditor: React.FC<CopyEditorProps> = ({
  copy,
  onChange,
  onValidationChange,
  editMode,
}: CopyEditorProps) => {
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

  return (
    <>
      <div className={classes.container}>
        <Controller
          name="heading"
          control={control}
          rules={{
            required: true,
            validate: copy => templateValidator(copy) ?? copyLengthValidator(75)(copy),
          }}
          render={data => {
            return (
              <RichTextEditorSingleLine
                error={errors.heading !== undefined}
                helperText={errors?.heading?.message || errors?.heading?.type}
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
              required: true,
              validate: templateValidator,
            }}
            render={data => {
              return (
                <RichTextEditorSingleLine
                  error={errors.subheading !== undefined}
                  helperText={errors?.subheading?.message || errors?.subheading?.type}
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
