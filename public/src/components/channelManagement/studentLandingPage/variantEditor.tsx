import React, { useEffect, useState } from 'react';
import { Institution, StudentLandingPageVariant } from '../../../models/studentLandingPage';
import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';
import { Controller, useForm } from 'react-hook-form';
import { RichTextEditorSingleLine } from '../richTextEditor/richTextEditor';
import { noHtmlValidator } from '../helpers/validation';
import { Typography } from '@mui/material';
import PromoCodesEditor from '../../shared/PromoCodesEditor';

import { AcademicInstitutionDetailEditor } from './academicInstitutionDetails';

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
    choiceCardContainer: {
      display: 'flex',
    },
  }));
  return useStyles;
};

interface StudentLandingPageVariantEditorProps {
  variant: StudentLandingPageVariant;
  editMode: boolean;
  onVariantChange: (
    update: (current: StudentLandingPageVariant) => StudentLandingPageVariant,
  ) => void;
  onValidationChange: (isValid: boolean) => void;
}

interface OfferFormData {
  heading: string;
  subheading: string;
}

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

  const [validatedFields, setValidatedFields] = useState<OfferFormData>(defaultValues);

  const updatePromoCodes = (promoCodes: string[]): void => {
    onVariantChange((current) => ({
      ...current,
      promoCodes,
    }));
  };

  const updateInstitutionDetails = (institution: Institution): void => {
    onVariantChange((current) => ({ ...current, institution }));
  };

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
  }, [errors.heading, errors.subheading]);

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
      messages.push(`The ${fieldName} must not exceed ${maxLength} characters (including spaces) `);
    }
    if (field.includes('???')) {
      messages.push(
        `Please update the subheading to include the academic institution\'s acronym instead of the ???`,
      );
    }
    if (messages.length > 0) {
      return messages.toString(); // TODO enhance
    }
    return true;
  };

  const HEADLINE_MAX_LENGTH = 65; // TODO: confirm the max length of this field
  const isValidHeadline = (field: string) => {
    return isValidField(field, 'headline', HEADLINE_MAX_LENGTH);
  };

  const SUBHEADING_MAX_LENGTH = 210; // TODO: confirm the max length of this field
  const isValidSubHeading = (field: string) => {
    return isValidField(field, 'subheading', SUBHEADING_MAX_LENGTH);
  };

  return (
    <div className={classes.container}>
      <AcademicInstitutionDetailEditor
        variant={variant}
        editMode={editMode}
        updateInstitutionDetails={updateInstitutionDetails}
        onValidationChange={onValidationChange}
      />
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
                  rteMenuConstraints={{
                    ...RTEMenuConstraints,
                    noBold: false,
                  }}
                />
              );
            }}
          />
          <PromoCodesEditor
            promoCodes={variant.promoCodes ?? []}
            updatePromoCodes={updatePromoCodes}
            isDisabled={!editMode}
          />
        </div>
      </div>
    </div>
  );
};
