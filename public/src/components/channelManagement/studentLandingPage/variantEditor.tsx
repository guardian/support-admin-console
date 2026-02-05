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
import { ImageGuidance, ResponsiveImageEditor } from '../../shared/ResponsiveImageEditor';
import { ResponsiveImage } from '../../../models/shared';

const HEADLINE_MAX_LENGTH = 65; // TODO: confirm the max length of this field
const SUBHEADING_MAX_LENGTH = 210; // TODO: confirm the max length of this field
const imageGuidance: ImageGuidance = {
  mobileUrl: '1:1 min width of ? max width of ?',
  tabletUrl: '1:1 min width of ? max width of ?',
  desktopUrl: '1:1 min width of ? max width of ?',
};

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

const useStyles = makeStyles(({ palette, spacing }: Theme) => ({
  container: {
    width: '98%',
    paddingTop: 0,
    paddingLeft: 0,
    paddingRight: 0,

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
  const classes = useStyles();

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

  const updateImage = (image: ResponsiveImage): void => {
    onVariantChange((current) => ({ ...current, image }));
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

  const isValidHeadline = (field: string) => {
    return isValidField(field, 'headline', HEADLINE_MAX_LENGTH);
  };

  const isValidSubHeading = (field: string) => {
    return isValidField(field, 'subheading', SUBHEADING_MAX_LENGTH);
  };

  // console.log(`region is: ${variant.region}`);

  return (
    <div className={classes.container}>
      <AcademicInstitutionDetailEditor
        variant={variant}
        editMode={editMode}
        updateInstitutionDetails={updateInstitutionDetails}
        onValidationChange={onValidationChange}
      />
      <hr />
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
        </div>
        <div className={classes.container}>
          <Typography variant={'h4'} className={classes.sectionHeader}>
            Image
          </Typography>
          <Typography>Please set 3 images which will be used at the 3 breakpoints</Typography>
          <ResponsiveImageEditor
            image={variant.image}
            isDisabled={!editMode}
            onValidationChange={onValidationChange}
            onChange={updateImage}
            imageGuidance={imageGuidance}
          />
        </div>
      </div>
      <div className={classes.container}>
        <Typography variant={'h4'} className={classes.sectionHeader}>
          Promo Code
        </Typography>
        <PromoCodesEditor
          promoCodes={variant.promoCodes ?? []}
          updatePromoCodes={updatePromoCodes}
          isDisabled={!editMode}
        />
      </div>
    </div>
  );
};
