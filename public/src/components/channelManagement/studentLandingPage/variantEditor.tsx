// TODO: fix the unused variables then delete the line below.
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { StudentLandingPageVariant } from '../../../models/studentLandingPage';
import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';
import { Controller, useForm } from 'react-hook-form';
import { RichTextEditorSingleLine } from '../richTextEditor/richTextEditor';
import { EMPTY_ERROR_HELPER_TEXT, noHtmlValidator } from '../helpers/validation';

const HEADLINE_MAX_LENGTH = 20; // TODO: what should the max length of the heading be?
const SUBHEADING_MAX_LENGTH = 20; // TODO: what should the max length of the subheading be?

interface OfferFormData {
  heading: string;
  subheading: string;
}

interface StudentLandingPageVariantEditorProps {
  variant: StudentLandingPageVariant;
  editMode: boolean;
  onVariantChange: (update: (current: StudentLandingPageVariant) => StudentLandingPageVariant) => void;
  onValidationChange: (isValid: boolean) => void;
}

const getUseStyles = (shouldAddPadding: boolean) => {
  const useStyles = makeStyles(({ palette, spacing }: Theme) => ({
    container: {
      width: '100%',
      paddingTop: shouldAddPadding ? spacing(2) : 0,
      paddingLeft: shouldAddPadding ? spacing(4) : 0,
      paddingRight: shouldAddPadding ? spacing(10) : 0,

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

export const VariantEditor: React.FC<StudentLandingPageVariantEditorProps> = ({
  variant,
  editMode,
  onVariantChange,
  onValidationChange,
}: StudentLandingPageVariantEditorProps) => {
  const classes = getUseStyles(false)();

  const defaultValues: OfferFormData = {
    heading: variant.heading,
    subheading: variant.subheading,
  };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [validatedFields, setValidatedFields] = useState<OfferFormData>(defaultValues);

  const {
    handleSubmit,
    control,

    formState: { errors },
  } = useForm<OfferFormData>({
    mode: 'onChange',
    defaultValues,
  });

  useEffect(() => {
    onVariantChange(current => ({
      ...current,
      ...validatedFields,
    }));
  }, [validatedFields]);

  useEffect(() => {
    const isValid = Object.keys(errors).length === 0;
    onValidationChange(isValid);
  }, [errors.heading]);

  const isValidField = (field: string, fieldName: string, maxLength: number) => {
    const messages = [];
    if (field.length <= 0) {
      messages.push(`Please enter a ${fieldName} `);
    }
    const htmlValidation = noHtmlValidator(field);
    if (htmlValidation) {
      messages.push(`${htmlValidation} `);
    }
    if (field.length > maxLength) {
      messages.push(`The headline must not exceed ${maxLength} characters (including spaces) `);
    }
    if (messages.length > 0) {
      return messages.toString(); // TODO enhance
    }

    return true;
  };

  const isValidHeadline = (field: string) => {
    return isValidField(field, 'headline', HEADLINE_MAX_LENGTH);
  };

  const isValidSubHeading = (field: string) => {
    return isValidField(field, 'subheading', SUBHEADING_MAX_LENGTH);
  };

  return (
    <div className={classes.container}>
      <Controller
        name="heading"
        control={control}
        rules={{
          validate: isValidHeadline,
        }}
        render={({ field }) => {
          return (
            <RichTextEditorSingleLine
              error={errors.heading !== undefined}
              helperText={errors.heading ? errors.heading.message || errors.heading.type : ''}
              copyData={field.value}
              updateCopy={(value) => {
                field.onChange(value);
                handleSubmit(setValidatedFields)();
              }}
              name="heading"
              label="Heading"
              disabled={!editMode}
              rteMenuConstraints={{
                noHtml: true,
                noBold: true,
                noCurrencyTemplate: true,
                noCountryNameTemplate: true,
                noArticleCountTemplate: true,
                noPriceTemplates: true,
                noDateTemplate: true,
                noDayTemplate: true,
                noCampaignDeadlineTemplate: true,
              }}
            />
          );
        }}
      />
      <Controller
        name="subheading"
        control={control}
        rules={{
          validate: isValidSubHeading,
        }}
        render={({ field }) => {
          return (
            <RichTextEditorSingleLine
              error={errors.subheading !== undefined}
              helperText={
                errors.subheading ? errors.subheading.message || errors.subheading.type : ''
              }
              copyData={field.value}
              updateCopy={(value) => {
                field.onChange(value);
                handleSubmit(setValidatedFields)();
              }}
              name="subheading"
              label="Subheading"
              disabled={!editMode}
              rteMenuConstraints={{
                noHtml: true,
                noBold: true,
                noCurrencyTemplate: true,
                noCountryNameTemplate: true,
                noArticleCountTemplate: true,
                noPriceTemplates: true,
                noDateTemplate: true,
                noDayTemplate: true,
                noCampaignDeadlineTemplate: true,
              }}
            />
          );
        }}
      />
    </div>
  );
};
