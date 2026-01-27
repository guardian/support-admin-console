// TODO: fix the unused variables then delete the line below.
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Institution, StudentLandingPageVariant } from '../../../models/studentLandingPage';
import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';
import { Controller, useForm } from 'react-hook-form';
import { RichTextEditorSingleLine } from '../richTextEditor/richTextEditor';
import { noHtmlValidator } from '../helpers/validation';
import { Typography } from '@mui/material';

const HEADLINE_MAX_LENGTH = 65; // TODO: what should the max length of the heading be? Based on existing copy.
const SUBHEADING_MAX_LENGTH = 210; // TODO: what should the max length of the subheading be? Based on existing with buffer.

const RTEMenuConstraints = {
  noHtml: true,
  noBold: true,
  noCurrencyTemplate: true,
  noCountryNameTemplate: true,
  noArticleCountTemplate: true,
  noPriceTemplates: true,
  noDateTemplate: true,
  noDayTemplate: true,
  noCampaignDeadlineTemplate: true,
};

interface OfferFormData {
  heading: string;
  subheading: string;
  institution: Institution;
}

interface StudentLandingPageVariantEditorProps {
  variant: StudentLandingPageVariant;
  editMode: boolean;
  onVariantChange: (
    update: (current: StudentLandingPageVariant) => StudentLandingPageVariant,
  ) => void;
  onValidationChange: (isValid: boolean) => void;
}

const getUseStyles = (shouldAddPadding: boolean) => {
  const useStyles = makeStyles(({ palette, spacing }: Theme) => ({
    container: {
      width: '98%',
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
    institution: variant.institution,
  };

  const [validatedFields, setValidatedFields] = useState<OfferFormData>(defaultValues);

  const {
    handleSubmit,
    control,
    trigger,

    formState: { errors },
  } = useForm<OfferFormData>({
    mode: 'onChange',
    defaultValues,
  });

  useEffect(() => {
    trigger();
  }, []);

  useEffect(() => {
    onVariantChange((current) => ({
      ...current,
      ...validatedFields,
    }));
  }, [validatedFields]);

  useEffect(() => {
    const isValid = Object.keys(errors).length === 0;
    onValidationChange(isValid);
  }, [errors.heading, errors.subheading, errors.institution]);

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
    if (field.includes('???')) {
      console.log('hit the ??? message');
      messages.push(
        `Please update the subheading to include the academic institution\'s acronym instead of the ???`,
      );
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

  const isValidAcronym = (field: string) => {
    return isValidField(field, 'acronym', 4);
  };

  const isValidInstitutionName = (field: string) => {
    return isValidField(field, 'name', 150);
  };

  const isValidInstitutionUrl = (field: string) => {
    return isValidField(field, 'logoUrl', 150);
  };

  return (
    <div className={classes.container}>
      <div className={classes.container}>
        <Typography variant={'h4'} className={classes.sectionHeader}>
          Institution Details
        </Typography>

        <div className={classes.container}>
          <Controller
            name="institution.name"
            control={control}
            rules={{
              validate: isValidInstitutionName,
            }}
            render={({ field }) => {
              return (
                <RichTextEditorSingleLine
                  error={errors.institution?.name !== undefined}
                  helperText={
                    errors.institution?.name
                      ? errors.institution?.name.message || errors.institution?.name.type
                      : ''
                  }
                  copyData={field.value}
                  updateCopy={(value) => {
                    field.onChange(value);
                    handleSubmit(setValidatedFields)();
                  }}
                  name="institution.name"
                  label="Full name of Institution"
                  disabled={!editMode}
                  rteMenuConstraints={RTEMenuConstraints}
                />
              );
            }}
          />

          <Controller
            name="institution.acronym"
            control={control}
            rules={{
              validate: isValidAcronym,
            }}
            render={({ field }) => {
              return (
                <RichTextEditorSingleLine
                  error={errors.institution?.acronym !== undefined}
                  helperText={
                    errors.institution?.acronym
                      ? errors.institution?.acronym.message || errors.institution?.acronym.type
                      : ''
                  }
                  copyData={field.value}
                  updateCopy={(value) => {
                    field.onChange(value);
                    handleSubmit(setValidatedFields)();
                  }}
                  name="acronym"
                  label="Acronym of Institution"
                  disabled={!editMode}
                  rteMenuConstraints={RTEMenuConstraints}
                />
              );
            }}
          />

          <Controller
            name="institution.logoUrl"
            control={control}
            rules={{
              validate: isValidInstitutionUrl,
            }}
            render={({ field }) => {
              return (
                <RichTextEditorSingleLine
                  error={errors.institution?.logoUrl !== undefined}
                  helperText={
                    errors.institution?.logoUrl
                      ? errors.institution?.logoUrl.message || errors.institution?.logoUrl.type
                      : ''
                  }
                  copyData={field.value}
                  updateCopy={(value) => {
                    field.onChange(value);
                    handleSubmit(setValidatedFields)();
                  }}
                  name="logoUrl"
                  label="URL for logo of Institution"
                  disabled={!editMode}
                  rteMenuConstraints={RTEMenuConstraints}
                />
              );
            }}
          />
        </div>
      </div>

      <div className={classes.container}>
        <Typography variant={'h4'} className={classes.sectionHeader}>
          Copy
        </Typography>
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
                  rteMenuConstraints={RTEMenuConstraints}
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
                  rteMenuConstraints={{ ...RTEMenuConstraints, noBold: false }}
                />
              );
            }}
          />
        </div>
      </div>
    </div>
  );
};
